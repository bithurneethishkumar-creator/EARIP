import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.dashboard import router as dashboard_router
from app.api.sales import router as sales_router
from app.api.customers import router as customers_router
from app.api.products import router as products_router
from app.api.geography import router as geography_router
from app.api.forecast import router as forecast_router
from app.api.anomalies import router as anomalies_router
from app.api.insights import router as insights_router
from app.api.analyst import router as analyst_router
from app.api.reports import router as reports_router
from app.api.system import router as system_router
from app.api.investigation import router as investigation_router
from app.api.profile import router as profile_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("earip")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="End-to-End Enterprise AI Retail Intelligence Platform powered by real UCI transaction data and Supabase."
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Executive Dashboard"])
app.include_router(sales_router, prefix="/api/sales", tags=["Sales Intelligence"])
app.include_router(customers_router, prefix="/api/customers", tags=["Customer Intelligence"])
app.include_router(products_router, prefix="/api/products", tags=["Product Intelligence"])
app.include_router(geography_router, prefix="/api/geography", tags=["Geographic Intelligence"])
app.include_router(forecast_router, prefix="/api/forecast", tags=["Revenue Forecasting"])
app.include_router(anomalies_router, prefix="/api/anomalies", tags=["Anomaly Detection"])
app.include_router(insights_router, prefix="/api/insights", tags=["AI Recommendations"])
app.include_router(investigation_router, prefix="/api/insights/investigate", tags=["Insight Investigation"])
app.include_router(investigation_router, prefix="/api/investigation", tags=["Insight Investigation"])
app.include_router(analyst_router, prefix="/api/analyst", tags=["AI Business Analyst"])
app.include_router(analyst_router, prefix="/api/ai", tags=["AI Business Analyst"])
app.include_router(profile_router, prefix="/api/profile", tags=["User Profile"])
app.include_router(reports_router, prefix="/api/reports", tags=["Executive Reports"])
app.include_router(system_router, prefix="/api/system", tags=["System & Supabase"])

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Welcome to EARIP API — Enterprise AI Retail Intelligence Platform",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
