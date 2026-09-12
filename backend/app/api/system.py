from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.db.supabase_client import is_supabase_configured, get_supabase_client
from app.pipeline.sync_supabase import sync_data_to_supabase
from app.db.local_store import get_cached_analytics

router = APIRouter()

class SyncRequest(BaseModel):
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None

@router.get("/status")
def get_system_status():
    data = get_cached_analytics()
    client = get_supabase_client()
    is_connected = False
    if client:
        try:
            res = client.table("business_insights").select("count", count="exact").execute()
            is_connected = True
        except Exception:
            is_connected = False

    return {
        "supabaseConnected": is_connected,
        "supabaseUrlConfigured": is_supabase_configured(),
        "mode": "supabase" if is_connected else "local_cache",
        "totalTransactions": 525461,
        "totalCustomers": data.get("kpis", {}).get("totalCustomers", 4312),
        "lastSyncTime": data.get("last_updated", "2026-09-12T00:00:00"),
        "datasetName": "UCI Online Retail II (Year 2009-2010)"
    }

@router.post("/sync-supabase")
def sync_to_supabase(payload: SyncRequest):
    return sync_data_to_supabase(
        custom_url=payload.supabase_url,
        custom_key=payload.supabase_key
    )
