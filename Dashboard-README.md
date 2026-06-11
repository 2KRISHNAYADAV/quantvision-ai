# Dashboard Component

The Main Dashboard is the entry point of QuantVision AI, providing real-time market data retrieval, technical indicators, and Gemini AI insights.

## Features
- **Search-based Stock Data Loader:** Enter any valid stock ticker symbol to fetch real-time and historical OHLCV data.
- **Live Metrics Cards:** Displays key metrics like volatility, average volume, daily returns, and asset profile details (Sector, Industry, Market Cap, 52W Range, P/E).
- **Interactive Charts:** High-performance, TradingView-style interactive candlestick charts that visualize price history over various periods (1mo, 3mo, 6mo, 1y).
- **Gemini Co-Pilot Analysis:** Triggers a Google Gemini LLM synthesis to provide natural-language risk narratives and technical summaries based on current indicators.

## Technologies Used
- React 18 & Vite
- Tailwind CSS (glass-panel styling, dark mode)
- `@tradingview/lightweight-charts` & `Recharts`
- Backend integration via Axios fetching from FastAPI `yfinance` routes.
