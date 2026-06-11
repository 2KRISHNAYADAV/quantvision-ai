from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.data_service import DataService
from app.services.indicator_service import IndicatorService
from app.services.backtest_service import BacktestService
from app.utils.cache import cache
from typing import Dict, Any

router = APIRouter(prefix="/backtest", tags=["Backtesting Module"])

class BacktestRequest(BaseModel):
    ticker: str = Field(..., example="AAPL")
    strategy: str = Field("rsi", description="Strategies: ma_crossover, rsi, macd, ml_forecast", example="rsi")
    initial_capital: float = Field(10000.0, ge=100.0, example=10000.0)

@router.post("/run", response_model=Dict[str, Any])
def run_backtest(request: BacktestRequest):
    try:
        cache_key = f"backtest_{request.ticker.upper()}_{request.strategy}_{request.initial_capital}"
        cached_results = cache.get(cache_key)
        if cached_results:
            return cached_results

        # Fetch 2y of historical data for backtesting
        df = DataService.get_ticker_history(request.ticker, period="2y")
        
        # Calculate technical indicators
        df_indicators = IndicatorService.add_technical_indicators(df)
        
        # Run Backtest
        results = BacktestService.run_backtest(
            df_indicators,
            strategy=request.strategy,
            initial_capital=request.initial_capital
        )
        
        results["ticker"] = request.ticker.upper()
        results["strategy"] = request.strategy
        
        # Cache for 1 day
        cache.set(cache_key, results, expire_seconds=86400)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error executing backtest: {str(e)}")
