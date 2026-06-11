import pandas as pd
from typing import Dict, Any, List

class SignalService:
    @staticmethod
    def analyze_signals(df: pd.DataFrame, latest_indicators: Dict[str, Any], forecast_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Consolidates technical indicators and machine learning forecasts to produce a BUY, SELL, or HOLD signal.
        """
        reasons = []
        score = 0
        
        current_price = float(df["Close"].iloc[-1])
        
        # 1. RSI Indicator Assessment
        rsi = latest_indicators.get("rsi", 50.0)
        if rsi < 30:
            score += 3
            reasons.append(f"RSI is oversold at {rsi:.1f}, indicating a potential bullish rebound.")
        elif rsi < 40:
            score += 1
            reasons.append(f"RSI is in the low-neutral zone at {rsi:.1f}, suggesting mild bullish momentum.")
        elif rsi > 70:
            score -= 3
            reasons.append(f"RSI is overbought at {rsi:.1f}, suggesting the stock is overextended.")
        elif rsi > 60:
            score -= 1
            reasons.append(f"RSI is in the high-neutral zone at {rsi:.1f}, indicating potential cooling off.")
        
        # 2. MACD Crossover Assessment
        macd_hist = latest_indicators.get("macd_hist", 0.0)
        if macd_hist > 0:
            score += 2
            reasons.append("MACD is above its signal line (bullish momentum).")
        else:
            score -= 2
            reasons.append("MACD is below its signal line (bearish momentum).")
            
        # 3. Bollinger Bands Boundaries
        bb_upper = latest_indicators.get("bb_upper", current_price)
        bb_lower = latest_indicators.get("bb_lower", current_price)
        if current_price <= bb_lower * 1.01:
            score += 2
            reasons.append(f"Price is trading near or below the lower Bollinger Band (${bb_lower:.2f}), suggesting support.")
        elif current_price >= bb_upper * 0.99:
            score -= 2
            reasons.append(f"Price is trading near or above the upper Bollinger Band (${bb_upper:.2f}), suggesting short-term resistance.")
            
        # 4. Long-Term Trend Assessment
        trend = latest_indicators.get("trend", "Neutral")
        if trend == "Bullish":
            score += 2
            reasons.append("Price is supported by a bullish moving average alignment (Close > EMA_50).")
        elif trend == "Bearish":
            score -= 2
            reasons.append("Price action is bearish with the price trading below the 50-day EMA.")
            
        # 5. Machine Learning Forecast Momentum (Ensemble 5-day project)
        ensemble_prices = forecast_data.get("forecasts", {}).get("ensemble", {}).get("prices", [])
        if len(ensemble_prices) >= 5:
            five_day_pred = ensemble_prices[4] # 5th day projection
            pred_return = ((five_day_pred - current_price) / current_price) * 100
            
            if pred_return > 2.0:
                score += 3
                reasons.append(f"ML Ensemble model forecasts a strong +{pred_return:.2f}% price appreciation over the next 5 days.")
            elif pred_return > 0:
                score += 1
                reasons.append(f"ML Ensemble model forecasts a modest +{pred_return:.2f}% price increase over the next 5 days.")
            elif pred_return < -2.0:
                score -= 3
                reasons.append(f"ML Ensemble model forecasts a significant -{abs(pred_return):.2f}% price correction over the next 5 days.")
            else:
                score -= 1
                reasons.append(f"ML Ensemble model forecasts a minor -{abs(pred_return):.2f}% decline over the next 5 days.")

        # Determine Final Signal Recommendation
        if score >= 4:
            recommendation = "BUY"
        elif score <= -4:
            recommendation = "SELL"
        else:
            recommendation = "HOLD"

        # Calculate a normalized confidence score (from 0 to 100)
        confidence_percent = int(min(100, max(0, (abs(score) / 12.0) * 100)))

        return {
            "signal": recommendation,
            "score": score,
            "confidence": confidence_percent,
            "reasons": reasons
        }
