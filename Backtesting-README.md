# Algorithmic Backtesting

The Backtesting module allows users to simulate how trading strategies would have performed in the past using historical market data.

## How It Works
The engine uses a vectorized backtest algorithm:
- **Signals Generation:** Based on strategy logic (e.g., RSI crossing thresholds, Moving Average crossovers).
- **Simulation:** It computes daily portfolio returns, keeping track of cash versus stock holdings over the simulation period.

## Built-in Strategies
- **Moving Average Crossover:** Uses short-term and long-term MAs to determine trend directions.
- **RSI (Relative Strength Index):** Mean-reversion strategy buying when RSI < 30 (oversold) and selling when RSI > 70 (overbought).
- **MACD (Moving Average Convergence Divergence):** Momentum strategy analyzing the relationship between two moving averages.

## Performance Metrics Calculated
- **Total Return:** The overall profit or loss percentage.
- **Sharpe Ratio:** Evaluates the risk-adjusted return ($\frac{R_p - R_f}{\sigma_p}$).
- **Max Drawdown:** The maximum peak-to-trough decline in the portfolio equity.
- **Win Rate:** The percentage of closed trades that resulted in positive returns.
