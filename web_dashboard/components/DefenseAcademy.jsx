import React, { useState } from 'react';

export default function DefenseAcademy() {
  const [revealedCard, setRevealedCard] = useState(null);

  const flashcards = [
    {
      q: "What is the difference between SQLite/Room and the PostgreSQL schema?",
      a: "SQLite with Jetpack Room ORM acts as the offline-first on-device secure database, enabling immediate local operations, fast response times, and resilience. PostgreSQL is the centralized, cloud-hosted master node facilitating secure multi-client syncing, JWT synchronization, and heavy vector embeddings indexing.",
    },
    {
      q: "What is the role of the LangGraph state machine?",
      a: "LangGraph defines a robust, deterministic State Graph containing specific cognitive nodes (Memory Retrieval, Task Planning, Tool Selection, execution, and final synthesis) mapping agentic ReAct loops cleanly and preventing runaway loops.",
    },
    {
      q: "Explain how personalized user preferences are stored.",
      a: "Preferences are gathered implicitly from conversation contexts or specified explicitly, then saved with a calculated 'confidence_score' from 0.00 to 1.00 into the learned_preferences database table to dynamically adapt LLM instructions.",
    },
    {
      q: "How does the system ensure robust security?",
      a: "It employs a dual security layer: on-device local database encryption (using SQLCipher) combined with remote PostgreSQL authentication managed by cryptographically secure JWT handshake tokens.",
    }
  ];

  const specs = [
    { label: "B.Tech Graduation Project", value: "ShadowMind AI (Digital Twin)" },
    { label: "Engineering Lead Team", value: "Lumix Forge" },
    { label: "Core Frameworks", value: "Jetpack Compose (Mobile), React & Tailwind (Web), LangGraph (Agent)" },
    { label: "Local Database", value: "Jetpack Room SQLite" },
    { label: "Cloud Databases", value: "PostgreSQL 15+ / Supabase" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090C14] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/50 flex justify-between items-center bg-[#0B101D]">
        <div>
          <h2 className="text-base font-bold text-white">Defense Academy Hub</h2>
          <p className="text-xs text-slate-500">Academic materials, examiner review parameters, and B.Tech viva preparation flashcards</p>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
            Ready for Evaluation
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Specs Overview Panel */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl"></div>
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
            Official B.Tech Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map((spec, index) => (
              <div key={index} className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-3">
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">{spec.label}</p>
                <p className="text-xs text-white font-semibold mt-1">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Flashcards */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Examiner Review QA Flashcards (Click to Flip)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card, idx) => {
              const isRevealed = revealedCard === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setRevealedCard(isRevealed ? null : idx)}
                  className={`border rounded-2xl p-5 min-h-[140px] flex flex-col justify-between cursor-pointer select-none transition-all duration-300 ${
                    isRevealed
                      ? 'bg-indigo-950/20 border-indigo-500/40 text-indigo-200'
                      : 'bg-[#111827]/40 border-slate-800/80 hover:border-slate-700/60 text-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wide">
                      Question {idx + 1}
                    </span>
                    <p className="text-xs font-bold mt-2 leading-relaxed">
                      {card.q}
                    </p>
                  </div>
                  <div className="border-t border-slate-800/50 pt-3 mt-3">
                    {isRevealed ? (
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {card.a}
                      </p>
                    ) : (
                      <p className="text-[10px] text-indigo-400/80 font-bold flex items-center gap-1 justify-end uppercase">
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Reveal Answer
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
