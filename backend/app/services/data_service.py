import yfinance as yf
import pandas as pd
from typing import Dict, Any, Optional
from app.utils.cache import cache

class DataService:
    @staticmethod
    def get_ticker_history(symbol: str, period: str = "2y") -> pd.DataFrame:
        """
        Fetch historical price data for a given ticker and period.
        Caches results to reduce API calls.
        """
        symbol = symbol.upper().strip()
        cache_key = f"history_{symbol}_{period}"
        cached_json = cache.get(cache_key)
        
        if cached_json is not None:
            import io
            df_cached = pd.read_json(io.StringIO(cached_json))
            if 'Date' in df_cached.columns:
                df_cached['Date'] = pd.to_datetime(df_cached['Date']).dt.strftime('%Y-%m-%d')
            return df_cached

        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        
        if df.empty:
            raise ValueError(f"No historical data found for symbol '{symbol}'")
        
        df = df.reset_index()
        # Convert timezone-aware datetimes to string format YYYY-MM-DD
        if 'Date' in df.columns:
            df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%Y-%m-%d')
        elif 'Datetime' in df.columns:
            df['Date'] = pd.to_datetime(df['Datetime']).dt.strftime('%Y-%m-%d')
            df.rename(columns={'Datetime': 'Date'}, inplace=True)
            
        # Ensure standard OHLCV columns exist
        required_cols = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
        for col in required_cols:
            if col not in df.columns:
                raise ValueError(f"Required column '{col}' is missing from market data.")
        
        df = df[required_cols].copy()
        
        # Save to cache
        cache.set(cache_key, df.to_json())
        return df

    @staticmethod
    def get_ticker_summary(symbol: str) -> Dict[str, Any]:
        """
        Fetch company profile, metrics, and price quote.
        """
        symbol = symbol.upper().strip()
        cache_key = f"summary_{symbol}"
        cached_summary = cache.get(cache_key)
        
        if cached_summary is not None:
            return cached_summary

        ticker = yf.Ticker(symbol)
        try:
            info = ticker.info
        except Exception:
            info = {}
            
        # Provide fallbacks if fields are absent
        current_price = info.get("currentPrice") or info.get("regularMarketPrice")
        prev_close = info.get("previousClose")
        
        if not current_price:
            # Let's try downloading the last day history to extract the close price
            try:
                hist = ticker.history(period="5d")
                if not hist.empty:
                    current_price = float(hist['Close'].iloc[-1])
                    prev_close = float(hist['Close'].iloc[-2]) if len(hist) > 1 else current_price
            except Exception:
                pass

        current_price = current_price or 0.0
        prev_close = prev_close or current_price or 1.0

        daily_change = current_price - prev_close
        daily_change_pct = (daily_change / prev_close) * 100 if prev_close else 0.0

        summary = {
            "symbol": symbol,
            "shortName": info.get("shortName", info.get("longName", symbol)),
            "longName": info.get("longName", symbol),
            "currentPrice": round(current_price, 2),
            "previousClose": round(prev_close, 2),
            "dailyChange": round(daily_change, 2),
            "dailyChangePercent": round(daily_change_pct, 2),
            "open": round(info.get("open", current_price), 2) if info.get("open") else None,
            "dayLow": round(info.get("dayLow", current_price), 2) if info.get("dayLow") else None,
            "dayHigh": round(info.get("dayHigh", current_price), 2) if info.get("dayHigh") else None,
            "volume": info.get("volume"),
            "averageVolume": info.get("averageVolume"),
            "marketCap": info.get("marketCap"),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
            "dividendYield": info.get("dividendYield"),
            "trailingPE": info.get("trailingPE"),
            "currency": info.get("currency", "USD"),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "longBusinessSummary": info.get("longBusinessSummary", "No summary available.")
        }

        # Cache summary data for 15 minutes
        cache.set(cache_key, summary, expire_seconds=900)
        return summary
