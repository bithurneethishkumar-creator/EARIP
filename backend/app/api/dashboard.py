from fastapi import APIRouter, Query
from typing import Optional
from app.db.local_store import get_kpis

router = APIRouter()

@router.get("")
def get_dashboard_kpis(country: Optional[str] = Query(None, description="Country filter")):
    return get_kpis(country=country)
