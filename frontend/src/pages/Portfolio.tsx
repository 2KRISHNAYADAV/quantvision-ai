import React, { useState } from 'react';
import { PortfolioWeights } from '../components/portfolio/PortfolioWeights';
import { CorrelationMatrix } from '../components/portfolio/CorrelationMatrix';
import { AIInsightPanel } from '../components/ai/AIInsightPanel';
import { PortfolioResponse } from '../types';
import { api } from '../services/api';
import { Activity, ShieldAlert } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const [result, setResult] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (tickers: string[], period: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.optimizePortfolio(tickers, period);
      setResult(res);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to optimize portfolio. Verify symbols are correct.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-semibold">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Main Grid: Inputs vs Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PortfolioWeights
            onOptimize={handleOptimize}
            result={result}
            loading={loading}
          />
        </div>
        
        <div className="lg:col-span-2">
          <CorrelationMatrix
            data={result ? result.correlationMatrix : null}
            loading={loading}
          />
        </div>
      </div>

      {/* 2. Metrics & AI Narrative Row */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metrics summary card */}
          <div className="glass-panel rounded-xl p-6 border-zinc-800 space-y-4 justify-between flex flex-col">
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-display">
                Optimized Portfolio Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-900">
                <span className="text-[10px] text-zinc-500 block">Expected Return</span>
                <span className="text-lg font-bold text-zinc-100 font-display">{result.expectedReturnPercent.toFixed(2)}%</span>
              </div>
              
              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-900">
                <span className="text-[10px] text-zinc-500 block">Expected Volatility</span>
                <span className="text-lg font-bold text-zinc-100 font-display">{result.portfolioVolatilityPercent.toFixed(2)}%</span>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-900">
                <span className="text-[10px] text-zinc-500 block">Max Sharpe Ratio</span>
                <span className="text-lg font-bold text-indigo-400 font-display">{result.sharpeRatio.toFixed(2)}</span>
              </div>

              <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-900">
                <span className="text-[10px] text-zinc-500 block">Diversification Score</span>
                <span className="text-lg font-bold text-emerald-400 font-display">{result.diversificationScore}/100</span>
              </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg p-3 text-[10px] text-zinc-400">
              Mean-variance optimization generates allocations corresponding to the highest return-per-unit-risk (maximum Sharpe Ratio) along the efficient frontier.
            </div>
          </div>

          {/* Gemini commentary box */}
          <div className="lg:col-span-2">
            <AIInsightPanel
              type="portfolio"
              data={{
                tickers: result.tickers,
                weights: result.optimalWeights,
                expected_return: result.expectedReturnPercent,
                volatility: result.portfolioVolatilityPercent,
                sharpe: result.sharpeRatio,
                diversification_score: result.diversificationScore
              }}
              ticker={result.tickers.join(', ')}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Portfolio;
