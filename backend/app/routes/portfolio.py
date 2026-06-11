from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.portfolio_service import PortfolioService
from app.utils.cache import cache
from typing import Dict, Any, List

router = APIRouter(prefix="/portfolio", tags=["Portfolio Intelligence"])

class PortfolioRequest(BaseModel):
    tickers: List[str] = Field(..., example=["AAPL", "MSFT", "GOOG", "AMZN"])
    period: str = Field("1y", description="Period to calculate expected returns and covariance, e.g. 6mo, 1y, 2y", example="1y")

@router.post("/optimize", response_model=Dict[str, Any])
def optimize_assets(request: PortfolioRequest):
    if len(request.tickers) < 2:
        raise HTTPException(status_code=422, detail="At least 2 tickers must be provided.")
        
    try:
        sorted_tickers = "_".join(sorted([t.upper() for t in request.tickers]))
        cache_key = f"portfolio_{sorted_tickers}_{request.period}"
        cached_results = cache.get(cache_key)
        if cached_results:
            return cached_results

        results = PortfolioService.optimize_portfolio(
            tickers=request.tickers,
            period=request.period
        )
        
        # Cache for 1 day
        cache.set(cache_key, results, expire_seconds=86400)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error optimizing portfolio: {str(e)}")
