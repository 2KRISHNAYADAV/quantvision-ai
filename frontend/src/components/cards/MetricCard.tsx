import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number | null | undefined;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  trend,
  loading = false,
}) => {
  return (
    <div className="glass-panel rounded-xl p-5 shadow-lg relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:border-zinc-800">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-display">
        {title}
      </p>
      
      {loading ? (
        <div className="mt-2 h-8 w-24 bg-zinc-800 rounded animate-pulse" />
      ) : (
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display tracking-tight text-zinc-100">
            {value !== undefined && value !== null ? value : 'N/A'}
          </span>
          {subValue && (
            <span
              className={`text-xs font-medium ${
                trend === 'up'
                  ? 'text-emerald-400'
                  : trend === 'down'
                  ? 'text-rose-400'
                  : 'text-zinc-400'
              }`}
            >
              {subValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default MetricCard;
