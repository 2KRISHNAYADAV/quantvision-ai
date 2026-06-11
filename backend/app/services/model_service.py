import pandas as pd
import numpy as np
from typing import Dict, Any
from app.models.arima_model import ARIMAPredictor
from app.models.xgboost_model import XGBoostPredictor
from app.models.lstm_model import LSTMPredictor
from app.models.ensemble_model import EnsemblePredictor

class ModelService:
    @staticmethod
    def generate_predictions(df: pd.DataFrame, horizon: int = 15) -> Dict[str, Any]:
        """
        Coordinates the training and predictions of ARIMA, XGBoost, and LSTM,
        blends them via the Ensemble model, and generates future prediction dates.
        """
        prices = df["Close"].values
        
        # Run individual predictors using the new fit/predict/evaluate interface
        # 1. ARIMA
        arima_predictor = ARIMAPredictor(mode="fast")
        arima_predictor.fit(df)
        arima_forecast = arima_predictor.predict(df, horizon)
        arima_metrics = arima_predictor.evaluate(prices[-horizon:], arima_forecast)

        # 2. XGBoost
        xgb_predictor = XGBoostPredictor(mode="fast")
        xgb_predictor.fit(df)
        xgb_forecast = xgb_predictor.predict(df, horizon)
        xgb_metrics = xgb_predictor.evaluate(prices[-horizon:], xgb_forecast)

        # 3. LSTM
        lstm_predictor = LSTMPredictor(mode="fast")
        lstm_predictor.fit(df)
        lstm_forecast = lstm_predictor.predict(df, horizon)
        lstm_metrics = lstm_predictor.evaluate(prices[-horizon:], lstm_forecast)
        
        # 4. Ensemble
        ensemble_predictor = EnsemblePredictor(mode="fast")
        ensemble_predictor.fit(df)
        ensemble_forecast = ensemble_predictor.predict(df, horizon)
        ensemble_metrics = ensemble_predictor.evaluate(prices[-horizon:], ensemble_forecast)
        
        # Generate future business days
        last_date = pd.to_datetime(df["Date"].iloc[-1])
        future_dates = []
        current_date = last_date
        
        while len(future_dates) < horizon:
            current_date += pd.Timedelta(days=1)
            # 0-4 represents Monday-Friday
            if current_date.weekday() < 5:
                future_dates.append(current_date.strftime('%Y-%m-%d'))

        return {
            "dates": future_dates,
            "forecasts": {
                "arima": {
                    "prices": [round(float(p), 2) for p in arima_forecast],
                    "metrics": arima_metrics
                },
                "xgboost": {
                    "prices": [round(float(p), 2) for p in xgb_forecast],
                    "metrics": xgb_metrics
                },
                "lstm": {
                    "prices": [round(float(p), 2) for p in lstm_forecast],
                    "metrics": lstm_metrics
                },
                "ensemble": {
                    "prices": [round(float(p), 2) for p in ensemble_forecast],
                    "metrics": ensemble_metrics
                }
            }
        }
