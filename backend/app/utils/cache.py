import time
from typing import Any, Dict, Optional
from app.utils.config import settings

class InMemoryCache:
    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key not in self._store:
            return None
        item = self._store[key]
        if time.time() > item["expires_at"]:
            del self._store[key]
            return None
        return item["value"]

    def set(self, key: str, value: Any, expire_seconds: Optional[int] = None) -> None:
        duration = expire_seconds if expire_seconds is not None else settings.CACHE_EXPIRE_SECONDS
        self._store[key] = {
            "value": value,
            "expires_at": time.time() + duration
        }

    def clear(self) -> None:
        self._store.clear()

cache = InMemoryCache()
