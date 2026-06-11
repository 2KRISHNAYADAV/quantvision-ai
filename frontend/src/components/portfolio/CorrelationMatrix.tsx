import React from 'react';
import { CorrelationData } from '../../types';

interface CorrelationMatrixProps {
  data: CorrelationData | null;
  loading: boolean;
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 h-[380px] flex items-center justify-center animate-pulse">
        <div className="h-64 w-64 bg-zinc-800 rounded" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-panel rounded-xl p-6 h-[380px] flex items-center justify-center text-zinc-500">
        <p className="text-sm">Run portfolio optimization to view asset correlations.</p>
      </div>
    );
  }

  const { tickers, matrix } = data;

  // Helper to color matrices boxes dynamically based on correlation coefficient value
  const getBoxStyle = (val: number) => {
    // correlation range is -1 to +1
    if (val === 1) return 'bg-indigo-600/90 text-white';
    
    if (val > 0) {
      // Scale indigo opacity
      return `text-indigo-200 border-indigo-500/10`;
    } else {
      // Scale rose opacity for negative correlations
      return `text-rose-200 border-rose-500/10`;
    }
  };

  const getBgColor = (val: number) => {
    if (val === 1) return 'rgba(99, 102, 241, 0.9)'; // Full primary color for diagonal
    if (val > 0) {
      return `rgba(99, 102, 241, ${val * 0.7})`; // Blue/Indigo scale
    }
    return `rgba(244, 63, 94, ${Math.abs(val) * 0.7})`; // Red/Rose scale
  };

  return (
    <div className="glass-panel rounded-xl p-5 border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-display">
          Asset Correlation Heatmap
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">Historical Return Comovement (Pearson R)</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[280px] flex flex-col items-center py-2">
          {/* Header Row */}
          <div className="flex w-full mb-1 pl-12">
            {tickers.map((t) => (
              <div
                key={t}
                className="flex-1 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono py-1"
              >
                {t}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {tickers.map((tickerRow, rIdx) => (
            <div key={tickerRow} className="flex w-full items-center mb-1">
              {/* Row Header */}
              <div className="w-12 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono pr-2 truncate">
                {tickerRow}
              </div>
              
              {/* Grid Cells */}
              <div className="flex-1 flex gap-1">
                {matrix[rIdx].map((val, cIdx) => (
                  <div
                    key={`${tickerRow}-${cIdx}`}
                    style={{ backgroundColor: getBgColor(val) }}
                    className={`flex-1 aspect-square rounded flex items-center justify-center text-[10px] font-bold font-mono border ${getBoxStyle(val)} min-h-[44px] transition-all hover:scale-105`}
                    title={`${tickerRow} vs ${tickers[cIdx]}: ${val}`}
                  >
                    {val.toFixed(2)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CorrelationMatrix;
