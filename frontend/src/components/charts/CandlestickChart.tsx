import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { HistoricalRecord } from '../../types';

interface CandlestickChartProps {
  data: HistoricalRecord[];
  ticker: string;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, ticker }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const container = chartContainerRef.current;

    // Create chart instance
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#09090b' }, // bg-zinc-950
        textColor: '#a1a1aa', // text-zinc-400
      },
      grid: {
        vertLines: { color: 'rgba(24, 24, 27, 0.5)' },
        horzLines: { color: 'rgba(24, 24, 27, 0.5)' },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
      width: container.clientWidth,
      height: 380,
    });

    // 1. Add Candlesticks Series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981', // emerald-500
      downColor: '#f43f5e', // rose-500
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    });

    // Map and sort historical data in ascending order (required by TV charts)
    let sortedData = [...data].sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );
    
    // Deduplicate by Date to prevent lightweight-charts strictly-ascending crashes
    const uniqueMap = new Map();
    sortedData.forEach(d => uniqueMap.set(d.Date, d));
    sortedData = Array.from(uniqueMap.values());

    const candleData = sortedData
      .map((d) => ({
        time: d.Date,
        open: d.Open,
        high: d.High,
        low: d.Low,
        close: d.Close,
      }))
      .filter((d) => 
        d.open !== null && !isNaN(d.open) &&
        d.high !== null && !isNaN(d.high) &&
        d.low !== null && !isNaN(d.low) &&
        d.close !== null && !isNaN(d.close)
      );
    
    candlestickSeries.setData(candleData);

    // 2. Add SMA 20 Overlay Line
    const sma20Series = chart.addLineSeries({
      color: '#6366f1', // indigo-500
      lineWidth: 2,
      title: 'SMA 20',
    });
    const sma20Data = sortedData
      .map((d) => ({ time: d.Date, value: d.SMA_20 }))
      .filter((d) => d.value !== null && d.value !== undefined && !isNaN(d.value));
    sma20Series.setData(sma20Data);

    // 3. Add SMA 50 Overlay Line
    const sma50Series = chart.addLineSeries({
      color: '#eab308', // yellow-500
      lineWidth: 2,
      title: 'SMA 50',
    });
    const sma50Data = sortedData
      .map((d) => ({ time: d.Date, value: d.SMA_50 }))
      .filter((d) => d.value !== null && d.value !== undefined && !isNaN(d.value));
    sma50Series.setData(sma50Data);

    // 4. Add Volume Histogram (Overlay at bottom)
    const volumeSeries = chart.addHistogramSeries({
      color: '#262626',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // overlay
    });
    
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.75, // volume bars occupy only the bottom 25% of the chart
        bottom: 0,
      },
    });

    const volumeData = sortedData
      .map((d) => ({
        time: d.Date,
        value: d.Volume,
        color: d.Close >= d.Open ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
      }))
      .filter((d) => d.value !== null && d.value !== undefined && !isNaN(d.value));
    volumeSeries.setData(volumeData);

    // Fit time scale content
    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="glass-panel rounded-xl p-5 border-zinc-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 font-display">
            Candlestick History
          </h3>
          <p className="text-xs text-zinc-400 font-bold mt-0.5">{ticker} Price Action</p>
        </div>
        
        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-0.5 bg-indigo-500 inline-block rounded" />
            <span className="text-zinc-400 font-mono">SMA 20</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-0.5 bg-yellow-500 inline-block rounded" />
            <span className="text-zinc-400 font-mono">SMA 50</span>
          </div>
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full h-[380px] select-none relative" />
    </div>
  );
};
export default CandlestickChart;
