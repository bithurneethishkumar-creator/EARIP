from fastapi import APIRouter
from app.db.local_store import get_anomalies

router = APIRouter()

@router.get("")
def get_anomaly_events():
    return get_anomalies()
