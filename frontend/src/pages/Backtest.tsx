import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BacktestResponse } from '../types';
import { EquityCurveChart } from '../components/charts/EquityCurveChart';
import { AIInsightPanel } from '../components/ai/AIInsightPanel';
import { Sliders, Play } from 'lucide-react';

interface BacktestProps {
  ticker: string;
}

export const Backtest: React.FC<BacktestProps> = ({ ticker }) => {
  const [strategy, setStrategy] = useState<string>('rsi');
  const [capital, setCapital] = useState<number>(10000);
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRunBacktest = async () => {
    setLoading(true);
    try {
      const res = await api.runBacktest(ticker, strategy, capital);
      setResult(res);
    } catch (e) {
      console.error('Error running backtest:', e);
    } finally {
      setLoading(false);
    }
  };

  // Run backtest initially when ticker changes
  useEffect(() => {
    handleRunBacktest();
  }, [ticker, strategy]);

  return (
    <div className="space-y-6">
      {/* 1. Controller Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-5 border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-display">
              Strategy Settings
            </h3>
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 block mb-1 font-semibold uppercase">Trading Strategy</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-500/50 outline-none rounded-lg py-2.5 px-3 text-xs text-zinc-300"
            >
              <option value="rsi">RSI Mean Reversion (30/70)</option>
              <option value="ma_crossover">EMA Trend Crossover (12/26)</option>
              <option value="macd">MACD Momentum Crossover</option>
              <option value="ml_forecast">ML-Momentum Adaptive</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 block mb-1 font-semibold uppercase">Initial Capital ($)</label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-500/50 outline-none rounded-lg py-2.5 px-3 text-xs font-semibold text-zinc-200"
            />
          </div>

          <button
            onClick={handleRunBacktest}
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Simulate Strategy
          </button>
        </div>

        {/* 2. Key Metrics Row */}
        {result && (
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-5 border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-display">Final Equity</span>
              <h4 className="text-2xl font-bold text-zinc-100 font-display mt-2">${result.finalCapital.toLocaleString()}</h4>
              <span className={`text-[10px] font-semibold mt-1 inline-block ${result.totalReturnPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.totalReturnPercent >= 0 ? '+' : ''}{result.totalReturnPercent.toFixed(1)}% Return
              </span>
            </div>

            <div className="glass-panel rounded-xl p-5 border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-display">Max Drawdown</span>
              <h4 className="text-2xl font-bold text-rose-400 font-display mt-2">{result.maxDrawdownPercent.toFixed(1)}%</h4>
              <span className="text-[10px] text-zinc-500 mt-1">Peak-to-Trough Decline</span>
            </div>

            <div className="glass-panel rounded-xl p-5 border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-display">Sharpe Ratio</span>
              <h4 className="text-2xl font-bold text-indigo-400 font-display mt-2">{result.sharpeRatio.toFixed(2)}</h4>
              <span className="text-[10px] text-zinc-500 mt-1">Risk-Adjusted Ratio</span>
            </div>

            <div className="glass-panel rounded-xl p-5 border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-display">Win Rate</span>
              <h4 className="text-2xl font-bold text-emerald-400 font-display mt-2">{result.winRatePercent.toFixed(1)}%</h4>
              <span className="text-[10px] text-zinc-500 mt-1">{result.numberOfTrades} Trades executed</span>
            </div>

            <div className="glass-panel rounded-xl p-5 border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-display">CAGR Return</span>
              <h4 className="text-2xl font-bold text-zinc-200 font-display mt-2">{result.annualizedReturnPercent.toFixed(1)}%</h4>
              <span className="text-[10px] text-zinc-500 mt-1">Annualized Return</span>
            </div>

            <div className="glass-panel rounded-xl p-5 border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase font-display">Target Asset</span>
              <h4 className="text-2xl font-bold text-zinc-400 font-display mt-2">{ticker}</h4>
              <span className="text-[10px] text-zinc-500 mt-1 uppercase">2-Year Timeline</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Equity Curve Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EquityCurveChart data={result ? result.equityCurve : []} loading={loading} />
        </div>
        
        {/* Explain results with Gemini AI */}
        <div>
          <AIInsightPanel
            type="forecast"
            data={result ? {
              ticker,
              metrics: {
                mape: result.maxDrawdownPercent / 100, // Pass risk metrics to map in prompt
                rmse: result.sharpeRatio,
                mae: result.finalCapital,
                confidence: result.winRatePercent / 100
              },
              prices: result.equityCurve.slice(-15).map(e => e.value),
              latest_price: result.initialCapital
            } : null}
            ticker={ticker}
          />
        </div>
      </div>
    </div>
  );
};
export default Backtest;
