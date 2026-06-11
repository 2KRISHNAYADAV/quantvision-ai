from fastapi import APIRouter, HTTPException, Query
from app.services.data_service import DataService
from app.services.indicator_service import IndicatorService
from app.services.model_service import ModelService
from app.services.signal_service import SignalService
from typing import Dict, Any

router = APIRouter(prefix="/signals", tags=["Signal Analysis"])

@router.get("/analyze", response_model=Dict[str, Any])
def analyze_signals(ticker: str = Query(..., description="Stock ticker symbol")):
    try:
        # 1. Fetch 2y of historical data
        df = DataService.get_ticker_history(ticker, period="2y")
        
        # 2. Add indicators
        df_indicators = IndicatorService.add_technical_indicators(df)
        latest_indicators = IndicatorService.get_latest_indicators(df_indicators)
        
        # 3. Generate ML forecasts (required by Signal engine)
        forecast_data = ModelService.generate_predictions(df_indicators, horizon=15)
        
        # 4. Generate Signal
        analysis = SignalService.analyze_signals(df_indicators, latest_indicators, forecast_data)
        
        return {
            "ticker": ticker.upper(),
            "latest_price": round(float(df["Close"].iloc[-1]), 2),
            "signal": analysis["signal"],
            "score": analysis["score"],
            "confidence": analysis["confidence"],
            "reasons": analysis["reasons"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error analyzing signals: {str(e)}")
