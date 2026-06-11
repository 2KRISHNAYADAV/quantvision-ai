import pandas as pd
import numpy as np
from typing import Dict, Any

class IndicatorService:
    @staticmethod
    def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
        """
        Appends technical analysis metrics to the OHLCV dataframe.
        """
        df = df.copy()
        
        # 1. Daily returns & Volatility
        df['Daily_Return'] = df['Close'].pct_change()
        df['Volatility'] = df['Daily_Return'].rolling(window=20).std() * np.sqrt(252) # Annualized
        
        # 2. Moving Averages
        df['SMA_20'] = df['Close'].rolling(window=20).mean()
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        df['EMA_12'] = df['Close'].ewm(span=12, adjust=False).mean()
        df['EMA_26'] = df['Close'].ewm(span=26, adjust=False).mean()
        df['EMA_50'] = df['Close'].ewm(span=50, adjust=False).mean()
        
        # 3. RSI (Relative Strength Index) - Wilder's smoothing method
        delta = df['Close'].diff()
        gain = delta.where(delta > 0, 0.0)
        loss = -delta.where(delta < 0, 0.0)
        
        avg_gain = gain.ewm(alpha=1/14, adjust=False).mean()
        avg_loss = loss.ewm(alpha=1/14, adjust=False).mean()
        
        # Prevent division by zero
        rs = avg_gain / np.where(avg_loss == 0, 0.00001, avg_loss)
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # 4. MACD (Moving Average Convergence Divergence)
        df['MACD'] = df['EMA_12'] - df['EMA_26']
        df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
        df['MACD_Hist'] = df['MACD'] - df['MACD_Signal']
        
        # 5. Bollinger Bands (20-day, 2 Standard Deviations)
        df['BB_Middle'] = df['Close'].rolling(window=20).mean()
        std = df['Close'].rolling(window=20).std()
        df['BB_Upper'] = df['BB_Middle'] + (2 * std)
        df['BB_Lower'] = df['BB_Middle'] - (2 * std)
        
        # 6. Support & Resistance Approximations (20-day rolling min/max)
        df['Support'] = df['Low'].rolling(window=20).min()
        df['Resistance'] = df['High'].rolling(window=20).max()
        
        # 7. Rolling Stats
        df['Rolling_Mean_20'] = df['Close'].rolling(window=20).mean()
        df['Rolling_Std_20'] = df['Close'].rolling(window=20).std()
        
        # Fill NaN values with backfill then forwardfill to prevent errors in models
        df = df.bfill().ffill()
        return df

    @staticmethod
    def get_latest_indicators(df: pd.DataFrame) -> Dict[str, Any]:
        """
        Extract the latest computed indicators as single metrics.
        """
        if df.empty:
            return {}
            
        latest = df.iloc[-1]
        
        # Determine trend direction
        trend = "Neutral"
        if latest['Close'] > latest['EMA_50'] and latest['EMA_12'] > latest['EMA_26']:
            trend = "Bullish"
        elif latest['Close'] < latest['EMA_50'] and latest['EMA_12'] < latest['EMA_26']:
            trend = "Bearish"
            
        return {
            "rsi": round(float(latest['RSI']), 2),
            "macd": round(float(latest['MACD']), 4),
            "macd_signal": round(float(latest['MACD_Signal']), 4),
            "macd_hist": round(float(latest['MACD_Hist']), 4),
            "volatility": round(float(latest['Volatility']) * 100, 2) if not np.isnan(latest['Volatility']) else 0.0, # percentage
            "bb_upper": round(float(latest['BB_Upper']), 2),
            "bb_middle": round(float(latest['BB_Middle']), 2),
            "bb_lower": round(float(latest['BB_Lower']), 2),
            "support": round(float(latest['Support']), 2),
            "resistance": round(float(latest['Resistance']), 2),
            "sma_20": round(float(latest['SMA_20']), 2),
            "sma_50": round(float(latest['SMA_50']), 2),
            "trend": trend
        }
