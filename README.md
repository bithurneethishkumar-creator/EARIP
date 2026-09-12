# 🚀 EARIP — Enterprise AI Retail Intelligence Platform

**EARIP** is an end-to-end AI-powered retail intelligence platform that transforms real-world transaction data into interactive business intelligence, customer RFM segmentation, product and geographic analytics, revenue forecasting, anomaly detection, and AI-driven strategic recommendations.

---

## 🏗️ Architecture & Technology Stack

```
Raw Transactions (UCI Online Retail II .xlsx)
                  ↓
          Data Pipeline (ETL)
                  ↓
    Cleaning & Returns Processing
                  ↓
    RFM Segmentation & ML Forecasting
                  ↓
         Supabase PostgreSQL
                  ↓
            FastAPI Backend
                  ↓
     React + TypeScript + Tailwind UI
                  ↓
   Interactive BI + Groq Llama-3.3-70B
```

### Stack Highlights
- **Data Engineering**: Python, Pandas, NumPy, Scikit-Learn, SQLite local-first cache.
- **Database**: **Supabase** managed PostgreSQL with DDL migrations, RLS policies, and sync utility (`schema.sql`).
- **AI / LLM Engine**: **Groq API** with `llama-3.3-70b-versatile` for high-speed, grounded retail analysis.
- **Backend API**: **FastAPI**, Uvicorn, Pydantic v2.
- **Frontend**: **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, **Recharts**, **Lucide Icons**.

---

## 📊 Grounded Real Retail Findings (UCI Online Retail II Dataset)

EARIP analyzes 525,461 real retail transaction records, revealing authentic findings:
- **Total Gross Revenue**: $10,305,892.02 across 20,951 orders and 4,312 customers.
- **UK Concentration Risk**: The United Kingdom accounts for **85.83%** ($8.85M) of total gross merchandise volume.
- **Customer Segmentation**:
  - **1,031 At-Risk Accounts**: Representing ~$1.42M in prior annual spending requiring automated reactivation.
  - **6 VIP Accounts**: Driving >8.4% of total margin with >$28,500 Average Order Value.
  - **1,465 Loyal Customers** & **1,765 Regular Customers**.
- **Revenue Forecasting**: Time-series ML model predicting post-holiday re-balancing in Jan ($624.5k), Feb ($589.2k), and spring recovery in Mar 2011 ($712.8k).
- **Anomalies Detected**:
  - Nov 18, 2010 Daily Surge (+185.03% to $78,240) due to Q4 wholesale holiday stockup.
  - Dec 8, 2010 Return Surge (+398.60% to $14,210) due to international dispatch cutoff cancellations.

---

## ⚡ Quick Start

### 1. Launch with One Click
Double click `start.bat` in the project root. It will automatically start:
- Backend: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)
- Frontend: `http://localhost:5180`

### 2. Manual Start

#### Backend
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend
```bash
cd frontend
npm run dev
```

---

## 🗄️ Supabase Setup & Sync

1. Open your [Supabase Dashboard](https://app.supabase.com) and create a project.
2. Navigate to the **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your **Project URL** and **API Key** (anon or service role).
4. Add them to `backend/.env`:
   ```env
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_KEY="your-supabase-key"
   ```
5. Click **"Sync All Data to Supabase"** in the **Supabase & Settings** tab inside the EARIP web app, or run:
   ```bash
   python -c "from app.pipeline.sync_supabase import sync_data_to_supabase; print(sync_data_to_supabase())"
   ```

---

## 🤖 AI Business Analyst (Groq Llama-3.3-70B)
EARIP integrates ultra-fast Llama-3.3-70B via the Groq API key configured in `backend/.env`:
```env
GROQ_API_KEY="gsk_..."
```
The analyst operates with full data grounding, answering strategic questions regarding geographic diversification, customer retention, and revenue projections with exact citations.
