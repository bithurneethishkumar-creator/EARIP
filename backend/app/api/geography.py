from fastapi import APIRouter
from app.db.local_store import get_geography

router = APIRouter()

@router.get("")
def get_geographic_distribution():
    return get_geography()
