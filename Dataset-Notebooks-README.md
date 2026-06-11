# Datasets and Research Notebooks

The `QuantVision AI` repository (originally based on `Stock-Prediction-Models`) includes extensive research materials, historical datasets, and experimental Jupyter notebooks. These folders serve as the data science foundation for the machine learning models implemented in the production FastAPI backend.

## 1. `dataset` Folder
This directory contains historical financial data files in CSV format used for training and testing the forecasting models.
- **Contents:** CSV files for various stock tickers (e.g., `GOOG.csv`, `TSLA.csv`, `AMD.csv`, `BTC-sentiment.csv`) and currency pairs (e.g., `usd-myr.csv`).
- **Data Structure:** Most files contain daily OHLCV (Open, High, Low, Close, Volume) data.
- **Tech & Coding Skills Required:**
  - **Pandas & NumPy:** Used extensively to load, clean, and manipulate these datasets.
  - **Data Engineering:** Interpolating missing values, calculating rolling averages, and creating technical indicators (RSI, MACD, EMA).
  - **Data Preprocessing:** Scaling data (e.g., `MinMaxScaler`, `StandardScaler`) so gradient-based ML algorithms converge faster.

## 2. Research & Modeling Folders (Jupyter Notebooks)

The project includes several sub-directories containing `.ipynb` Jupyter notebooks. These folders demonstrate the evolution from experimental scripts to advanced deep learning and reinforcement learning agents.

### `deep-learning`
Contains advanced neural network architectures designed specifically to forecast sequence data (time-series).
- **Tech Stack:** PyTorch, TensorFlow/Keras, NumPy.
- **Coding Skills Demonstrated:**
  - **Recurrent Neural Networks (RNNs):** Implementing `LSTM` (Long Short-Term Memory) and `GRU` (Gated Recurrent Unit) layers to capture temporal dependencies in stock prices.
  - **Seq2Seq Models:** Building Encoder-Decoder architectures.
  - **Attention Mechanisms:** Implementing "Attention is all you need" concepts to allow models to weigh the importance of specific historical days over others.
  - **Advanced Architectures:** Variational Autoencoders (VAE), Dilated CNNs, and Bidirectional RNNs.
  - **Array Windowing:** Slicing multi-dimensional arrays into rolling sequences (e.g., using the past 60 days of data to predict the next `N` days).

### `agent`, `free-agent`, and `realtime-agent`
These folders contain notebooks that simulate Reinforcement Learning (RL) agents. These algorithmic bots learn to make buy/sell decisions to maximize cumulative profit.
- **Tech Stack:** Python, mathematical modeling, Q-Learning.
- **Coding Skills Demonstrated:**
  - **Reinforcement Learning:** Designing reward functions based on portfolio equity growth and drawdowns.
  - **Environment Simulation:** Building custom step-by-step environments where an agent takes actions (Buy, Sell, Hold) based on state observations (current price, technical indicators, account balance).

### `simulation` & `stacking`
Focuses on backtesting logic, predictive uncertainty, and ensemble modeling.
- **`simulation`:** Features Monte Carlo simulations and historical backtesting to validate strategy robustness and determine confidence intervals.
- **`stacking`:** Focuses on ensemble methods, combining multiple disparate models (e.g., statistical ARIMA + XGBoost + deep learning LSTM) using meta-learners to yield a more accurate overall forecast.
- **Coding Skills Demonstrated:**
  - Statistical modeling (ARIMA/SARIMA) using `statsmodels`.
  - Tree-based Gradient Boosting implementation using `XGBoost` and `scikit-learn`.
  - Machine learning pipelines, hyperparameter tuning, and cross-validation techniques.

---
> **Note:** While these Jupyter notebooks represent the experimental "lab" phase of quantitative research, the most robust and stable models from these notebooks have been refactored into production-ready object-oriented Python classes. You can find the productionized equivalents running in the `backend/app/models/` directory.
