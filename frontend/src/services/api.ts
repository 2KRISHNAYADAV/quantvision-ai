import axios from 'axios';
import {
  TickerSummary,
  MarketHistoryResponse,
  ForecastResponse,
  SignalResponse,
  BacktestResponse,
  PortfolioResponse,
  AIExplanationResponse
} from '../types';

const API_CLIENT = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Market endpoints
  getSummary: async (ticker: string): Promise<TickerSummary> => {
    const response = await API_CLIENT.get<TickerSummary>(`/market/summary`, {
      params: { ticker },
    });
    return response.data;
  },

  getHistory: async (ticker: string, period: string = '2y'): Promise<MarketHistoryResponse> => {
    const response = await API_CLIENT.get<MarketHistoryResponse>(`/market/history`, {
      params: { ticker, period },
    });
    return response.data;
  },

  // Forecast endpoints
  getForecast: async (
    ticker: string, 
    forecast_days: number = 15,
    model: string = 'ensemble',
    period: string = '5y',
    mode: string = 'fast'
  ): Promise<ForecastResponse> => {
    const response = await API_CLIENT.post<ForecastResponse>(`/forecast/predict`, {
      ticker,
      model,
      period,
      forecast_days,
      mode
    });
    return response.data;
  },

  // Signal endpoints
  getSignals: async (ticker: string): Promise<SignalResponse> => {
    const response = await API_CLIENT.get<SignalResponse>(`/signals/analyze`, {
      params: { ticker },
    });
    return response.data;
  },

  // Backtest endpoints
  runBacktest: async (
    ticker: string,
    strategy: string,
    initialCapital: number = 10000
  ): Promise<BacktestResponse> => {
    const response = await API_CLIENT.post<BacktestResponse>(`/backtest/run`, {
      ticker,
      strategy,
      initial_capital: initialCapital,
    });
    return response.data;
  },

  // Portfolio endpoints
  optimizePortfolio: async (
    tickers: string[],
    period: string = '1y'
  ): Promise<PortfolioResponse> => {
    const response = await API_CLIENT.post<PortfolioResponse>(`/portfolio/optimize`, {
      tickers,
      period,
    });
    return response.data;
  },

  // Gemini AI endpoints
  getAIExplanation: async (type: 'signal' | 'forecast' | 'portfolio', data: any): Promise<AIExplanationResponse> => {
    const response = await API_CLIENT.post<AIExplanationResponse>(`/ai/explain`, {
      type,
      data,
    });
    return response.data;
  },
};
export default api;
