export interface KpiMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  avgOrderValue: number;
  returnRate: number;
  ukConcentrationPct: number;
  atRiskCustomerCount: number;
  vipCustomerCount: number;
  monthlyGrowthRate: number;
}

export interface MonthlySales {
  monthYear?: string;
  YearMonth?: string;
  year: number;
  month: number;
  totalRevenue: number;
  totalOrders: number;
  uniqueCustomers: number;
  avgOrderValue: number;
  returnRate: number;
  growthRate: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
}

export interface CustomerItem {
  customerId: string;
  recencyDays: number;
  frequencyOrders: number;
  monetaryTotal: number;
  segment: string;
  rfmScore: string;
  country: string;
  avgOrderValue: number;
  lastPurchase?: string;
}

export interface TopProduct {
  stockCode: string;
  description: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
  returnRate: number;
  avgUnitPrice: number;
}

export interface CountryMetric {
  country: string;
  totalRevenue: number;
  revenueSharePct: number;
  totalOrders: number;
  uniqueCustomers: number;
  avgOrderValue: number;
}

export interface SalesForecast {
  forecastMonth: string;
  predictedRevenue: number;
  lowerBound: number;
  upperBound: number;
  growthPct: number;
  confidenceLevel: number;
  modelName: string;
}

export interface Anomaly {
  id: number;
  detectedDate: string;
  metricName: string;
  actualValue: number;
  expectedValue: number;
  deviationPct: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  anomalyType: string;
  rootCauseAnalysis: string;
  recommendedAction: string;
}

export interface BusinessInsight {
  id: number;
  category: 'Retention' | 'Geography' | 'Pricing' | 'Inventory' | 'Sales';
  title: string;
  insightText: string;
  recommendationText: string;
  businessImpact: 'Critical' | 'High' | 'Medium';
  status: string;
  metricsJson?: Record<string, any>;
}

export interface AnalystMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metricsCited?: { label: string; value: string }[];
  suggestedQuestions?: string[];
}

export interface SystemStatus {
  supabaseConnected: boolean;
  supabaseUrlConfigured: boolean;
  mode: 'supabase' | 'local_cache';
  totalTransactions: number;
  totalCustomers: number;
  lastSyncTime: string;
  datasetName: string;
}

export interface InvestigationContributor {
  category: string;
  title: string;
  change: string;
  contributionPct: number;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  direction: 'up' | 'down';
  details: string;
  icon?: string;
}

export interface InvestigationEvidence {
  baselinePeriod: string;
  comparisonPeriod: string;
  metrics: {
    label: string;
    baseline: string;
    current: string;
    change: string;
  }[];
  decomposition?: {
    factor: string;
    amount: number;
    share: number;
  }[];
}

export interface InvestigationResult {
  metricId: string;
  metricName: string;
  currentStatus: string;
  statusDirection?: 'up' | 'down';
  status?: string;
  changePct: number;
  absoluteChange?: number;
  baselinePeriod?: string;
  comparisonPeriod?: string;
  confidenceScore: number;
  summary: string;
  contributors: InvestigationContributor[];
  evidence: InvestigationEvidence;
  businessInterpretation: string;
  suggestedActions: string[];
}

export interface InvestigationScenario {
  id: string;
  name: string;
  category: string;
}

export interface UserPreferences {
  theme: string;
  defaultCurrency: string;
  emailAlerts: boolean;
  anomalyAlertThreshold: string;
  aiModel: string;
}

export interface UserSecurity {
  twoFactorEnabled: boolean;
  lastLogin: string;
  sessionStatus: string;
  authProvider: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  department: string;
  organization: string;
  memberSince: string;
  status: string;
  accessTier: string;
  permissions: string[];
  preferences: UserPreferences;
  security: UserSecurity;
}

export interface ProfileUpdateRequest {
  name?: string;
  role?: string;
  email?: string;
  theme?: string;
  defaultCurrency?: string;
  emailAlerts?: boolean;
  anomalyAlertThreshold?: string;
}

