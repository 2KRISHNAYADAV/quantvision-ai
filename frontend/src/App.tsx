import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/dashboard/Header';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Backtest = React.lazy(() => import('./pages/Backtest').then(m => ({ default: m.Backtest })));
const Portfolio = React.lazy(() => import('./pages/Portfolio').then(m => ({ default: m.Portfolio })));
const ModelLab = React.lazy(() => import('./pages/ModelLab').then(m => ({ default: m.ModelLab })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [ticker, setTicker] = useState<string>('AAPL');
  const [globalLoading] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-brand-600 selection:text-white">
      {/* Navigation and search header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ticker={ticker}
        onTickerChange={setTicker}
        loading={globalLoading}
      />

      {/* Main dashboard body viewport */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto animate-[fadeIn_0.3s_ease-out]">
        <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>}>
          {activeTab === 'dashboard' && <Dashboard ticker={ticker} />}
          {activeTab === 'modellab' && <ModelLab ticker={ticker} />}
          {activeTab === 'backtest' && <Backtest ticker={ticker} />}
          {activeTab === 'portfolio' && <Portfolio />}
        </React.Suspense>
      </main>

      {/* Footer credits & educational disclaimer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-6 text-center text-[10px] text-zinc-600 mt-12">
        <p className="font-semibold mb-1 uppercase tracking-wider font-display text-zinc-500">QuantVision AI &copy; 2026</p>
        <p className="max-w-xl mx-auto leading-relaxed">
          This system is an academic research demonstration. Trading models do not guarantee profits.
          Consult a licensed financial professional prior to making capital allocation decisions.
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
