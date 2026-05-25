from __future__ import annotations

import logging
import os
from logging.handlers import RotatingFileHandler

from app.config.settings import get_settings

LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s — %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def _ensure_log_dir(log_dir: str) -> str:
    abs_path = os.path.abspath(log_dir)
    os.makedirs(abs_path, exist_ok=True)
    return abs_path


def _build_file_handler(log_dir: str, max_bytes: int, backup_count: int) -> RotatingFileHandler:
    file_path = os.path.join(log_dir, "app.log")
    handler = RotatingFileHandler(
        filename=file_path,
        maxBytes=max_bytes,
        backupCount=backup_count,
        encoding="utf-8",
    )
    handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    handler.setLevel(logging.DEBUG)
    return handler


def _build_console_handler() -> logging.StreamHandler:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    handler.setLevel(logging.INFO)
    return handler


def setup_logging() -> None:
    settings = get_settings()

    if not settings.log_enabled:
        logging.disable(logging.CRITICAL)
        return

    log_dir = _ensure_log_dir(settings.log_dir)
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)

    if root_logger.handlers:
        root_logger.handlers.clear()

    root_logger.addHandler(_build_console_handler())
    root_logger.addHandler(
        _build_file_handler(log_dir, settings.log_max_bytes, settings.log_backup_count)
    )

    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("boto3").setLevel(logging.WARNING)
    logging.getLogger("botocore").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
