# QuantVision AI - Interview Preparation Guide

This guide is designed to help you prepare for technical interviews by detailing the system architecture, technologies, machine learning logic, and design decisions used in this project.

## 1. System Architecture & Tech Stack

**Q: What is the overall architecture of the project?**
**A:** The project uses a decoupled client-server architecture:
- **Frontend:** React 18 (TypeScript) built with Vite. Uses Tailwind CSS for styling and `@tradingview/lightweight-charts` for high-performance financial charting.
- **Backend:** FastAPI (Python) handles API requests asynchronously. It acts as the orchestration layer for data retrieval, machine learning inference, backtesting, and portfolio optimization.
- **Data Layer:** `yfinance` fetches market data.
- **AI Layer:** Google Gemini API provides LLM-driven summaries of technical data.

**Q: Why FastAPI over Django or Flask?**
**A:** FastAPI is asynchronous and highly performant (built on Starlette and Pydantic). Financial data processing and model training can be I/O bound (network requests to Yahoo Finance) or CPU-bound. FastAPI's `async/await` syntax and automatic OpenAPI documentation generation make it ideal for this ML-heavy application.

## 2. Data Engineering & Backend Flow

**Q: How does the application retrieve and process data?**
**A:** Data is fetched via `yfinance`. To optimize performance and reduce API limits, the system caches responses. Missing values are filled (forward/backward fill), and technical indicators (RSI, MACD, EMA) are engineered as features before being fed into ML models.

## 3. Machine Learning Models

**Q: What models are used in the Model Lab, and why?**
**A:**
- **ARIMA/SARIMA:** Good for establishing baseline statistical forecasts and capturing linear autoregressive tendencies.
- **XGBoost:** A gradient boosting tree model excellent at capturing non-linear relationships and tabular data (like technical indicators).
- **LSTM / GRU:** Recurrent Neural Networks (built in PyTorch) designed for sequence data. They maintain an internal state, making them suitable for time-series forecasting where past context matters.
- **Ensemble:** Averages predictions from multiple models to reduce variance and improve robustness.

**Q: What are the differences between Fast and Research modes?**
**A:** Fast mode uses lightweight configurations, fewer epochs, and pre-calculated features for near-instant results. Research mode performs more intensive training, deeper network architectures, or hyperparameter tuning, which takes longer but offers higher fidelity.

## 4. Algorithmic Backtesting

**Q: How is the backtesting engine implemented?**
**A:** It uses a vectorized approach rather than an event-driven loop. By using Pandas/NumPy vectorization, signals (buy/sell) are computed across the entire time series at once, which is orders of magnitude faster than iterating row by row.

**Q: What metrics are used to evaluate a strategy?**
**A:**
- **Sharpe Ratio:** Measures risk-adjusted return.
- **Max Drawdown:** Indicates the worst-case scenario (peak-to-trough drop).
- **Win Rate:** Percentage of profitable trades.

## 5. Portfolio Optimization

**Q: How does the Portfolio Optimizer work?**
**A:** It implements Markowitz's Mean-Variance Optimization.
1. Computes the covariance matrix and annualized returns of the selected assets.
2. Uses `scipy.optimize` to minimize the negative Sharpe Ratio (which effectively maximizes it).
3. The result is an optimal set of weights (percentages) for each asset.

## 6. Generative AI Integration

**Q: How is AI (Gemini) used in this project?**
**A:** Gemini is used as an analysis copilot. It takes raw, quantitative data (e.g., "RSI is 25, MACD is crossing over, Price is $150") and synthesizes it into natural language insights. This bridges the gap between raw numbers and actionable intelligence, mimicking a financial analyst's summary.
