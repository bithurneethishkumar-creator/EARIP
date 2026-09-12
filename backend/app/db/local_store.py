import json
import os
import sqlite3
from typing import Dict, Any, List, Optional
from app.db.supabase_client import get_supabase_client, is_supabase_configured

# Resolve data directory dynamically whether running from project root or backend
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
CACHE_FILE = os.path.join(DATA_DIR, "processed_analytics.json")
SQLITE_DB = os.path.join(DATA_DIR, "earip.db")

def get_cached_analytics() -> Dict[str, Any]:
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    # Fallback to local data folder if relative
    if os.path.exists("data/processed_analytics.json"):
        with open("data/processed_analytics.json", "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def get_db_connection():
    conn = sqlite3.connect(SQLITE_DB)
    conn.row_factory = sqlite3.Row
    return conn

def get_kpis(country: Optional[str] = None) -> Dict[str, Any]:
    client = get_supabase_client()
    data = get_cached_analytics()
    kpis = data.get("kpis", {})

    if country and country != "All":
        # Calculate specific country slice from SQLite
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM country_performance WHERE Country = ?", (country,))
        row = cur.fetchone()
        conn.close()
        if row:
            return {
                "totalRevenue": round(float(row["total_revenue"]), 2),
                "totalOrders": int(row["total_orders"]),
                "totalCustomers": int(row["unique_customers"]),
                "totalProducts": kpis.get("totalProducts", 4250),
                "avgOrderValue": round(float(row["avg_order_value"]), 2),
                "returnRate": kpis.get("returnRate", 2.65),
                "ukConcentrationPct": round(float(row["revenue_share_pct"]), 2),
                "atRiskCustomerCount": kpis.get("atRiskCustomerCount", 1031),
                "vipCustomerCount": kpis.get("vipCustomerCount", 6),
                "monthlyGrowthRate": kpis.get("monthlyGrowthRate", 12.4)
            }
    return kpis

def get_sales_trends(country: Optional[str] = None) -> List[Dict[str, Any]]:
    data = get_cached_analytics()
    raw = data.get("monthly_sales", [])
    normalized = []
    for item in raw:
        rev = float(item.get("total_revenue", item.get("totalRevenue", 0.0)))
        orders = int(item.get("total_orders", item.get("totalOrders", 0)))
        custs = int(item.get("unique_customers", item.get("uniqueCustomers", 0)))
        aov = float(item.get("avg_order_value", item.get("avgOrderValue", 0.0)))
        ret = float(item.get("return_rate", item.get("returnRate", 0.0)))
        growth = float(item.get("growth_rate", item.get("growthRate", 0.0)))
        ym = str(item.get("YearMonth", item.get("month_year", "")))
        y = int(item.get("year", ym.split("-")[0] if "-" in ym else 2010))
        m = int(item.get("month", ym.split("-")[1] if "-" in ym else 1))
        normalized.append({
            "YearMonth": ym,
            "monthYear": ym,
            "year": y,
            "month": m,
            "totalRevenue": rev,
            "total_revenue": rev,
            "totalOrders": orders,
            "total_orders": orders,
            "uniqueCustomers": custs,
            "unique_customers": custs,
            "avgOrderValue": aov,
            "avg_order_value": aov,
            "returnRate": ret,
            "return_rate": ret,
            "growthRate": growth,
            "growth_rate": growth,
        })
    return normalized

def get_customer_segments() -> List[Dict[str, Any]]:
    data = get_cached_analytics()
    raw = data.get("customer_segments", [])
    normalized = []
    for s in raw:
        normalized.append({
            "segment": str(s.get("segment", "")),
            "count": int(s.get("count", 0)),
            "percentage": float(s.get("percentage", 0.0)),
            "avgRecency": float(s.get("avgRecency", s.get("avg_recency", 0.0))),
            "avg_recency": float(s.get("avgRecency", s.get("avg_recency", 0.0))),
            "avgFrequency": float(s.get("avgFrequency", s.get("avg_frequency", 0.0))),
            "avg_frequency": float(s.get("avgFrequency", s.get("avg_frequency", 0.0))),
            "avgMonetary": float(s.get("avgMonetary", s.get("avg_monetary", 0.0))),
            "avg_monetary": float(s.get("avgMonetary", s.get("avg_monetary", 0.0))),
        })
    return normalized

def get_customers_paginated(page: int = 1, limit: int = 20, segment: Optional[str] = None, search: Optional[str] = None) -> Dict[str, Any]:
    conn = get_db_connection()
    cur = conn.cursor()

    query = "SELECT * FROM customer_segments WHERE 1=1"
    params = []

    if segment and segment != "All":
        query += " AND segment = ?"
        params.append(segment)

    if search:
        query += " AND (Customer_ID LIKE ? OR country LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    count_query = f"SELECT COUNT(*) as total FROM ({query})"
    cur.execute(count_query, params)
    total = cur.fetchone()["total"]

    offset = (page - 1) * limit
    query += " ORDER BY monetary_total DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()

    items = [
        {
            "customerId": str(r["Customer_ID"]),
            "customer_id": str(r["Customer_ID"]),
            "recencyDays": int(r["recency_days"]),
            "recency_days": int(r["recency_days"]),
            "frequencyOrders": int(r["frequency_orders"]),
            "frequency_orders": int(r["frequency_orders"]),
            "monetaryTotal": float(r["monetary_total"]),
            "monetary_total": float(r["monetary_total"]),
            "segment": r["segment"],
            "rfmScore": str(r["rfm_score"]),
            "rfm_score": str(r["rfm_score"]),
            "country": r["country"],
            "avgOrderValue": float(r["avg_order_value"]),
            "avg_order_value": float(r["avg_order_value"]),
            "lastPurchase": str(r["last_purchase"]),
            "last_purchase": str(r["last_purchase"]),
        }
        for r in rows
    ]

    return {
        "items": items,
        "total": total,
        "page": page,
        "totalPages": (total + limit - 1) // limit
    }

def get_top_products(limit: int = 20) -> List[Dict[str, Any]]:
    data = get_cached_analytics()
    raw = data.get("top_products", [])[:limit]
    normalized = []
    for p in raw:
        code = str(p.get("StockCode", p.get("stock_code", p.get("stockCode", ""))))
        desc = str(p.get("Description", p.get("description", "Unknown SKU")))
        rev = float(p.get("total_revenue", p.get("totalRevenue", 0.0)))
        qty = int(p.get("total_quantity", p.get("totalQuantity", 0)))
        orders = int(p.get("order_count", p.get("orderCount", 0)))
        ret_rate = float(p.get("return_rate", p.get("returnRate", 0.0)))
        price = float(p.get("avg_unit_price", p.get("avgUnitPrice", 0.0)))
        normalized.append({
            "stockCode": code,
            "StockCode": code,
            "stock_code": code,
            "description": desc,
            "Description": desc,
            "totalRevenue": rev,
            "total_revenue": rev,
            "totalQuantity": qty,
            "total_quantity": qty,
            "orderCount": orders,
            "order_count": orders,
            "returnRate": ret_rate,
            "return_rate": ret_rate,
            "avgUnitPrice": price,
            "avg_unit_price": price,
        })
    return normalized

def get_geography() -> List[Dict[str, Any]]:
    data = get_cached_analytics()
    raw = data.get("country_performance", [])
    normalized = []
    for c in raw:
        country_name = str(c.get("Country", c.get("country", "")))
        rev = float(c.get("total_revenue", c.get("totalRevenue", 0.0)))
        share = float(c.get("revenue_share_pct", c.get("revenueSharePct", 0.0)))
        orders = int(c.get("total_orders", c.get("totalOrders", 0)))
        custs = int(c.get("unique_customers", c.get("uniqueCustomers", 0)))
        aov = float(c.get("avg_order_value", c.get("avgOrderValue", 0.0)))
        normalized.append({
            "country": country_name,
            "Country": country_name,
            "totalRevenue": rev,
            "total_revenue": rev,
            "revenueSharePct": share,
            "revenue_share_pct": share,
            "totalOrders": orders,
            "total_orders": orders,
            "uniqueCustomers": custs,
            "unique_customers": custs,
            "avgOrderValue": aov,
            "avg_order_value": aov,
        })
    return normalized

def get_forecast() -> List[Dict[str, Any]]:
    data = get_cached_analytics()
    raw = data.get("sales_forecast", [])
    normalized = []
    for f in raw:
        month = str(f.get("forecast_month", f.get("forecastMonth", "")))
        pred = float(f.get("predicted_revenue", f.get("predictedRevenue", 0.0)))
        low = float(f.get("lower_bound", f.get("lowerBound", 0.0)))
        up = float(f.get("upper_bound", f.get("upperBound", 0.0)))
        growth = float(f.get("growth_pct", f.get("growthPct", 0.0)))
        conf = float(f.get("confidence_level", f.get("confidenceLevel", 0.95)))
        model = str(f.get("model_name", f.get("modelName", "Holt-Winters ML")))
        normalized.append({
            "forecastMonth": month,
            "forecast_month": month,
            "predictedRevenue": pred,
            "predicted_revenue": pred,
            "lowerBound": low,
            "lower_bound": low,
            "upperBound": up,
            "upper_bound": up,
            "growthPct": growth,
            "growth_pct": growth,
            "confidenceLevel": conf,
            "confidence_level": conf,
            "modelName": model,
            "model_name": model,
        })
    return normalized

def get_anomalies() -> List[Dict[str, Any]]:
    data = get_cached_analytics()
    raw = data.get("anomalies", [])
    normalized = []
    for a in raw:
        normalized.append({
            "id": a.get("id", 1),
            "detectedDate": str(a.get("detected_date", a.get("detectedDate", ""))),
            "detected_date": str(a.get("detected_date", a.get("detectedDate", ""))),
            "metricName": str(a.get("metric_name", a.get("metricName", ""))),
            "metric_name": str(a.get("metric_name", a.get("metricName", ""))),
            "actualValue": float(a.get("actual_value", a.get("actualValue", 0.0))),
            "actual_value": float(a.get("actual_value", a.get("actualValue", 0.0))),
            "expectedValue": float(a.get("expected_value", a.get("expectedValue", 0.0))),
            "expected_value": float(a.get("expected_value", a.get("expectedValue", 0.0))),
            "deviationPct": float(a.get("deviation_pct", a.get("deviationPct", 0.0))),
            "deviation_pct": float(a.get("deviation_pct", a.get("deviationPct", 0.0))),
            "severity": a.get("severity", "MEDIUM"),
            "anomalyType": str(a.get("anomaly_type", a.get("anomalyType", "Outlier"))),
            "anomaly_type": str(a.get("anomaly_type", a.get("anomalyType", "Outlier"))),
            "rootCauseAnalysis": str(a.get("root_cause_analysis", a.get("rootCauseAnalysis", ""))),
            "root_cause_analysis": str(a.get("root_cause_analysis", a.get("rootCauseAnalysis", ""))),
            "recommendedAction": str(a.get("recommended_action", a.get("recommendedAction", ""))),
            "recommended_action": str(a.get("recommended_action", a.get("recommendedAction", ""))),
        })
    return normalized

def get_insights() -> List[Dict[str, Any]]:
    data = get_cached_analytics()
    raw = data.get("business_insights", [])
    normalized = []
    for item in raw:
        normalized.append({
            "id": item.get("id", 1),
            "category": item.get("category", "General"),
            "title": str(item.get("title", "")),
            "insightText": str(item.get("insight_text", item.get("insightText", ""))),
            "insight_text": str(item.get("insight_text", item.get("insightText", ""))),
            "recommendationText": str(item.get("recommendation_text", item.get("recommendationText", ""))),
            "recommendation_text": str(item.get("recommendation_text", item.get("recommendationText", ""))),
            "businessImpact": item.get("business_impact", item.get("businessImpact", "Medium")),
            "business_impact": item.get("business_impact", item.get("businessImpact", "Medium")),
            "status": item.get("status", "Active"),
            "metricsJson": item.get("metrics_json", item.get("metricsJson", {})),
        })
    return normalized
