from fastapi import APIRouter, Query
from typing import Optional
from app.db.local_store import get_sales_trends

router = APIRouter()

@router.get("")
def get_sales(country: Optional[str] = Query(None, description="Country filter")):
    return get_sales_trends(country=country)
