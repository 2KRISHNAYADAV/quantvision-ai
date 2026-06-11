import sys
import os

# Ensure backend is in the path
backend_path = os.path.join(os.getcwd(), 'backend')
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app.services.data_service import DataService
from app.services.indicator_service import IndicatorService
from app.services.backtest_service import BacktestService

def test():
    print("Fetching data...")
    df = DataService.get_ticker_history("AAPL", "1y")
    print(f"Data fetched: {len(df)} rows")
    
    print("Adding indicators...")
    df_ind = IndicatorService.add_technical_indicators(df)
    
    print("Running backtest...")
    results = BacktestService.run_backtest(df_ind, strategy="ml_forecast")
    
    print("Backtest Results:")
    print(f"Initial Capital: {results['initialCapital']}")
    print(f"Final Capital: {results['finalCapital']}")
    print(f"Win Rate: {results['winRatePercent']}%")
    print(f"Number of Trades: {results['numberOfTrades']}")

if __name__ == "__main__":
    test()
