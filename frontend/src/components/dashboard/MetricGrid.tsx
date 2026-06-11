import React from 'react';
import { MetricCard } from '../cards/MetricCard';
import { TickerSummary, LatestMetrics } from '../../types';

interface MetricGridProps {
  summary: TickerSummary | null;
  indicators: LatestMetrics | null;
  loading: boolean;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ summary, indicators, loading }) => {
  const formatVolume = (vol: number | undefined): string => {
    if (!vol) return 'N/A';
    if (vol >= 1.0e6) return `${(vol / 1.0e6).toFixed(1)}M`;
    if (vol >= 1.0e3) return `${(vol / 1.0e3).toFixed(1)}K`;
    return vol.toLocaleString();
  };

  const getPriceTrend = (): 'up' | 'down' | 'neutral' => {
    if (!summary) return 'neutral';
    return summary.dailyChangePercent > 0 ? 'up' : summary.dailyChangePercent < 0 ? 'down' : 'neutral';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Current Price"
        value={summary ? `$${summary.currentPrice.toFixed(2)}` : null}
        subValue={summary ? `${summary.dailyChangePercent >= 0 ? '+' : ''}${summary.dailyChangePercent.toFixed(2)}%` : undefined}
        trend={getPriceTrend()}
        loading={loading}
      />
      <MetricCard
        title="Annual Volatility"
        value={indicators ? `${(indicators.volatility ?? 0).toFixed(1)}%` : null}
        subValue={indicators && (indicators.volatility ?? 0) > 30 ? "High Risk" : indicators ? "Moderate" : undefined}
        trend={indicators && (indicators.volatility ?? 0) > 30 ? 'down' : 'neutral'}
        loading={loading}
      />
      <MetricCard
        title="Daily Vol Volume"
        value={summary ? formatVolume(summary.volume) : null}
        subValue={summary ? `Avg: ${formatVolume(summary.averageVolume)}` : undefined}
        trend="neutral"
        loading={loading}
      />
      <MetricCard
        title="Trend Channel"
        value={indicators ? indicators.trend : null}
        subValue={indicators ? `RSI: ${(indicators.rsi ?? 0).toFixed(0)}` : undefined}
        trend={indicators?.trend === 'Bullish' ? 'up' : indicators?.trend === 'Bearish' ? 'down' : 'neutral'}
        loading={loading}
      />
    </div>
  );
};
export default MetricGrid;
