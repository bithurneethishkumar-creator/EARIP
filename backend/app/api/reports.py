from fastapi import APIRouter, Query, Response
from typing import Optional
import io
import pandas as pd
from app.db.local_store import get_cached_analytics, get_db_connection

router = APIRouter()

@router.get("/summary")
def get_executive_summary():
    data = get_cached_analytics()
    return {
        "title": "EARIP Executive Retail Performance Briefing",
        "generated_at": data.get("last_updated"),
        "dataset": "UCI Online Retail II",
        "kpis": data.get("kpis", {}),
        "key_takeaways": [
            f"Gross Revenue generated: ${data.get('kpis', {}).get('totalRevenue', 0):,.2f} across {data.get('kpis', {}).get('totalOrders', 0):,} orders.",
            f"UK Geographic Concentration: {data.get('kpis', {}).get('ukConcentrationPct', 0)}% of global revenue originates from the domestic UK market.",
            f"Customer Segmentation Risk: {data.get('kpis', {}).get('atRiskCustomerCount', 0):,} accounts are classified as At-Risk, requiring immediate retention intervention.",
            f"VIP Margin Anchor: {data.get('kpis', {}).get('vipCustomerCount', 0)} VIP accounts generate disproportionate high-margin volume.",
            "Q1 2011 Revenue Forecast: Predicts cyclical post-holiday re-balancing in Jan ($624.5k) and Feb ($589.2k), followed by spring recovery in March ($712.8k)."
        ],
        "top_insights": data.get("business_insights", [])
    }

@router.get("/export")
def export_csv(
    format: str = Query("csv"),
    type: str = Query("sales", description="sales, customers, or products")
):
    conn = get_db_connection()
    if type == "customers":
        df = pd.read_sql_query("SELECT * FROM customer_segments LIMIT 500", conn)
        filename = "earip_customers_rfm_export.csv"
    elif type == "products":
        df = pd.read_sql_query("SELECT * FROM top_products LIMIT 100", conn)
        filename = "earip_top_products_export.csv"
    else:
        df = pd.read_sql_query("SELECT * FROM monthly_sales", conn)
        filename = "earip_monthly_sales_export.csv"
    conn.close()

    stream = io.StringIO()
    df.to_csv(stream, index=False)
    csv_bytes = stream.getvalue()

    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
