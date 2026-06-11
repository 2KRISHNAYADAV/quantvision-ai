import google.generativeai as genai
from app.utils.config import settings
import json

class GeminiService:
    _configured = False

    @classmethod
    def _ensure_configured(cls):
        """
        Ensures the Google GenAI SDK is configured with the user's API Key.
        """
        if not cls._configured:
            if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
                genai.configure(api_key=settings.GEMINI_API_KEY)
                cls._configured = True
            else:
                raise ValueError("GEMINI_API_KEY is not set. Please set it in your .env file.")

    @classmethod
    def generate_explanation(cls, context_type: str, data: dict) -> str:
        """
        Sends structured data to Gemini to generate natural-language financial explanations.
        """
        try:
            cls._ensure_configured()
        except ValueError as e:
            return (
                f"AI Explanation unavailable: {str(e)}. "
                "Please configure a valid Gemini API key in the dashboard or .env file."
            )

        # Utilize gemini-1.5-flash for rapid, cost-effective responses
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
        except Exception as e:
            return f"Failed to load Gemini model instance: {str(e)}"

        if context_type == "signal":
            ticker = data.get("ticker", "Unknown")
            signal = data.get("signal", "HOLD")
            score = data.get("score", 0)
            confidence = data.get("confidence", 50)
            reasons = "\n".join([f"- {r}" for r in data.get("reasons", [])])
            
            prompt = f"""
You are a quantitative risk analyst at QuantVision AI.
Analyze the following trading recommendation:
- Asset: {ticker}
- Signal Recommendation: {signal}
- Score: {score} / 12 (Scale from -12 Strong Bearish to +12 Strong Bullish)
- Engine Confidence: {confidence}%
- Supporting Technical Indicators:
{reasons}

Provide a concise, professional explanation (1 paragraph) of why this recommendation was issued.
Conclude with a clear, standard disclaimer: 'Educational purposes only, not financial advice.'
Do not guarantee any outcomes or claim 100% accuracy.
"""

        elif context_type == "forecast":
            ticker = data.get("ticker", "Unknown")
            metrics = data.get("metrics", {})
            prices = data.get("prices", [])
            latest_price = data.get("latest_price", 0.0)
            
            pred_end = prices[-1] if prices else latest_price
            change_pct = ((pred_end - latest_price) / latest_price * 100) if latest_price else 0.0
            
            prompt = f"""
You are an AI research scientist at QuantVision AI.
Summarize the machine learning forecasting results:
- Asset: {ticker}
- Last Close Price: ${latest_price:.2f}
- 15-Day Model Ensemble Forecast: ${pred_end:.2f} ({"+" if change_pct >= 0 else ""}{change_pct:.2f}%)
- Model Error Stats:
  - MAPE (Mean Absolute Percentage Error): {metrics.get('mape', 0.05)*100:.2f}%
  - RMSE (Root Mean Squared Error): ${metrics.get('rmse', 1.0):.2f}
  - Model Confidence: {metrics.get('confidence', 0.5)*100:.1f}%

Write a short paragraph summarizing what these metrics mean. Specifically, explain how the model confidence and error rates indicate prediction risk, and remind the user that ML forecasts show historical pattern extrapolations rather than future certainty.
Conclude with: 'Educational purposes only, not financial advice.'
"""

        elif context_type == "portfolio":
            tickers = ", ".join(data.get("tickers", []))
            weights = json.dumps(data.get("weights", {}))
            expected_ret = data.get("expected_return", 0.0)
            vol = data.get("volatility", 0.0)
            sharpe = data.get("sharpe", 0.0)
            div_score = data.get("diversification_score", 0)
            
            prompt = f"""
You are a portfolio optimization expert at QuantVision AI.
Deconstruct this optimized asset allocation portfolio:
- Asset Tickers: [{tickers}]
- Recommended Weights: {weights}
- Portfolio Expected Annualized Return: {expected_ret:.2f}%
- Portfolio Expected Annual Volatility: {vol:.2f}%
- Maximized Sharpe Ratio: {sharpe:.2f}
- Diversification Score: {div_score} / 100

Write a paragraph evaluating this portfolio. Explain the trade-off between the expected return and volatility, what a Sharpe Ratio of {sharpe:.2f} represents in terms of risk-adjusted efficiency, and the meaning of the diversification score. Keep it professional.
Conclude with: 'Educational purposes only, not financial advice.'
"""
        else:
            prompt = f"Provide a brief market summary analysis based on the following input: {json.dumps(data)}"

        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error calling Google Gemini API: {str(e)}"
