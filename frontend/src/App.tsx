import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardPage } from './pages/DashboardPage';
import { SalesPage } from './pages/SalesPage';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { GeographyPage } from './pages/GeographyPage';
import { ForecastPage } from './pages/ForecastPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { AnalystPage } from './pages/AnalystPage';
import { InvestigationPage } from './pages/InvestigationPage';
import { ProfilePage } from './pages/ProfilePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { api } from './services/api';
import {
  KpiMetrics,
  MonthlySales,
  CustomerSegment,
  TopProduct,
  CountryMetric,
  SalesForecast,
  Anomaly,
  BusinessInsight,
  UserProfile,
} from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Deep-linking parameters
  const [investigationMetric, setInvestigationMetric] = useState<string>('revenue_drop_2010_04');
  const [analystInitialQuery, setAnalystInitialQuery] = useState<string>('');

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Core Data State
  const [kpis, setKpis] = useState<KpiMetrics | null>(null);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [countryMetrics, setCountryMetrics] = useState<CountryMetric[]>([]);
  const [forecast, setForecast] = useState<SalesForecast[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);

  useEffect(() => {
    loadAllData();
    loadProfile();
  }, [selectedCountry]);

  const loadProfile = async () => {
    try {
      const p = await api.getUserProfile();
      setUserProfile(p);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getDashboardKpis(selectedCountry),
        api.getSalesTrends(selectedCountry),
        api.getCustomerSegments(),
        api.getTopProducts(25),
        api.getGeography(),
        api.getForecast(),
        api.getAnomalies(),
        api.getInsights(),
      ]);

      if (results[0].status === 'fulfilled') setKpis(results[0].value);
      if (results[1].status === 'fulfilled') setMonthlySales(results[1].value);
      if (results[2].status === 'fulfilled') setSegments(results[2].value);
      if (results[3].status === 'fulfilled') setTopProducts(results[3].value);
      if (results[4].status === 'fulfilled') setCountryMetrics(results[4].value);
      if (results[5].status === 'fulfilled') setForecast(results[5].value);
      if (results[6].status === 'fulfilled') setAnomalies(results[6].value);
      if (results[7].status === 'fulfilled') setInsights(results[7].value);
    } catch (err) {
      console.error('Error fetching EARIP intelligence data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'investigation') {
      if (param) setInvestigationMetric(param);
      setCurrentTab('investigation');
    } else if (tab === 'analyst') {
      if (param) setAnalystInitialQuery(param);
      setCurrentTab('analyst');
    } else {
      setCurrentTab(tab);
    }
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Executive Overview', subtitle: 'Real-time retail health metrics & high-level KPI dashboard' };
      case 'sales':
        return { title: 'Sales Intelligence', subtitle: 'Detailed revenue trends, monthly breakdown, and volume velocities' };
      case 'customers':
        return { title: 'Customer Intelligence', subtitle: 'RFM behavioral segmentation, VIPs & retention monitoring' };
      case 'products':
        return { title: 'Product Intelligence', subtitle: 'SKU performance rankings, sales volume & return rates' };
      case 'geography':
        return { title: 'Geographic Intelligence', subtitle: 'Country-level revenue, international distribution & concentration risk' };
      case 'forecast':
        return { title: 'Revenue Forecasting', subtitle: 'Machine learning time series projections for upcoming quarters' };
      case 'anomalies':
        return { title: 'Anomaly Detection', subtitle: 'Statistical outlier spikes, operational dips & root-cause diagnostics' };
      case 'investigation':
        return { title: 'Insight Investigation', subtitle: 'Root-cause variance decomposition and key contributor attribution' };
      case 'analyst':
        return { title: 'AI Business Analyst', subtitle: 'Conversational retail decision intelligence powered by Groq Llama-3.3-70B' };
      case 'profile':
        return { title: 'User Profile & IAM', subtitle: 'Enterprise account identity, permissions, preferences & security credentials' };
      case 'recommendations':
        return { title: 'Strategic Recommendations', subtitle: 'AI prescriptive interventions across customer, pricing & supply operations' };
      case 'reports':
        return { title: 'Executive Reports', subtitle: 'Comprehensive dossier generation and raw CSV data export' };
      default:
        return { title: 'EARIP Platform', subtitle: 'Enterprise Retail Intelligence' };
    }
  };

  const availableCountries = countryMetrics.map((c) => c.country);
  const { title, subtitle } = getPageTitle();

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        anomalyCount={anomalies.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          title={title}
          subtitle={subtitle}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          availableCountries={availableCountries}
          onRefresh={loadAllData}
          isLoading={isLoading}
          userProfile={userProfile}
          onNavigateToProfile={() => setCurrentTab('profile')}
          onLogout={() => setCurrentTab('profile')}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {currentTab === 'dashboard' && (
            <DashboardPage
              kpis={kpis}
              monthlySales={monthlySales}
              segments={segments}
              topProducts={topProducts}
              anomalies={anomalies}
              insights={insights}
              forecast={forecast}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'sales' && (
            <SalesPage monthlySales={monthlySales} selectedCountry={selectedCountry} />
          )}

          {currentTab === 'customers' && <CustomersPage segments={segments} />}

          {currentTab === 'products' && <ProductsPage products={topProducts} />}

          {currentTab === 'geography' && <GeographyPage countryMetrics={countryMetrics} />}

          {currentTab === 'forecast' && (
            <ForecastPage monthlySales={monthlySales} forecast={forecast} />
          )}

          {currentTab === 'anomalies' && <AnomaliesPage anomalies={anomalies} />}

          {currentTab === 'investigation' && (
            <InvestigationPage
              initialMetricId={investigationMetric}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'analyst' && (
            <AnalystPage initialQuery={analystInitialQuery} />
          )}

          {currentTab === 'profile' && (
            <ProfilePage
              onProfileUpdated={(p) => setUserProfile(p)}
              onLogout={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'recommendations' && <RecommendationsPage insights={insights} />}

          {currentTab === 'reports' && <ReportsPage kpis={kpis} insights={insights} />}
        </main>
      </div>
    </div>
  );
};

export default App;
