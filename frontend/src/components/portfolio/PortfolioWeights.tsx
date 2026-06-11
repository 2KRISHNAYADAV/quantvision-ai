import React, { useState } from 'react';
import { Briefcase, Play, Plus, X, Loader2 } from 'lucide-react';
import { PortfolioResponse } from '../../types';

interface PortfolioWeightsProps {
  onOptimize: (tickers: string[], period: string) => void;
  result: PortfolioResponse | null;
  loading: boolean;
}

export const PortfolioWeights: React.FC<PortfolioWeightsProps> = ({
  onOptimize,
  result,
  loading,
}) => {
  const [tickerInput, setTickerInput] = useState<string>('');
  const [tickers, setTickers] = useState<string[]>(['AAPL', 'MSFT', 'GOOG', 'AMZN']);
  const [period, setPeriod] = useState<string>('1y');

  const handleAddTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tickerInput.trim().toUpperCase();
    if (clean && !tickers.includes(clean)) {
      setTickers([...tickers, clean]);
      setTickerInput('');
    }
  };

  const handleRemoveTicker = (symbol: string) => {
    setTickers(tickers.filter((t) => t !== symbol));
  };

  const handleOptimizeSubmit = () => {
    if (tickers.length >= 2) {
      onOptimize(tickers, period);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 border-zinc-800 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-display">
            Portfolio Selection
          </h3>
        </div>

        {/* Input form */}
        <form onSubmit={handleAddTicker} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add Ticker (e.g. TSLA)"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
            className="flex-1 bg-zinc-950/70 border border-zinc-900 focus:border-indigo-500/50 outline-none rounded-lg py-2 px-3 text-xs font-semibold text-zinc-200 uppercase"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg flex items-center justify-center transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* List of active tickers */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tickers.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs font-semibold text-zinc-300"
            >
              {t}
              <button
                type="button"
                onClick={() => handleRemoveTicker(t)}
                className="w-4.5 h-4.5 rounded-full flex items-center justify-center hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {tickers.length < 2 && (
            <p className="text-[10px] text-amber-500 w-full mt-1">
              Add at least 2 tickers to enable optimization.
            </p>
          )}
        </div>

        {/* Time Period Selector and Trigger button */}
        <div className="flex items-center gap-3 mb-6 border-t border-zinc-900 pt-5">
          <div className="flex-1">
            <label className="text-[10px] text-zinc-500 block mb-1 font-semibold uppercase">
              Covariance Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-indigo-500/50 outline-none rounded-lg py-2 px-2.5 text-xs text-zinc-300"
            >
              <option value="6mo">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
            </select>
          </div>

          <button
            onClick={handleOptimizeSubmit}
            disabled={tickers.length < 2 || loading}
            className="self-end px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-semibold shadow-lg shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all h-[36px]"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            Run Optimization
          </button>
        </div>
      </div>

      {/* Optimization Results Weights */}
      {result && (
        <div className="border-t border-zinc-900 pt-5 flex-1 flex flex-col justify-end">
          <h4 className="text-xs font-semibold text-zinc-400 mb-3 font-display">Optimal Asset Allocation:</h4>
          <div className="space-y-3">
            {Object.entries(result.optimalWeights).map(([symbol, weight]) => (
              <div key={symbol} className="text-xs">
                <div className="flex justify-between font-semibold text-zinc-300 mb-1">
                  <span>{symbol}</span>
                  <span>{weight.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900/60 border border-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default PortfolioWeights;
