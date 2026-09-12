from fastapi import APIRouter, Query
from typing import Optional
from app.db.local_store import get_customer_segments, get_customers_paginated

router = APIRouter()

@router.get("/segments")
def get_segments():
    return get_customer_segments()

@router.get("")
def get_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    segment: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    return get_customers_paginated(page=page, limit=limit, segment=segment, search=search)
