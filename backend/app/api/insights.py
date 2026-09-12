from fastapi import APIRouter
from app.db.local_store import get_insights

router = APIRouter()

@router.get("")
def get_business_recommendations():
    return get_insights()
