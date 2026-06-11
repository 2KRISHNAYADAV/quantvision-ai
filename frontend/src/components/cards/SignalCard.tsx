import React from 'react';
import { SignalResponse } from '../../types';
import { ShieldAlert, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';

interface SignalCardProps {
  data: SignalResponse | null;
  loading: boolean;
}

export const SignalCard: React.FC<SignalCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 shadow-lg h-[320px] flex flex-col justify-between animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-1/3 bg-zinc-800 rounded" />
          <div className="h-10 w-1/2 bg-zinc-800 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-800 rounded" />
          <div className="h-4 w-full bg-zinc-800 rounded" />
          <div className="h-4 w-5/6 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-panel rounded-xl p-6 shadow-lg h-[320px] flex flex-col items-center justify-center text-zinc-500">
        <ShieldAlert className="w-12 h-12 stroke-[1.5] text-zinc-600 mb-2 animate-bounce" />
        <p className="text-sm">Search a stock to analyze trading signals</p>
      </div>
    );
  }

  const isBuy = data.signal === 'BUY';
  const isSell = data.signal === 'SELL';
  


  const badgeColor = isBuy
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : isSell
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  // Map score (-12 to +12) to percentage slider (0% to 100%)
  const scorePercentage = ((data.score + 12) / 24) * 100;

  return (
    <div className="glass-panel rounded-xl p-6 shadow-lg flex flex-col justify-between border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-display">
            Signal Analysis
          </h3>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${badgeColor}`}>
            Confidence: {data.confidence}%
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Consensus Strategy Recommendation</p>
            <h2 className={`text-4xl font-extrabold font-display tracking-tight mt-1 ${isBuy ? 'text-emerald-400' : isSell ? 'text-rose-400' : 'text-amber-400'}`}>
              {data.signal}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs">
            Score: <span className="font-bold text-zinc-200">{data.score > 0 ? `+${data.score}` : data.score}</span>
          </div>
        </div>

        {/* Custom score visual slider */}
        <div className="mt-5">
          <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
            <span>Strong Bearish</span>
            <span>Neutral</span>
            <span>Strong Bullish</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden relative">
            <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-zinc-700 z-10" />
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBuy ? 'bg-emerald-500' : isSell ? 'bg-rose-500' : 'bg-amber-500'
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-semibold text-zinc-400 mb-2 font-display">Supporting Analysis Log:</h4>
        <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {data.reasons.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-zinc-400 leading-normal"
            >
              {isBuy ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : isSell ? (
                <ArrowDownRight className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              ) : (
                <RefreshCcw className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              )}
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SignalCard;
