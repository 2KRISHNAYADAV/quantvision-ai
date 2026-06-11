import pandas as pd
import numpy as np
from typing import Dict, Any, List

class BacktestService:
    @staticmethod
    def run_backtest(df: pd.DataFrame, strategy: str, initial_capital: float = 10000.0) -> Dict[str, Any]:
        """
        Simulates trading on historical data using specified strategy rules.
        Calculates Sharpe, Drawdowns, Win Rate, and returns the daily equity curve.
        """
        df = df.copy()
        prices = df["Close"].values
        dates = df["Date"].tolist()
        
        # Initialize signals: 1 = BUY, -1 = SELL, 0 = HOLD/Neutral
        signals = np.zeros(len(df))
        
        if strategy == "ma_crossover":
            # Buy when EMA_12 > EMA_26, Sell when EMA_12 < EMA_26
            signals = np.where(df["EMA_12"] > df["EMA_26"], 1, -1)
            
        elif strategy == "rsi":
            # Buy when RSI < 30, Sell when RSI > 70, hold state in between
            rsi = df["RSI"].values
            current_state = 0 # Out of market
            for i in range(len(df)):
                if rsi[i] < 30:
                    current_state = 1
                elif rsi[i] > 70:
                    current_state = -1
                signals[i] = current_state
                
        elif strategy == "macd":
            # Buy when MACD > Signal Line, Sell when MACD < Signal Line
            signals = np.where(df["MACD"] > df["MACD_Signal"], 1, -1)
            
        else: # ml_forecast strategy
            # Use XGBoost to fit the historical data and generate predictive signals
            try:
                from xgboost import XGBRegressor
                
                ml_df = df.copy()
                lags = [1, 2, 3, 5, 10]
                for lag in lags:
                    ml_df[f"Close_Lag_{lag}"] = ml_df["Close"].shift(lag)
                    ml_df[f"Volume_Lag_{lag}"] = ml_df["Volume"].shift(lag)
                
                ml_df = ml_df.bfill()
                
                feature_cols = [col for col in ml_df.columns if "Lag_" in col or col in ["RSI", "MACD", "Volatility", "SMA_20"]]
                
                X = ml_df[feature_cols].values
                y = ml_df["Close"].values
                
                model = XGBRegressor(n_estimators=50, max_depth=4, learning_rate=0.1, random_state=42, n_jobs=1)
                model.fit(X, y)
                preds = model.predict(X)
                
                # Use the prediction to determine the signal
                # We shift by 1 to prevent look-ahead bias in the signal creation
                shifted_preds = pd.Series(preds).shift(1).bfill().values
                signals = np.where(shifted_preds > df["Close"].values, 1, -1)
            except Exception as e:
                # Fallback
                signals = np.where((df["Close"] > df["SMA_20"]) & (df["MACD_Hist"] > 0), 1, -1)

        # Simulation loop
        cash = initial_capital
        position = 0.0
        portfolio_values = []
        
        trades_count = 0
        winning_trades = 0
        trade_entry_price = 0.0
        
        for i in range(len(df)):
            current_price = prices[i]
            sig = signals[i]
            
            # Transaction logic
            if sig == 1 and position == 0:  # BUY
                position = cash / current_price
                cash = 0.0
                trade_entry_price = current_price
                trades_count += 1
            elif sig == -1 and position > 0:  # SELL
                cash = position * current_price
                position = 0.0
                trades_count += 1
                if current_price > trade_entry_price:
                    winning_trades += 1
            
            # Log today's closing account equity
            equity = cash + (position * current_price)
            portfolio_values.append(equity)
            
        # Calculate performance statistics
        final_capital = portfolio_values[-1]
        total_return = ((final_capital - initial_capital) / initial_capital) * 100
        
        # Annualized CAGR
        years = len(df) / 252.0
        if years > 0 and final_capital > 0:
            cagr = ((final_capital / initial_capital) ** (1.0 / years) - 1.0) * 100
        else:
            cagr = total_return
            
        # Daily Returns and Sharpe
        eq_series = pd.Series(portfolio_values)
        eq_returns = eq_series.pct_change().dropna()
        if not eq_returns.empty and eq_returns.std() > 0:
            sharpe = (eq_returns.mean() / eq_returns.std()) * np.sqrt(252)
        else:
            sharpe = 0.0
            
        # Drawdowns
        peaks = eq_series.cummax()
        drawdowns = (eq_series - peaks) / peaks
        max_drawdown = float(drawdowns.min() * 100)
        
        # Win Rate
        win_rate = (winning_trades / trades_count * 100) if trades_count > 0 else 0.0
        
        # Format equity curve for charts
        equity_curve = [
            {"date": d, "value": round(val, 2)}
            for d, val in zip(dates, portfolio_values)
        ]
        
        return {
            "initialCapital": initial_capital,
            "finalCapital": round(final_capital, 2),
            "totalReturnPercent": round(total_return, 2),
            "annualizedReturnPercent": round(cagr, 2),
            "maxDrawdownPercent": round(abs(max_drawdown), 2),
            "sharpeRatio": round(sharpe, 2),
            "winRatePercent": round(win_rate, 2),
            "numberOfTrades": trades_count,
            "equityCurve": equity_curve
        }
