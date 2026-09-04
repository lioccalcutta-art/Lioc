import logging
from typing import Optional
import httpx
from backend.app.core.config import settings

logger = logging.getLogger("antispam_service")


async def verify_turnstile_token(token: Optional[str], remote_ip: Optional[str] = None) -> bool:
    """
    Verify Cloudflare Turnstile CAPTCHA token.
    Enforces real Cloudflare verification in production while allowing test bypass in development.
    """
    # If antispam disabled globally in settings
    if not settings.TURNSTILE_ENABLED:
        return True

    is_production = settings.ENVIRONMENT.lower() == "production"

    # In non-production (development / test) environments ONLY, allow test tokens
    if not is_production:
        if token in ["XXXX.DUMMY.TOKEN.XXXX", "test-turnstile-token", "test-token", "pass"]:
            return True

        if settings.TURNSTILE_SECRET_KEY == "1x0000000000000000000000000000000AA" and not token:
            return True

    if not token:
        logger.warning("Turnstile verification failed: missing captcha token.")
        return False

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(
                settings.TURNSTILE_VERIFY_URL,
                data={
                    "secret": settings.TURNSTILE_SECRET_KEY,
                    "response": token,
                    "remoteip": remote_ip,
                },
            )
            result = response.json()
            success = result.get("success", False)
            if not success:
                logger.warning("Cloudflare Turnstile verification rejected: %s", result.get("error-codes"))
            return success
    except Exception as e:
        logger.error("Error communicating with Cloudflare Turnstile verification API: %s", e)
        # In case of network timeout during development/testing, allow bypass; fail-closed in production
        if not is_production:
            return True
        return False
