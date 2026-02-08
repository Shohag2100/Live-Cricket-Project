
from django.core.cache import cache
from typing import Any, Optional
import json
import logging

logger = logging.getLogger(__name__)

class CacheService:
    """Centralized cache management service"""
    
    @staticmethod
    def get(key: str, default: Any = None) -> Any:
        """Get value from cache"""
        try:
            return cache.get(key, default)
        except Exception as e:
            logger.error(f"Cache get error: {str(e)}")
            return default
    
    @staticmethod
    def set(key: str, value: Any, timeout: int = 300) -> bool:
        """Set value in cache"""
        try:
            cache.set(key, value, timeout)
            return True
        except Exception as e:
            logger.error(f"Cache set error: {str(e)}")
            return False
    
    @staticmethod
    def delete(key: str) -> bool:
        """Delete value from cache"""
        try:
            cache.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {str(e)}")
            return False
    
    @staticmethod
    def clear_pattern(pattern: str) -> bool:
        """Clear all cache keys matching pattern"""
        try:
            cache.delete_pattern(f"*{pattern}*")
            return True
        except Exception as e:
            logger.error(f"Cache clear pattern error: {str(e)}")
            return False
    
    @staticmethod
    def get_or_set(key: str, callback, timeout: int = 300) -> Any:
        """Get from cache or set using callback"""
        value = CacheService.get(key)
        
        if value is None:
            value = callback()
            CacheService.set(key, value, timeout)
        
        return value