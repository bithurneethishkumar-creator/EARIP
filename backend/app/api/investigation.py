from fastapi import APIRouter, Query
from typing import Optional
from app.services.investigation import InvestigationEngine

router = APIRouter()

@router.get("")
def get_investigation(metric: Optional[str] = Query("revenue_drop_2010_04", description="Scenario/Metric identifier to investigate")):
    """
    Returns authentic variance decomposition and contributing factors for the requested retail metric.
    """
    return {
        "availableScenarios": InvestigationEngine.get_available_metrics(),
        "investigation": InvestigationEngine.investigate(metric or "revenue_drop_2010_04")
    }

@router.get("/scenarios")
def list_scenarios():
    """
    Returns list of all investigatable business events and metrics.
    """
    return InvestigationEngine.get_available_metrics()
