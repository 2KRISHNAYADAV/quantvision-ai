from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.forecast_service import ForecastService
from app.utils.cache import cache
from typing import Dict, Any

router = APIRouter(prefix="/forecast", tags=["Forecasting Models"])

class ForecastRequest(BaseModel):
    ticker: str = Field(..., example="AAPL")
    model: str = Field(..., example="lstm")
    period: str = Field("5y", example="5y")
    forecast_days: int = Field(30, ge=1, le=90, example=30)
    mode: str = Field("fast", example="fast")

@router.post("/predict", response_model=Dict[str, Any])
def predict_stock(request: ForecastRequest):
    try:
        cache_key = f"forecast_{request.ticker.upper()}_{request.model.lower()}_{request.period}_{request.forecast_days}_{request.mode}"
        
        if request.mode == "fast":
            cached_predictions = cache.get(cache_key)
            if cached_predictions:
                return cached_predictions

        # Generate Forecast
        predictions = ForecastService.generate_forecast(
            ticker=request.ticker,
            model_name=request.model,
            period=request.period,
            forecast_days=request.forecast_days,
            mode=request.mode
        )
        
        # Cache for 1 day if fast mode
        if request.mode == "fast":
            cache.set(cache_key, predictions, expire_seconds=86400)
            
        return predictions
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error executing predictions: {str(e)}")
