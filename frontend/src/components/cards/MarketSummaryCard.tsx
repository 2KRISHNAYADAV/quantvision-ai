import React from 'react';
import { TickerSummary } from '../../types';
import { Landmark, Compass, DollarSign, Calendar } from 'lucide-react';

interface MarketSummaryCardProps {
  summary: TickerSummary | null;
  loading: boolean;
}

export const MarketSummaryCard: React.FC<MarketSummaryCardProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 shadow-lg h-full animate-pulse space-y-4">
        <div className="h-6 w-1/4 bg-zinc-800 rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
          <div className="h-10 bg-zinc-800 rounded" />
        </div>
        <div className="h-24 w-full bg-zinc-800 rounded" />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  // Format large numbers (like market cap) into readable strings
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1.0e12) return `$${(num / 1.0e12).toFixed(2)}T`;
    if (num >= 1.0e9) return `$${(num / 1.0e9).toFixed(2)}B`;
    if (num >= 1.0e6) return `$${(num / 1.0e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="glass-panel rounded-xl p-6 shadow-lg border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-display mb-4">
        Asset Profile
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900 flex items-center gap-3 min-w-0">
          <Landmark className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">Sector</p>
            <p className="text-xs font-semibold text-zinc-200 truncate" title={summary.sector}>{summary.sector}</p>
          </div>
        </div>

        <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900 flex items-center gap-3 min-w-0">
          <Compass className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">Industry</p>
            <p className="text-xs font-semibold text-zinc-200 truncate" title={summary.industry}>{summary.industry}</p>
          </div>
        </div>

        <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900 flex items-center gap-3 min-w-0">
          <DollarSign className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">Market Cap</p>
            <p className="text-xs font-semibold text-zinc-200 truncate" title={formatNumber(summary.marketCap)}>{formatNumber(summary.marketCap)}</p>
          </div>
        </div>

        <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900 flex items-center gap-3 min-w-0">
          <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">52W Range</p>
            <p className="text-xs font-semibold text-zinc-200 truncate" title={`$${summary.fiftyTwoWeekLow?.toFixed(2)} - $${summary.fiftyTwoWeekHigh?.toFixed(2)}`}>
              ${summary.fiftyTwoWeekLow?.toFixed(2)} - ${summary.fiftyTwoWeekHigh?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 border-t border-zinc-900 pt-5 text-xs">
        <div className="truncate" title={`Trailing P/E: ${summary.trailingPE ? summary.trailingPE.toFixed(2) : 'N/A'}`}>
          <span className="text-zinc-500">Trailing P/E:</span>{' '}
          <span className="font-semibold text-zinc-300">
            {summary.trailingPE ? summary.trailingPE.toFixed(2) : 'N/A'}
          </span>
        </div>
        <div className="truncate" title={`Div Yield: ${summary.dividendYield ? `${(summary.dividendYield * 100).toFixed(2)}%` : '0.00%'}`}>
          <span className="text-zinc-500">Div Yield:</span>{' '}
          <span className="font-semibold text-zinc-300">
            {summary.dividendYield ? `${(summary.dividendYield * 100).toFixed(2)}%` : '0.00%'}
          </span>
        </div>
        <div className="truncate" title={`Volume: ${summary.volume ? summary.volume.toLocaleString() : 'N/A'}`}>
          <span className="text-zinc-500">Volume:</span>{' '}
          <span className="font-semibold text-zinc-300">
            {summary.volume ? summary.volume.toLocaleString() : 'N/A'}
          </span>
        </div>
        <div className="truncate" title={`Trading Currency: ${summary.currency}`}>
          <span className="text-zinc-500">Trading Currency:</span>{' '}
          <span className="font-semibold text-zinc-300 uppercase">{summary.currency}</span>
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-5">
        <h4 className="text-xs font-semibold text-zinc-400 mb-2 font-display">Business Summary:</h4>
        <p className="text-xs text-zinc-400 leading-relaxed max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
          {summary.longBusinessSummary}
        </p>
      </div>
    </div>
  );
};
export default MarketSummaryCard;
