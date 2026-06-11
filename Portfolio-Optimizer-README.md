# Portfolio Optimizer

The Portfolio Optimizer provides an interface for performing multi-asset portfolio balancing using Modern Portfolio Theory (MPT), specifically Mean-Variance Optimization.

## Features
- **Asset Allocation:** Users can input a list of tickers to construct a hypothetical portfolio.
- **Covariance & Correlation:** The backend computes historical annualized returns and the covariance matrix to find how assets move relative to each other.
- **Optimization Algorithms:** Uses `scipy.optimize` to find:
  - **Maximum Sharpe Ratio Portfolio:** The allocation that yields the best risk-adjusted return.
  - **Minimum Variance Portfolio:** The allocation with the lowest possible risk (volatility).
- **Visualizations:**
  - Correlation Heatmap: Shows asset correlations.
  - Risk-Return Scatter Plot: Projects the efficient frontier and potential portfolio weights visually.
