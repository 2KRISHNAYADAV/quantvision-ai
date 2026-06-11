import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface AIInsightPanelProps {
  type: 'signal' | 'forecast' | 'portfolio';
  data: any;
  ticker?: string;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ type, data, ticker }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Reset explanation when data/ticker changes to avoid showing stale insights
  useEffect(() => {
    setExplanation('');
  }, [ticker, type]);

  const handleGenerate = async () => {
    if (!data) return;
    setLoading(true);
    try {
      const payload = type === 'signal' 
        ? { ticker, ...data } 
        : type === 'forecast' 
        ? { ticker, ...data }
        : data;

      const res = await api.getAIExplanation(type, payload);
      setExplanation(res.explanation);
    } catch (e) {
      setExplanation('Failed to fetch AI analysis. Check your Gemini API connection or .env key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 border-zinc-800 hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400 fill-indigo-400/10" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300 font-display">
              Gemini Co-Pilot Analysis
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">LLM Synthesis Engine</p>
          </div>
        </div>
        
        {data && !explanation && !loading && (
          <button
            onClick={handleGenerate}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-lg shadow-indigo-600/10 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Synthesize Insights
          </button>
        )}
      </div>

      {loading && (
        <div className="py-8 flex flex-col items-center justify-center text-zinc-500 gap-2">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          <p className="text-xs font-semibold">Gemini is writing report...</p>
        </div>
      )}

      {!loading && !explanation && (
        <div className="py-8 flex flex-col items-center justify-center text-center text-zinc-500 border border-dashed border-zinc-900 rounded-lg bg-zinc-900/10">
          <HelpCircle className="w-8 h-8 text-zinc-700 stroke-[1.5] mb-2" />
          <p className="text-xs">Click 'Synthesize Insights' to trigger natural language models analysis.</p>
        </div>
      )}

      {!loading && explanation && (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap animate-[fadeIn_0.5s_ease-out]">
            {explanation}
          </p>
          
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-lg p-3 text-[10px] text-zinc-500 leading-normal">
            <strong>Disclaimer:</strong> This generated summary utilizes historical mathematical indicators and machine learning statistical models. QuantVision AI does not provide formal investment advice. Financial trading carries material capital loss risks.
          </div>
        </div>
      )}
    </div>
  );
};
export default AIInsightPanel;
