import uuid
import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("lioc.requests")


class RequestIdMiddleware(BaseHTTPMiddleware):
    """
    Middleware to assign a unique X-Request-ID to incoming requests
    and measure execution time.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        # Check incoming X-Request-ID or generate new unique ID
        request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex[:12]
        request.state.request_id = request_id

        start_time = time.perf_counter()
        try:
            response: Response = await call_next(request)
            process_time = (time.perf_counter() - start_time) * 1000

            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.2f}ms"

            # Log non-health check requests
            if not request.url.path.endswith("/health"):
                logger.info(
                    "[%s] %s %s -> %s (%.2fms)",
                    request_id,
                    request.method,
                    request.url.path,
                    response.status_code,
                    process_time,
                )
            return response
        except Exception as exc:
            process_time = (time.perf_counter() - start_time) * 1000
            logger.exception(
                "[%s] %s %s -> EXCEPTION after %.2fms: %s",
                request_id,
                request.method,
                request.url.path,
                process_time,
                exc,
            )
            raise exc
