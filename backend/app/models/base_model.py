from abc import ABC, abstractmethod
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple

class BaseModelPredictor(ABC):
    @abstractmethod
    def fit(self, data: pd.DataFrame) -> None:
        """Trains the model on historical data."""
        pass

    @abstractmethod
    def predict(self, data: pd.DataFrame, forecast_days: int) -> np.ndarray:
        """Generates predictions for the given forecast horizon."""
        pass

    @abstractmethod
    def evaluate(self, actual: np.ndarray, predicted: np.ndarray) -> Dict[str, float]:
        """Calculates evaluation metrics (RMSE, MAE, MAPE)."""
        pass
