-- ==============================================================================
-- EARIP — Enterprise AI Retail Intelligence Platform
-- Supabase PostgreSQL Schema
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    invoice_no VARCHAR(20) NOT NULL,
    stock_code VARCHAR(30) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    invoice_date TIMESTAMP WITH TIME ZONE NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    customer_id VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    revenue NUMERIC(12, 2) NOT NULL,
    is_return BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_invoice_date ON transactions(invoice_date);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_country ON transactions(country);
CREATE INDEX IF NOT EXISTS idx_transactions_stock_code ON transactions(stock_code);

-- 2. Customer Segments (RFM Analysis)
CREATE TABLE IF NOT EXISTS customer_segments (
    customer_id VARCHAR(20) PRIMARY KEY,
    recency_days INTEGER NOT NULL,
    frequency_orders INTEGER NOT NULL,
    monetary_total NUMERIC(12, 2) NOT NULL,
    r_score INTEGER NOT NULL,
    f_score INTEGER NOT NULL,
    m_score INTEGER NOT NULL,
    rfm_score VARCHAR(10) NOT NULL,
    segment VARCHAR(50) NOT NULL, -- VIP, Loyal, Regular, At-Risk, Hibernating
    country VARCHAR(100),
    first_purchase TIMESTAMP WITH TIME ZONE,
    last_purchase TIMESTAMP WITH TIME ZONE,
    avg_order_value NUMERIC(10, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_segments_segment ON customer_segments(segment);

-- 3. Monthly Sales Aggregates
CREATE TABLE IF NOT EXISTS monthly_sales (
    month_year VARCHAR(7) PRIMARY KEY, -- YYYY-MM
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_revenue NUMERIC(14, 2) NOT NULL,
    total_orders INTEGER NOT NULL,
    unique_customers INTEGER NOT NULL,
    avg_order_value NUMERIC(10, 2) NOT NULL,
    return_rate NUMERIC(5, 2) NOT NULL,
    growth_rate NUMERIC(6, 2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Top Products Performance
CREATE TABLE IF NOT EXISTS top_products (
    stock_code VARCHAR(30) PRIMARY KEY,
    description TEXT NOT NULL,
    total_quantity INTEGER NOT NULL,
    total_revenue NUMERIC(12, 2) NOT NULL,
    order_count INTEGER NOT NULL,
    return_count INTEGER DEFAULT 0,
    return_rate NUMERIC(5, 2) DEFAULT 0.00,
    avg_unit_price NUMERIC(10, 2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Country Performance (Geographic Intelligence)
CREATE TABLE IF NOT EXISTS country_performance (
    country VARCHAR(100) PRIMARY KEY,
    total_revenue NUMERIC(14, 2) NOT NULL,
    revenue_share_pct NUMERIC(5, 2) NOT NULL,
    total_orders INTEGER NOT NULL,
    unique_customers INTEGER NOT NULL,
    avg_order_value NUMERIC(10, 2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Sales Forecast
CREATE TABLE IF NOT EXISTS sales_forecast (
    id SERIAL PRIMARY KEY,
    forecast_month VARCHAR(7) NOT NULL, -- YYYY-MM
    predicted_revenue NUMERIC(14, 2) NOT NULL,
    lower_bound NUMERIC(14, 2) NOT NULL,
    upper_bound NUMERIC(14, 2) NOT NULL,
    model_name VARCHAR(50) DEFAULT 'Holt-Winters / Trend-Seasonality',
    growth_pct NUMERIC(6, 2),
    confidence_level NUMERIC(4, 2) DEFAULT 0.95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Anomaly Detection
CREATE TABLE IF NOT EXISTS anomalies (
    id SERIAL PRIMARY KEY,
    detected_date DATE NOT NULL,
    metric_name VARCHAR(50) NOT NULL, -- Revenue, Order Volume, Return Surge
    actual_value NUMERIC(12, 2) NOT NULL,
    expected_value NUMERIC(12, 2) NOT NULL,
    deviation_pct NUMERIC(6, 2) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- HIGH, MEDIUM, LOW
    anomaly_type VARCHAR(50) NOT NULL, -- Spike, Drop, Outlier
    root_cause_analysis TEXT NOT NULL,
    recommended_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Business Insights & Recommendations
CREATE TABLE IF NOT EXISTS business_insights (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- Retention, Geography, Pricing, Inventory
    title VARCHAR(200) NOT NULL,
    insight_text TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    business_impact VARCHAR(50) NOT NULL, -- Critical, High, Medium
    status VARCHAR(30) DEFAULT 'Active',
    metrics_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. AI Conversations & Analytics Queries
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL,
    user_query TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    metrics_cited JSONB,
    intent VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) - Public Read by Default for API Consumption
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_forecast ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access for transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for customer_segments" ON customer_segments FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for monthly_sales" ON monthly_sales FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for top_products" ON top_products FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for country_performance" ON country_performance FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for sales_forecast" ON sales_forecast FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for anomalies" ON anomalies FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access for business_insights" ON business_insights FOR SELECT USING (true);
CREATE POLICY "Allow public all access for ai_conversations" ON ai_conversations FOR ALL USING (true);
