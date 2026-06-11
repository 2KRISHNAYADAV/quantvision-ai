import React, { useEffect, useState } from 'react';
import { MetricGrid } from '../components/dashboard/MetricGrid';
import { CandlestickChart } from '../components/charts/CandlestickChart';
import { ForecastChart } from '../components/charts/ForecastChart';
import { SignalCard } from '../components/cards/SignalCard';
import { AIInsightPanel } from '../components/ai/AIInsightPanel';
import { MarketSummaryCard } from '../components/cards/MarketSummaryCard';
import { TickerSummary, MarketHistoryResponse, ForecastResponse, SignalResponse } from '../types';
import { api } from '../services/api';

interface DashboardProps {
  ticker: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ ticker }) => {
  const [summary, setSummary] = useState<TickerSummary | null>(null);
  const [historyData, setHistoryData] = useState<MarketHistoryResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [signals, setSignals] = useState<SignalResponse | null>(null);
  
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingSignals, setLoadingSignals] = useState(false);

  useEffect(() => {
    if (!ticker) return;

    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const res = await api.getSummary(ticker);
        setSummary(res);
      } catch (e) {
        console.error('Error fetching summary:', e);
      } finally {
        setLoadingSummary(false);
      }
    };

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await api.getHistory(ticker, '2y');
        setHistoryData(res);
      } catch (e) {
        console.error('Error fetching history:', e);
      } finally {
        setLoadingHistory(false);
      }
    };

    const fetchForecast = async () => {
      setLoadingForecast(true);
      try {
        const res = await api.getForecast(ticker, 15);
        setForecast(res);
      } catch (e) {
        console.error('Error fetching forecast:', e);
      } finally {
        setLoadingForecast(false);
      }
    };

    const fetchSignals = async () => {
      setLoadingSignals(true);
      try {
        const res = await api.getSignals(ticker);
        setSignals(res);
      } catch (e) {
        console.error('Error fetching signals:', e);
      } finally {
        setLoadingSignals(false);
      }
    };

    fetchSummary();
    fetchHistory();
    fetchForecast();
    fetchSignals();
  }, [ticker]);

  return (
    <div className="space-y-6">
      {/* 1. Header Metrics summary */}
      <MetricGrid
        summary={summary}
        indicators={historyData ? historyData.latest : null}
        loading={loadingSummary || loadingHistory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Candlestick and Forecast Charts */}
        <div className="lg:col-span-2 space-y-6">
          <CandlestickChart
            data={historyData ? historyData.history : []}
            ticker={ticker}
          />
          
          <ForecastChart
            forecast={forecast}
            history={historyData ? historyData.history : []}
            loading={loadingForecast}
          />
        </div>

        {/* Right Column: Signal details, AI summary, Profile */}
        <div className="space-y-6">
          <SignalCard
            data={signals}
            loading={loadingSignals}
          />
          
          <AIInsightPanel
            type="signal"
            data={signals}
            ticker={ticker}
          />

          <MarketSummaryCard
            summary={summary}
            loading={loadingSummary}
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
