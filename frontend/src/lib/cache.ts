export const setLocalCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to set local cache', e);
  }
};

export const getLocalCache = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn('Failed to get local cache', e);
    return null;
  }
};

export const generateMockHistory = (ticker: string) => {
  // Generate dummy data if no cache exists for offline mode
  const history = [];
  let currentPrice = 150.0;
  const now = new Date();
  
  for (let i = 250; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    currentPrice = currentPrice * (1 + (Math.random() - 0.48) * 0.05); // Random walk with slight upward drift
    
    history.push({
      Date: date.toISOString().split('T')[0],
      Open: currentPrice * 0.99,
      High: currentPrice * 1.02,
      Low: currentPrice * 0.98,
      Close: currentPrice,
      Volume: Math.floor(Math.random() * 1000000) + 500000,
    });
  }
  
  return {
    ticker,
    period: 'mock',
    latest: { rsi: 55, macd: 0.5, trend: "Neutral", sma_20: currentPrice * 0.98 },
    history
  };
};

export const generateMockForecast = (ticker: string, model: string, days: number) => {
  const predictions = [];
  let currentPrice = 150.0;
  const now = new Date();
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    currentPrice = currentPrice * (1 + (Math.random() - 0.45) * 0.02);
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: currentPrice
    });
  }
  
  return {
    ticker,
    model,
    mode: 'offline',
    forecast_days: days,
    predictions,
    metrics: { mape: 0.05, rmse: 2.5, mae: 1.5, confidence: 0.8 },
    status: 'success (mock)'
  };
};
