import json
import os
import logging
from typing import Dict, Any
from app.db.supabase_client import get_supabase_client

logger = logging.getLogger(__name__)

def sync_data_to_supabase(custom_url: str = None, custom_key: str = None) -> Dict[str, Any]:
    """
    Syncs processed analytical models and retail intelligence tables into Supabase.
    """
    client = None
    if custom_url and custom_key:
        try:
            from supabase import create_client
            client = create_client(custom_url, custom_key)
        except Exception as e:
            return {"success": False, "message": f"Failed to connect to Supabase: {str(e)}", "rowsSynced": 0}
    else:
        client = get_supabase_client()

    if not client:
        return {
            "success": False,
            "message": "Supabase client not configured. Provide SUPABASE_URL and SUPABASE_KEY in .env or Settings.",
            "rowsSynced": 0
        }

    cache_path = "data/processed_analytics.json"
    if not os.path.exists(cache_path):
        return {"success": False, "message": f"Analytics cache not found at {cache_path}", "rowsSynced": 0}

    with open(cache_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    total_synced = 0
    try:
        # 1. Sync Monthly Sales
        if "monthly_sales" in data:
            records = []
            for item in data["monthly_sales"]:
                records.append({
                    "month_year": item["YearMonth"],
                    "year": item["year"],
                    "month": item["month"],
                    "total_revenue": item["total_revenue"],
                    "total_orders": item["total_orders"],
                    "unique_customers": item["unique_customers"],
                    "avg_order_value": item["avg_order_value"],
                    "return_rate": item["return_rate"],
                    "growth_rate": item["growth_rate"]
                })
            res = client.table("monthly_sales").upsert(records).execute()
            total_synced += len(records)

        # 2. Sync Top Products
        if "top_products" in data:
            records = []
            for item in data["top_products"]:
                records.append({
                    "stock_code": str(item["StockCode"]),
                    "description": item["Description"],
                    "total_quantity": item["total_quantity"],
                    "total_revenue": item["total_revenue"],
                    "order_count": item["order_count"],
                    "return_count": item.get("return_count", 0),
                    "return_rate": item.get("return_rate", 0.0),
                    "avg_unit_price": item["avg_unit_price"]
                })
            res = client.table("top_products").upsert(records).execute()
            total_synced += len(records)

        # 3. Sync Country Performance
        if "country_performance" in data:
            records = []
            for item in data["country_performance"]:
                records.append({
                    "country": item["Country"],
                    "total_revenue": item["total_revenue"],
                    "revenue_share_pct": item["revenue_share_pct"],
                    "total_orders": item["total_orders"],
                    "unique_customers": item["unique_customers"],
                    "avg_order_value": item["avg_order_value"]
                })
            res = client.table("country_performance").upsert(records).execute()
            total_synced += len(records)

        # 4. Sync Sales Forecast
        if "sales_forecast" in data:
            records = []
            for item in data["sales_forecast"]:
                records.append({
                    "forecast_month": item["forecast_month"],
                    "predicted_revenue": item["predicted_revenue"],
                    "lower_bound": item["lower_bound"],
                    "upper_bound": item["upper_bound"],
                    "growth_pct": item["growth_pct"],
                    "confidence_level": item["confidence_level"],
                    "model_name": item["model_name"]
                })
            res = client.table("sales_forecast").upsert(records).execute()
            total_synced += len(records)

        # 5. Sync Anomalies
        if "anomalies" in data:
            records = []
            for item in data["anomalies"]:
                records.append({
                    "detected_date": item["detected_date"],
                    "metric_name": item["metric_name"],
                    "actual_value": item["actual_value"],
                    "expected_value": item["expected_value"],
                    "deviation_pct": item["deviation_pct"],
                    "severity": item["severity"],
                    "anomaly_type": item["anomaly_type"],
                    "root_cause_analysis": item["root_cause_analysis"],
                    "recommended_action": item["recommended_action"]
                })
            res = client.table("anomalies").upsert(records).execute()
            total_synced += len(records)

        # 6. Sync Business Insights
        if "business_insights" in data:
            records = []
            for item in data["business_insights"]:
                records.append({
                    "category": item["category"],
                    "title": item["title"],
                    "insight_text": item["insight_text"],
                    "recommendation_text": item["recommendation_text"],
                    "business_impact": item["business_impact"],
                    "status": item["status"],
                    "metrics_json": item.get("metrics_json", {})
                })
            res = client.table("business_insights").upsert(records).execute()
            total_synced += len(records)

        return {
            "success": True,
            "message": f"Successfully synced {total_synced} records across 6 analytical tables into Supabase!",
            "rowsSynced": total_synced
        }
    except Exception as e:
        logger.error(f"Error syncing data to Supabase: {e}")
        return {
            "success": False,
            "message": f"Error syncing data to Supabase: {str(e)}",
            "rowsSynced": total_synced
        }
