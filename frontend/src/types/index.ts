export interface TickerSummary {
  symbol: string;
  shortName: string;
  longName: string;
  currentPrice: number;
  previousClose: number;
  dailyChange: number;
  dailyChangePercent: number;
  open: number | null;
  dayLow: number | null;
  dayHigh: number | null;
  volume: number;
  averageVolume: number;
  marketCap: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  dividendYield: number | null;
  trailingPE: number | null;
  currency: string;
  sector: string;
  industry: string;
  longBusinessSummary: string;
}

export interface HistoricalRecord {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  Daily_Return: number;
  Volatility: number;
  SMA_20: number;
  SMA_50: number;
  EMA_12: number;
  EMA_26: number;
  EMA_50: number;
  RSI: number;
  MACD: number;
  MACD_Signal: number;
  MACD_Hist: number;
  BB_Upper: number;
  BB_Middle: number;
  BB_Lower: number;
  Support: number;
  Resistance: number;
  Rolling_Mean_20: number;
  Rolling_Std_20: number;
}

export interface LatestMetrics {
  rsi: number;
  macd: number;
  macd_signal: number;
  macd_hist: number;
  volatility: number;
  bb_upper: number;
  bb_middle: number;
  bb_lower: number;
  support: number;
  resistance: number;
  sma_20: number;
  sma_50: number;
  trend: "Bullish" | "Bearish" | "Neutral";
}

export interface MarketHistoryResponse {
  ticker: string;
  period: string;
  latest: LatestMetrics;
  history: HistoricalRecord[];
}

export interface ModelMetrics {
  mape: number;
  rmse: number;
  mae: number;
  confidence: number;
}

export interface ForecastModelData {
  prices: number[];
  metrics: ModelMetrics;
}

export interface ForecastPredictionPoint {
  date: string;
  price: number;
}

export interface ForecastResponse {
  ticker: string;
  model: string;
  mode: string;
  forecast_days: number;
  predictions: ForecastPredictionPoint[];
  metrics: ModelMetrics;
  status: string;
}

export interface SignalResponse {
  ticker: string;
  latest_price: number;
  signal: "BUY" | "SELL" | "HOLD";
  score: number;
  confidence: number;
  reasons: string[];
}

export interface EquityCurvePoint {
  date: string;
  value: number;
}

export interface BacktestResponse {
  ticker: string;
  strategy: string;
  initialCapital: number;
  finalCapital: number;
  totalReturnPercent: number;
  annualizedReturnPercent: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  winRatePercent: number;
  numberOfTrades: number;
  equityCurve: EquityCurvePoint[];
}

export interface CorrelationData {
  tickers: string[];
  matrix: number[][];
}

export interface ScatterPoint {
  name: string;
  return: number;
  volatility: number;
  weight: number[];
}

export interface PortfolioResponse {
  tickers: string[];
  optimalWeights: Record<string, number>;
  expectedReturnPercent: number;
  portfolioVolatilityPercent: number;
  sharpeRatio: number;
  diversificationScore: number;
  correlationMatrix: CorrelationData;
  scatterPoints: ScatterPoint[];
}

export interface AIExplanationResponse {
  type: string;
  explanation: string;
}
