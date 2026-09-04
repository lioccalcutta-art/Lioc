import logging
import sys
from backend.app.core.config import settings


def setup_logging():
    """Configure structured console logging for production and development."""
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    # Custom formatter with sanitized output format
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Avoid duplicate handlers if already registered
    if not root_logger.handlers:
        root_logger.addHandler(handler)
    else:
        root_logger.handlers = [handler]

    # Suppress verbose third-party loggers in production
    if not settings.DEBUG:
        logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
        logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
        logging.getLogger("httpcore").setLevel(logging.WARNING)
        logging.getLogger("httpx").setLevel(logging.WARNING)

    logging.getLogger("lioc_api").info(
        "Structured logging initialized (Environment: %s, Debug: %s)",
        settings.ENVIRONMENT,
        settings.DEBUG,
    )
