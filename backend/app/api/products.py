from fastapi import APIRouter, Query
from app.db.local_store import get_top_products

router = APIRouter()

@router.get("")
def get_products(limit: int = Query(20, ge=1, le=100)):
    return get_top_products(limit=limit)
