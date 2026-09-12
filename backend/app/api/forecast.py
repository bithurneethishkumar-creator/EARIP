from fastapi import APIRouter
from app.db.local_store import get_forecast

router = APIRouter()

@router.get("")
def get_revenue_forecast():
    return get_forecast()
