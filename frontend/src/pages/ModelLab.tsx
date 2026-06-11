import React, { useState } from 'react';
import { api } from '../services/api';
import { ForecastResponse } from '../types';
import { ForecastChart } from '../components/charts/ForecastChart';
import { Settings, Play, Info, AlertTriangle, Zap, TestTube2 } from 'lucide-react';

interface ModelLabProps {
  ticker: string;
}

export const ModelLab: React.FC<ModelLabProps> = ({ ticker }) => {
  const [model, setModel] = useState<string>('lstm');
  const [period, setPeriod] = useState<string>('5y');
  const [forecastDays, setForecastDays] = useState<number>(30);
  const [mode, setMode] = useState<string>('fast');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRunPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const [historyRes, forecastRes] = await Promise.all([
        api.getHistory(ticker, period),
        api.getForecast(ticker, forecastDays, model, period, mode)
      ]);
      setHistory(historyRes.history);
      setForecast(forecastRes);
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.detail || e.message || 'An error occurred while running the model.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">Model Lab</h2>
          <p className="text-zinc-400 text-sm">Experiment with quantitative models and view predictions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-xl border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Settings className="w-4 h-4 text-indigo-400" />
              Model Parameters
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Ticker Symbol</label>
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-300">
                  {ticker}
                </div>
                <p className="text-[10px] text-zinc-600 mt-1">Change ticker in the header search bar.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Model</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="lstm">LSTM (Deep Learning)</option>
                  <option value="gru">GRU (Deep Learning)</option>
                  <option value="xgboost">XGBoost (Tree Based)</option>
                  <option value="arima">ARIMA (Statistical)</option>
                  <option value="ensemble">Ensemble (Blended)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Historical Training Period</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="1y">1 Year</option>
                  <option value="2y">2 Years</option>
                  <option value="5y">5 Years</option>
                  <option value="10y">10 Years</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Forecast Horizon (Days)</label>
                <input 
                  type="number"
                  min="1"
                  max="90"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm outline-none focus:border-indigo-500"
                  value={forecastDays}
                  onChange={(e) => setForecastDays(parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1 block">Execution Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode('fast')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      mode === 'fast' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Fast Mode
                  </button>
                  <button
                    onClick={() => setMode('research')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      mode === 'research' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    Research
                  </button>
                </div>
                <p className="text-[10px] text-zinc-600 mt-1 leading-tight">
                  {mode === 'fast' 
                    ? 'Uses lightweight models or cached weights for instant results.' 
                    : 'Runs full localized training. May take longer depending on hardware.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleRunPrediction}
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running Model...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Prediction
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs flex gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          {forecast ? (
            <>
              <ForecastChart
                forecast={forecast}
                history={history}
                loading={loading}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-xl border-zinc-800">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Confidence</h4>
                  <div className="text-2xl font-bold font-display text-white">
                    {(forecast.metrics.confidence * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-zinc-800">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">MAPE</h4>
                  <div className="text-2xl font-bold font-display text-white">
                    {(forecast.metrics.mape * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="glass-panel p-4 rounded-xl border-zinc-800">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">RMSE</h4>
                  <div className="text-2xl font-bold font-display text-white">
                    ${forecast.metrics.rmse.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-xl border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Info className="w-24 h-24 text-indigo-500" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Gemini AI Explanation
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
                  The {forecast.model.toUpperCase()} model has generated a forecast for {forecast.ticker} 
                  over the next {forecast.forecast_days} days. With a Mean Absolute Percentage Error (MAPE) of 
                  {(forecast.metrics.mape * 100).toFixed(2)}% and an overall confidence score of 
                  {(forecast.metrics.confidence * 100).toFixed(1)}%, the projection indicates 
                  {forecast.predictions[forecast.predictions.length - 1].price > history[history.length - 1]?.Close ? ' an upward ' : ' a downward '} 
                  trend. 
                  <br /><br />
                  Note: This explanation is dynamically generated based on the latest metrics. 
                  The model utilizes {period} of historical context to identify patterns. 
                  Always correlate these findings with broader market fundamentals before making decisions.
                </p>
              </div>
            </>
          ) : (
            <div className="glass-panel h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border-zinc-800 rounded-xl">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
                <TestTube2 className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-2">Ready to Experiment</h3>
              <p className="text-zinc-500 text-sm max-w-sm">
                Select your parameters on the left and run a prediction to view detailed model forecasts, performance metrics, and AI analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
