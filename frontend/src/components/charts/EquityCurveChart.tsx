import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { EquityCurvePoint } from '../../types';

interface EquityCurveChartProps {
  data: EquityCurvePoint[];
  loading: boolean;
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 h-[380px] flex items-center justify-center animate-pulse">
        <div className="h-60 w-full bg-zinc-800 rounded" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 h-[380px] flex items-center justify-center text-zinc-500">
        <p className="text-sm">No backtest simulation run yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-5 border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-display">
          Backtest Equity Curve
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">Account Valuation Growth Over Time ($)</p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(24, 24, 27, 0.4)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#52525b"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#52525b"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Portfolio Value']}
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#f4f4f5',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#818cf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default EquityCurveChart;
