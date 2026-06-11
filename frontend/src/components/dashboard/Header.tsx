import React, { useState } from 'react';
import { Search, TrendingUp, Sliders, Briefcase, Zap, TestTube2, Menu, X, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../../lib/useNetworkStatus';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ticker: string;
  onTickerChange: (ticker: string) => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  ticker,
  onTickerChange,
  loading,
}) => {
  const [searchInput, setSearchInput] = useState(ticker);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOnline = useNetworkStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onTickerChange(searchInput.toUpperCase().trim());
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'modellab', label: 'Model Lab', icon: TestTube2 },
    { id: 'backtest', label: 'Backtesting', icon: Sliders },
    { id: 'portfolio', label: 'Portfolio Optimizer', icon: Briefcase },
  ];

  return (
    <header className="glass-panel border-b border-zinc-900 sticky top-0 z-50 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-brand-600 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/10 shrink-0">
            <Zap className="w-5.5 h-5.5 text-white fill-white/10" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
              QuantVision <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono font-bold">AI</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium">Algorithmic Forecasting & Trading</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:hidden">
          {!isOnline && (
            <div title="Offline Mode - Showing Cached Data" className="flex items-center justify-center p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <WifiOff className="w-4 h-4" />
            </div>
          )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-900 shrink-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-zinc-900 text-indigo-400 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Desktop Search & Status */}
      <div className="hidden md:flex items-center gap-3 w-full md:w-auto">
        {!isOnline && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-semibold border border-rose-500/20 shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
            Offline Mode
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative w-full md:w-64">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${loading ? 'text-indigo-400 animate-spin' : 'text-zinc-500'}`} />
          <input
            type="text"
            placeholder="Search Ticker (e.g. MSFT)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
            className="w-full bg-zinc-950/70 border border-zinc-900 focus:border-indigo-500/50 outline-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-zinc-200 tracking-wider placeholder-zinc-600 transition-all duration-200"
            disabled={loading}
          />
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="flex flex-col gap-4 w-full md:hidden bg-zinc-950/90 p-4 rounded-xl border border-zinc-900 mt-2">
          <form onSubmit={handleSubmit} className="relative w-full">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${loading ? 'text-indigo-400 animate-spin' : 'text-zinc-500'}`} />
            <input
              type="text"
              placeholder="Search Ticker..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-indigo-500/50 outline-none rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-zinc-200 tracking-wider placeholder-zinc-500"
              disabled={loading}
            />
          </form>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }}
                className={`flex items-center gap-3 text-sm font-semibold px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-zinc-900 text-indigo-400 shadow'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
