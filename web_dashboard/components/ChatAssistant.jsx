import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatAssistant({ episodes, onSendMessage, isReasoning }) {
  const [query, setQuery] = useState('');
  const chatBottomRef = useRef(null);

  // Auto-scroll chat area to bottom when conversation history grows
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [episodes, isReasoning]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim() || isReasoning) return;
    onSendMessage(query.trim());
    setQuery('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090C14] overflow-hidden">
      {/* Tab Header */}
      <div className="px-6 py-5 border-b border-slate-800/50 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-white">Digital Twin Dialogue</h2>
          <p className="text-xs text-slate-500">Autonomous Reasoning Loop (Thought &rarr; Tool Call &rarr; Observation)</p>
        </div>
        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
            LangGraph Agent Core
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {episodes.map((episode, idx) => (
          <ChatMessage
            key={idx}
            role={episode.role}
            message={episode.message}
            thoughts={episode.thoughts}
            isStreaming={episode.isStreaming}
          />
        ))}

        {/* Loading / Reasoning State */}
        {isReasoning && (
          <div className="flex justify-start max-w-[75%] space-y-2">
            <div className="w-full space-y-2 animate-pulse">
              <div className="flex items-center gap-2 pl-1">
                <span className="material-symbols-outlined text-indigo-400 text-sm">smart_toy</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  SHADOWMIND REASONING...
                </span>
              </div>
              <div className="bg-[#111827] border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-4">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-medium">
                  Recalling semantic models & formulating autonomous plan...
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Row */}
      <div className="p-4 border-t border-slate-800/50 bg-[#0B101D]">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isReasoning}
            placeholder="Message ShadowMind Twin (e.g. 'Generate my study roadmap' or 'Extract facts from specs')"
            className="flex-1 bg-[#111827] border border-slate-800 focus:border-indigo-500 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!query.trim() || isReasoning}
            className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
              query.trim() && !isReasoning
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
