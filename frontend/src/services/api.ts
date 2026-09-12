import {
  KpiMetrics,
  MonthlySales,
  CustomerSegment,
  CustomerItem,
  TopProduct,
  CountryMetric,
  SalesForecast,
  Anomaly,
  BusinessInsight,
  AnalystMessage,
  SystemStatus,
  InvestigationResult,
  InvestigationScenario,
  UserProfile,
  ProfileUpdateRequest,
} from '../types';

const rawBase = import.meta.env.VITE_API_URL || '';
const API_BASE = rawBase ? `${rawBase.replace(/\/+$/, '')}/api` : '/api';

export const api = {
  async getDashboardKpis(country?: string): Promise<KpiMetrics> {
    const params = new URLSearchParams();
    if (country && country !== 'All') params.append('country', country);
    const res = await fetch(`${API_BASE}/dashboard?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load KPIs');
    return res.json();
  },

  async getSalesTrends(country?: string): Promise<MonthlySales[]> {
    const params = new URLSearchParams();
    if (country && country !== 'All') params.append('country', country);
    const res = await fetch(`${API_BASE}/sales?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load sales trends');
    return res.json();
  },

  async getCustomerSegments(): Promise<CustomerSegment[]> {
    const res = await fetch(`${API_BASE}/customers/segments`);
    if (!res.ok) throw new Error('Failed to load customer segments');
    return res.json();
  },

  async getCustomers(
    page = 1,
    limit = 20,
    segment?: string,
    search?: string
  ): Promise<{ items: CustomerItem[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (segment && segment !== 'All') params.append('segment', segment);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/customers?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load customers');
    return res.json();
  },

  async getTopProducts(limit = 10): Promise<TopProduct[]> {
    const res = await fetch(`${API_BASE}/products?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to load top products');
    return res.json();
  },

  async getGeography(): Promise<CountryMetric[]> {
    const res = await fetch(`${API_BASE}/geography`);
    if (!res.ok) throw new Error('Failed to load geographic metrics');
    return res.json();
  },

  async getForecast(): Promise<SalesForecast[]> {
    const res = await fetch(`${API_BASE}/forecast`);
    if (!res.ok) throw new Error('Failed to load forecast data');
    return res.json();
  },

  async getAnomalies(): Promise<Anomaly[]> {
    const res = await fetch(`${API_BASE}/anomalies`);
    if (!res.ok) throw new Error('Failed to load anomalies');
    return res.json();
  },

  async getInsights(): Promise<BusinessInsight[]> {
    const res = await fetch(`${API_BASE}/insights`);
    if (!res.ok) throw new Error('Failed to load business insights');
    return res.json();
  },

  async askAnalyst(
    query: string,
    history: { role: string; content: string }[] = []
  ): Promise<{ answer: string; metricsCited: { label: string; value: string }[]; suggestedQuestions: string[] }> {
    const res = await fetch(`${API_BASE}/analyst/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, history }),
    });
    if (!res.ok) throw new Error('Failed to process AI analyst query');
    return res.json();
  },

  async getSystemStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/system/status`);
    if (!res.ok) throw new Error('Failed to load system status');
    return res.json();
  },

  async triggerSupabaseSync(supabaseUrl?: string, supabaseKey?: string): Promise<{ success: boolean; message: string; rowsSynced: number }> {
    const res = await fetch(`${API_BASE}/system/sync-supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supabase_url: supabaseUrl, supabase_key: supabaseKey }),
    });
    if (!res.ok) throw new Error('Failed to sync to Supabase');
    return res.json();
  },

  async getInvestigation(
    metric?: string
  ): Promise<{ availableScenarios: InvestigationScenario[]; investigation: InvestigationResult }> {
    const params = new URLSearchParams();
    if (metric) params.append('metric', metric);
    const res = await fetch(`${API_BASE}/investigation?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load insight investigation');
    return res.json();
  },

  async getInvestigationScenarios(): Promise<InvestigationScenario[]> {
    const res = await fetch(`${API_BASE}/investigation/scenarios`);
    if (!res.ok) throw new Error('Failed to load investigation scenarios');
    return res.json();
  },

  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to load user profile');
    return res.json();
  },

  async updateUserProfile(payload: ProfileUpdateRequest): Promise<{ success: boolean; message: string; profile: UserProfile }> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  },

  async logoutUser(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/profile/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to log out user');
    return res.json();
  },

  getReportDownloadUrl(format: 'csv' | 'summary', type?: string): string {
    return `${API_BASE}/reports/export?format=${format}${type ? `&type=${type}` : ''}`;
  }
};
