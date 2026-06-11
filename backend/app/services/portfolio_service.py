import numpy as np
import pandas as pd
from typing import Dict, Any, List
from scipy.optimize import minimize
from app.services.data_service import DataService

class PortfolioService:
    @staticmethod
    def optimize_portfolio(tickers: List[str], period: str = "1y") -> Dict[str, Any]:
        """
        Retrieves historical data for tickers, calculates the covariance matrix,
        runs SLSQP to find the maximum Sharpe ratio weights, and returns frontier points.
        """
        # Validate tickers
        tickers = [t.upper().strip() for t in tickers if t.strip()]
        if len(tickers) < 2:
            raise ValueError("At least 2 valid tickers are required for portfolio optimization.")
            
        # Download historical data for each ticker and merge Close prices
        merged_df = pd.DataFrame()
        
        for symbol in tickers:
            try:
                hist = DataService.get_ticker_history(symbol, period=period)
                if merged_df.empty:
                    merged_df = hist[['Date', 'Close']].rename(columns={'Close': symbol})
                else:
                    temp = hist[['Date', 'Close']].rename(columns={'Close': symbol})
                    merged_df = pd.merge(merged_df, temp, on='Date', how='inner')
            except Exception as e:
                # If one ticker fails, raise an exception
                raise ValueError(f"Failed to fetch or merge data for symbol {symbol}: {str(e)}")

        if merged_df.empty or len(merged_df) < 10:
            raise ValueError("Insufficient overlapping historical data for the selected tickers.")

        # Calculate daily returns
        price_cols = [c for c in merged_df.columns if c != 'Date']
        returns_df = merged_df[price_cols].pct_change().dropna()

        # Annualized expected returns and covariance matrix
        mean_daily_returns = returns_df.mean()
        exp_returns = mean_daily_returns.values * 252
        cov_matrix = returns_df.cov().values * 252
        
        num_assets = len(price_cols)
        
        # 1. SLSQP Optimizer to Maximize Sharpe Ratio
        # Objective: minimize -Sharpe Ratio
        rf_rate = 0.02 # risk-free rate of 2%
        
        def portfolio_stats(weights):
            p_return = np.sum(exp_returns * weights)
            p_variance = np.dot(weights.T, np.dot(cov_matrix, weights))
            p_volatility = np.sqrt(p_variance)
            p_sharpe = (p_return - rf_rate) / max(0.0001, p_volatility)
            return p_return, p_volatility, p_sharpe

        def negative_sharpe(weights):
            return -portfolio_stats(weights)[2]

        # Constraints: sum(w) = 1
        constraints = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0})
        # Bounds: w between 0 and 1 (no short selling)
        bounds = tuple((0.0, 1.0) for _ in range(num_assets))
        # Initial guess: equal weights
        init_weights = np.ones(num_assets) / num_assets
        
        opt_res = minimize(
            negative_sharpe,
            init_weights,
            method='SLSQP',
            bounds=bounds,
            constraints=constraints
        )
        
        if not opt_res.success:
            opt_weights = init_weights
        else:
            opt_weights = opt_res.x

        opt_return, opt_vol, opt_sharpe = portfolio_stats(opt_weights)

        # 2. Correlation Matrix
        corr_matrix_df = returns_df.corr()
        corr_matrix = []
        for i, t_i in enumerate(price_cols):
            row = []
            for j, t_j in enumerate(price_cols):
                row.append(round(float(corr_matrix_df.iloc[i, j]), 4))
            corr_matrix.append(row)

        # 3. Generating Monte Carlo Portfolio Trials (Scatter Plot)
        num_trials = 300
        scatter_points = []
        
        # Add individual assets as points
        for i, t in enumerate(price_cols):
            asset_weights = np.zeros(num_assets)
            asset_weights[i] = 1.0
            a_ret, a_vol, _ = portfolio_stats(asset_weights)
            scatter_points.append({
                "name": t,
                "return": round(float(a_ret) * 100, 2),
                "volatility": round(float(a_vol) * 100, 2),
                "weight": [100.0 if k == i else 0.0 for k in range(num_assets)]
            })

        # Add random combinations
        np.random.seed(42)
        for _ in range(num_trials):
            w = np.random.random(num_assets)
            w /= np.sum(w)
            trial_ret, trial_vol, _ = portfolio_stats(w)
            scatter_points.append({
                "name": "Trial",
                "return": round(float(trial_ret) * 100, 2),
                "volatility": round(float(trial_vol) * 100, 2),
                "weight": [round(float(val) * 100, 1) for val in w]
            })

        # 4. Diversification Score (Diversification Ratio scaled 0-100)
        # Ratio of weighted sum of individual volatilities to portfolio volatility
        indiv_vols = np.sqrt(np.diag(cov_matrix))
        weighted_indiv_vol = np.sum(opt_weights * indiv_vols)
        diversification_ratio = weighted_indiv_vol / max(0.0001, opt_vol)
        # Scale: 1.0 ratio = 0 score, >= 2.0 ratio = 100 score
        div_score = int(min(100, max(0, (diversification_ratio - 1.0) * 100)))

        return {
            "tickers": price_cols,
            "optimalWeights": {t: round(float(opt_weights[i]) * 100, 2) for i, t in enumerate(price_cols)},
            "expectedReturnPercent": round(float(opt_return) * 100, 2),
            "portfolioVolatilityPercent": round(float(opt_vol) * 100, 2),
            "sharpeRatio": round(float(opt_sharpe), 2),
            "diversificationScore": div_score,
            "correlationMatrix": {
                "tickers": price_cols,
                "matrix": corr_matrix
            },
            "scatterPoints": scatter_points
        }
