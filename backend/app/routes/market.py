from fastapi import APIRouter, HTTPException, Query
from app.services.data_service import DataService
from app.services.indicator_service import IndicatorService
from typing import Dict, Any, List

router = APIRouter(prefix="/market", tags=["Market Data"])

@router.get("/summary", response_model=Dict[str, Any])
def get_summary(ticker: str = Query(..., description="Stock ticker symbol, e.g., AAPL")):
    try:
        return DataService.get_ticker_summary(ticker)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error retrieving summary: {str(e)}")

@router.get("/history", response_model=Dict[str, Any])
def get_history(
    ticker: str = Query(..., description="Stock ticker symbol"),
    period: str = Query("2y", description="Data period, e.g., 1mo, 3mo, 1y, 2y, 5y")
):
    try:
        # Fetch OHLCV history
        df = DataService.get_ticker_history(ticker, period=period)
        
        # Calculate technical indicators
        df_indicators = IndicatorService.add_technical_indicators(df)
        
        # Get latest individual indicator values
        latest_metrics = IndicatorService.get_latest_indicators(df_indicators)
        
        # Convert dataframe to list of records
        records = df_indicators.to_dict(orient="records")
        
        return {
            "ticker": ticker.upper(),
            "period": period,
            "latest": latest_metrics,
            "history": records
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error retrieving history: {str(e)}")
