import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client = None

def get_supabase_client():
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if settings.SUPABASE_URL and settings.SUPABASE_KEY:
        try:
            from supabase import create_client, Client
            _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Successfully initialized Supabase client.")
            return _supabase_client
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            return None
    return None

def is_supabase_configured() -> bool:
    return bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)

def test_supabase_connection(url: str, key: str) -> bool:
    try:
        from supabase import create_client
        client = create_client(url, key)
        # Try a lightweight query
        res = client.table("business_insights").select("count", count="exact").execute()
        return True
    except Exception as e:
        logger.warning(f"Supabase connection test failed: {e}")
        return False
