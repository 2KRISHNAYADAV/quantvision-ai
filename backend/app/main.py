from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

# Monkey-patch pandas to support the deprecated 'method' argument in fillna for compatibility with Pandas 3.x
_orig_df_fillna = pd.DataFrame.fillna
_orig_s_fillna = pd.Series.fillna

def _patched_df_fillna(self, value=None, method=None, axis=None, inplace=False, limit=None, downcast=None, **kwargs):
    if method is not None:
        if method in ['ffill', 'pad']:
            return self.ffill(axis=axis, inplace=inplace, limit=limit)
        elif method in ['bfill', 'backfill']:
            return self.bfill(axis=axis, inplace=inplace, limit=limit)
    return _orig_df_fillna(self, value=value, axis=axis, inplace=inplace, limit=limit, downcast=downcast, **kwargs)

def _patched_s_fillna(self, value=None, method=None, axis=None, inplace=False, limit=None, downcast=None, **kwargs):
    if method is not None:
        if method in ['ffill', 'pad']:
            return self.ffill(axis=axis, inplace=inplace, limit=limit)
        elif method in ['bfill', 'backfill']:
            return self.bfill(axis=axis, inplace=inplace, limit=limit)
    return _orig_s_fillna(self, value=value, axis=axis, inplace=inplace, limit=limit, downcast=downcast, **kwargs)

pd.DataFrame.fillna = _patched_df_fillna
pd.Series.fillna = _patched_s_fillna

from app.routes import market, forecast, signals, backtest, portfolio, ai
from app.utils.config import settings

app = FastAPI(
    title="QuantVision AI API",
    description="Backend Quantitative Finance and AI Narrative API Service.",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS Policy configuration (Allows development servers on typical ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route managers
app.include_router(market.router, prefix="/api/v1")
app.include_router(forecast.router, prefix="/api/v1")
app.include_router(signals.router, prefix="/api/v1")
app.include_router(backtest.router, prefix="/api/v1")
app.include_router(portfolio.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "name": "QuantVision AI API",
        "status": "online",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
