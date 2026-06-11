import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ForecastResponse, HistoricalRecord } from '../../types';

interface ForecastChartProps {
  forecast: ForecastResponse | null;
  history: HistoricalRecord[];
  loading: boolean;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ forecast, history, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 h-[440px] flex items-center justify-center animate-pulse">
        <div className="text-center space-y-2">
          <div className="h-4 w-32 bg-zinc-800 rounded mx-auto" />
          <div className="h-64 w-[360px] sm:w-[500px] bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!forecast || !forecast.predictions || history.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 h-[440px] flex items-center justify-center text-zinc-500">
        <p className="text-sm">No forecast data available. Load a stock ticker to start predictions.</p>
      </div>
    );
  }

  // Prepend the last 15 historical close prices to show context
  let sortedHistory = [...history].sort(
    (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
  );
  
  // Deduplicate history
  const uniqueMap = new Map();
  sortedHistory.forEach(d => uniqueMap.set(d.Date, d));
  sortedHistory = Array.from(uniqueMap.values());

  const historyContext = sortedHistory.slice(-15).map((d) => ({
    date: d.Date,
    Actual: d.Close,
    Predicted: null as number | null,
  }));

  const forecastPoints = forecast.predictions.map((p) => ({
    date: p.date,
    Actual: null as number | null,
    Predicted: p.price,
  }));

  // Link historical context with the prediction timeline
  const lastHistoryPoint = historyContext[historyContext.length - 1];
  if (lastHistoryPoint && forecastPoints[0]) {
    // Stitch forecast lines to the final historical close
    forecastPoints[0].Actual = lastHistoryPoint.Actual;
    forecastPoints[0].Predicted = lastHistoryPoint.Actual;
  }

  const chartData = [...historyContext, ...forecastPoints];
  
  const metricColor = forecast.metrics.mape < 0.05 ? "text-emerald-400" : forecast.metrics.mape < 0.1 ? "text-amber-400" : "text-rose-400";

  return (
    <div className="glass-panel rounded-xl p-5 border-zinc-800 hover:border-zinc-700 transition-all duration-300 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-display">
            Forecasting Projection ({forecast.model.toUpperCase()})
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">{forecast.forecast_days}-Day Out-of-Sample Projections</p>
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
          <div className="flex items-center gap-1 font-semibold text-zinc-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Confidence: {(forecast.metrics.confidence * 100).toFixed(0)}%
          </div>
          <div className={`flex items-center gap-1 font-semibold font-mono ${metricColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${metricColor.replace('text-', 'bg-')}`} />
            MAPE: {(forecast.metrics.mape * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                borderColor: '#27272a',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#f4f4f5',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
            />
            
            {/* Historical prices */}
            <Line
              name="Historical Close"
              type="monotone"
              dataKey="Actual"
              stroke="#71717a"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4 }}
              strokeDasharray="4 4"
            />
            
            {/* Predicted Model */}
            <Line
              name={`${forecast.model.toUpperCase()} Prediction`}
              type="monotone"
              dataKey="Predicted"
              stroke="#818cf8" // indigo-400
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default ForecastChart;
