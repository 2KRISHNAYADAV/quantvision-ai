# Model Lab

The Model Lab is a dedicated interactive workspace for running, training, and testing machine learning forecasting models on financial time-series data.

## Features
- **Algorithm Selection:** Choose from multiple robust models:
  - Statistical: ARIMA, SARIMA
  - Machine Learning: XGBoost
  - Deep Learning: LSTM, GRU
  - Ensemble: A combination of different models for robust forecasting.
- **Run Modes:**
  - **Fast Mode:** Uses pre-calculated features and lighter model configurations for quick testing.
  - **Research Mode:** Performs deeper hyperparameter tuning and longer training for more accurate but compute-intensive results.
- **Forecast Settings:** Customize the forecast horizon (days) and period to train on.
- **Error Metrics:** Evaluate models on metrics such as RMSE (Root Mean Squared Error) and MAPE (Mean Absolute Percentage Error).

## Pipeline Flow
1. **Data Preprocessing:** Missing value interpolation, feature scaling, and generation of technical indicators (EMA, RSI, Volatility).
2. **Training & Inference:** The FastAPI backend spins up the requested model using `scikit-learn`, `statsmodels`, or `PyTorch`.
3. **Visualization:** The forecast arrays are sent back to the frontend and plotted alongside historical data for easy visual comparison.
