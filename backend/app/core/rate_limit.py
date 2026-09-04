from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
from fastapi.responses import JSONResponse

# Initialize Limiter using client IP
limiter = Limiter(key_func=get_remote_address, default_limits=[])


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """Custom response for HTTP 429 RateLimitExceeded."""
    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "code": "RATE_LIMIT_EXCEEDED",
                "message": "Too many requests. Please slow down and try again shortly.",
                "detail": str(exc.detail),
            }
        },
        headers={"Retry-After": "60"},
    )
