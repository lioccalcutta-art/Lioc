import sys
import os
import json
import base64
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional, Dict
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.core.config import settings

security_bearer = HTTPBearer(auto_error=False)


def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def base64url_decode(data_str: str) -> bytes:
    padding = "=" * (4 - (len(data_str) % 4)) if len(data_str) % 4 != 0 else ""
    return base64.urlsafe_b64decode((data_str + padding).encode("utf-8"))


def generate_reference_id(prefix: str = "LQ") -> str:
    """Generate a clean, unique human-readable tracking ID for leads/quotes/samples."""
    random_part = secrets.token_hex(3).upper()
    timestamp_part = datetime.now(timezone.utc).strftime("%y%m%d")
    return f"{prefix}-{timestamp_part}-{random_part}"


def hash_password(plain_password: str, salt: Optional[str] = None, iterations: int = 100_000) -> str:
    """
    Generate a secure PBKDF2-HMAC-SHA256 password hash.
    Format: pbkdf2_sha256$iterations$salt$hash_hex
    """
    if not salt:
        salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac(
        "sha256",
        plain_password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    )
    return f"pbkdf2_sha256${iterations}${salt}${dk.hex()}"


def verify_password(plain_password: str, stored_hash_or_pass: str) -> bool:
    """
    Verify a password against a PBKDF2 hash or fallback comparison in constant time.
    """
    if not stored_hash_or_pass:
        return False

    if stored_hash_or_pass.startswith("pbkdf2_sha256$"):
        try:
            parts = stored_hash_or_pass.split("$")
            if len(parts) != 4:
                return False
            _, iterations_str, salt, expected_hash = parts
            iterations = int(iterations_str)
            computed_dk = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                salt.encode("utf-8"),
                iterations,
            )
            return hmac.compare_digest(computed_dk.hex(), expected_hash)
        except Exception:
            return False

    # Plain text constant-time fallback
    return hmac.compare_digest(plain_password.strip(), stored_hash_or_pass.strip())


def create_access_token(payload: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create standard HMAC-SHA256 JWT token using Python standard library."""
    header = {"alg": "HS256", "typ": "JWT"}
    to_encode = payload.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": int(expire.timestamp()), "iat": int(now.timestamp())})

    header_json = json.dumps(header, separators=(",", ":")).encode("utf-8")
    payload_json = json.dumps(to_encode, separators=(",", ":")).encode("utf-8")

    header_b64 = base64url_encode(header_json)
    payload_b64 = base64url_encode(payload_json)

    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(settings.JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    signature_b64 = base64url_encode(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify HMAC-SHA256 JWT token and check expiration."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, signature_b64 = parts

        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(settings.JWT_SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        actual_sig = base64url_decode(signature_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload = json.loads(base64url_decode(payload_b64).decode("utf-8"))
        exp = payload.get("exp")
        if exp and datetime.now(timezone.utc).timestamp() > exp:
            return None

        return payload
    except Exception:
        return None


def get_current_admin(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> Dict[str, Any]:
    """Dependency for securing admin endpoints."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials or token has expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials or not credentials.credentials:
        raise credentials_exception

    payload = verify_access_token(credentials.credentials)
    if not payload:
        raise credentials_exception

    email: Optional[str] = payload.get("sub")
    if not email or email.strip().lower() != settings.ADMIN_EMAIL.strip().lower():
        raise credentials_exception

    return {
        "email": settings.ADMIN_EMAIL,
        "name": settings.ADMIN_NAME,
        "role": settings.ADMIN_ROLE,
    }
