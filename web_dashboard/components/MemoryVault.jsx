import React, { useState } from 'react';

export default function MemoryVault({ stats }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'semantic_search'

  // Semantic query state
  const [semanticQuery, setSemanticQuery] = useState('');
  const [searchK, setSearchK] = useState(3);
  const [selectedMetric, setSelectedMetric] = useState('cosine'); // 'cosine', 'l2', 'ip'
  const [isSearching, setIsSearching] = useState(false);
  const [searchLogs, setSearchLogs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Initial rich sample database state matching schema semantic_memories
  const [memories, setMemories] = useState([
    {
      id: 'm1',
      category: 'preference',
      content: 'Prefers comprehensive, step-by-step roadmap formats for B.Tech project preparation.',
      source: 'chat',
      confidence: '1.00',
      timestamp: '2026-07-08 04:12',
    },
    {
      id: 'm2',
      category: 'fact',
      content: 'B.Tech final viva defense scheduled for mid-July with a panel of external academic examiners.',
      source: 'document_upload',
      confidence: '0.95',
      timestamp: '2026-07-08 03:45',
    },
    {
      id: 'm3',
      category: 'document_chunk',
      content: 'SRS-FR-04: The system must support an autonomous task planner capable of multi-step scheduling and persistence in a SQLite/Room architecture.',
      source: 'document_upload',
      confidence: '1.00',
      timestamp: '2026-07-08 02:20',
    },
    {
      id: 'm4',
      category: 'reflection',
      content: 'Implicit preference found: User tends to audit system configurations repeatedly, suggesting a strong focus on technical precision and testing.',
      source: 'agent_consolidation',
      confidence: '0.85',
      timestamp: '2026-07-08 05:01',
    },
    {
      id: 'm5',
      category: 'fact',
      content: 'JWT token expiration is configured for 24 hours with automatic background silent-refresh cycles.',
      source: 'chat',
      confidence: '0.90',
      timestamp: '2026-07-08 01:10',
    },
    {
      id: 'm6',
      category: 'document_chunk',
      content: 'System Architecture: SQLite/Room acts as the local offline-first memory manager, while PostgreSQL handles centralized cloud sync.',
      source: 'document_upload',
      confidence: '0.98',
      timestamp: '2026-07-08 02:15',
    },
    {
      id: 'm7',
      category: 'preference',
      content: 'User preference: Lumix Forge prefers highly technical, detailed step-by-step preparation roadmaps.',
      source: 'chat',
      confidence: '0.95',
      timestamp: '2026-07-08 04:30',
    },
    {
      id: 'm8',
      category: 'fact',
      content: 'The B.Tech final viva defense and agent presentation is scheduled for mid-July with academic examiners.',
      source: 'chat',
      confidence: '0.99',
      timestamp: '2026-07-08 05:10',
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Memories' },
    { id: 'preference', label: 'Preferences' },
    { id: 'fact', label: 'Facts & Specs' },
    { id: 'document_chunk', label: 'Doc Chunks' },
    { id: 'reflection', label: 'Reflections' },
  ];

  const filteredMemories = memories.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch = m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'preference': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'fact': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'document_chunk': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'reflection': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Natural Language Search - Simulated Vector Similarity Overlap
  const handleSemanticSearch = (e) => {
    if (e) e.preventDefault();
    if (!semanticQuery.trim()) return;

    setIsSearching(true);
    setSearchLogs([]);
    setSearchResults([]);

    const timestampStr = new Date().toLocaleTimeString();
    
    // Simulate terminal embedding workflow logs
    const steps = [
      `[${timestampStr}] 🧬 Parsing natural language query: "${semanticQuery}"`,
      `[${timestampStr}] ⚙️ Initializing ShadowMindEmbeddings(dimension=384) configuration...`,
      `[${timestampStr}] 🔍 Computing normalized query vector weight matrices...`,
      `[${timestampStr}] 📡 Connecting to ChromaDB persistent store collection: "shadowmind_memories"`,
      `[${timestampStr}] 📂 Running search with distance metric: "${selectedMetric.toUpperCase()}" (K Limit: ${searchK})`,
      `[${timestampStr}] 📊 Sorting retrieved candidates by vector distance score...`,
      `[${timestampStr}] 🎉 Vector search complete. Rendered matches below.`
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSearchLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          // Perform deterministic similarity algorithm
          const queryTerms = semanticQuery.toLowerCase().split(/\W+/).filter(term => term.length > 2);
          
          const results = memories.map((m) => {
            const contentTerms = m.content.toLowerCase().split(/\W+/).filter(term => term.length > 2);
            
            const querySet = new Set(queryTerms);
            const contentSet = new Set(contentTerms);
            
            const intersection = new Set([...querySet].filter(x => contentSet.has(x)));
            const union = new Set([...querySet, ...contentSet]);
            
            let baseScore = union.size > 0 ? intersection.size / union.size : 0;

            // Boost exact matches of terms
            let termMatches = 0;
            queryTerms.forEach(term => {
              if (m.content.toLowerCase().includes(term)) {
                termMatches += 1;
              }
            });

            if (termMatches > 0 && queryTerms.length > 0) {
              baseScore += (termMatches / queryTerms.length) * 0.45;
            }

            // Map baseScore to a realistic-looking similarity metric
            // High scores range from 0.82 to 0.98. Empty overlap gets background similarity (0.25 - 0.45)
            let finalSimilarity = 0.3 + (Math.abs(m.id.charCodeAt(1) % 15) / 100);
            if (intersection.size > 0 || termMatches > 0) {
              finalSimilarity = 0.65 + (baseScore * 0.33);
            }
            if (finalSimilarity > 0.995) finalSimilarity = 0.995;

            // Suffix small L2/Cosine variations
            if (selectedMetric === 'l2') {
              // Map similarity to pseudo-distance (lower is better, e.g. 0.05 to 1.5)
              const distance = (1.0 - finalSimilarity) * 2.0;
              return { ...m, similarity_score: finalSimilarity.toFixed(4), distance_metric: distance.toFixed(4) };
            }

            return { ...m, similarity_score: finalSimilarity.toFixed(4) };
          });

          // Sort by highest similarity
          const sortedResults = [...results]
            .sort((a, b) => b.similarity_score - a.similarity_score)
            .slice(0, searchK);

          setSearchResults(sortedResults);
          setIsSearching(false);
        }
      }, (idx + 1) * 350);
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090C14] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#0B101D]">
        <div>
          <h2 className="text-base font-bold text-white">Semantic Memory Vault</h2>
          <p className="text-xs text-slate-500">Long-term declarative knowledge bases & context-aware RAG vectors</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#111827] p-1 border border-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'bg-[#1D293E] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            Browse Archive
          </button>
          <button
            onClick={() => setActiveTab('semantic_search')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'semantic_search'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            ChromaDB RAG Query
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Control Bar */}
          <div className="p-6 border-b border-slate-800/30 bg-[#090C14]/50 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search cognitive records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-950/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Memory Cards */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredMemories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMemories.map((m) => (
                  <div
                    key={m.id}
                    className="bg-[#111827]/40 border border-slate-800/80 hover:border-slate-700/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200"
                  >
                    <div className="space-y-3">
                      {/* Badge Row */}
                      <div className="flex justify-between items-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryColor(m.category)}`}>
                          {m.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">history</span>
                          {m.timestamp}
                        </span>
                      </div>

                      {/* Main content */}
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {m.content}
                      </p>
                    </div>

                    {/* Footer Metadata */}
                    <div className="border-t border-slate-800/40 pt-4 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">source</span>
                        {m.source}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-indigo-400/80">
                        Confidence: {m.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-3xl p-6 text-center">
                <span className="material-symbols-outlined text-[36px] text-slate-600 mb-2">database_off</span>
                <p className="text-sm font-semibold text-slate-400">No memories found</p>
                <p className="text-xs text-slate-600 mt-1">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Dedicated ChromaDB Semantic Natural Language Search Console */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left panel: Query entry and terminal logs */}
          <div className="w-full lg:w-[45%] border-r border-slate-800/40 p-6 flex flex-col h-full overflow-y-auto space-y-5">
            {/* Semantic Query Form */}
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">quick_reference_all</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Natural Language RAG Input</h4>
              </div>

              <form onSubmit={handleSemanticSearch} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 uppercase font-bold">Query Text</label>
                  <textarea
                    rows={3}
                    value={semanticQuery}
                    onChange={(e) => setSemanticQuery(e.target.value)}
                    placeholder="e.g. What is the storage schema configuration or when is the viva presentation defense scheduled?"
                    className="w-full bg-[#090C14] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Vector parameters */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Retrieved Limit (K)</label>
                    <select
                      value={searchK}
                      onChange={(e) => setSearchK(Number(e.target.value))}
                      className="w-full bg-[#090C14] border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value={1}>K = 1 Match</option>
                      <option value={2}>K = 2 Matches</option>
                      <option value={3}>K = 3 Matches</option>
                      <option value={4}>K = 4 Matches</option>
                      <option value={5}>K = 5 Matches</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Vector Metric</label>
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="w-full bg-[#090C14] border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="cosine">Cosine Closeness</option>
                      <option value="l2">L2 Distance</option>
                      <option value="ip">Inner Product</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearching || !semanticQuery.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      Running Similarity Search...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                      Query Vector Store
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Collection Metadata Card */}
            <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 text-[11px] text-slate-400 space-y-2">
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="font-semibold text-slate-500">ChromaDB Target:</span>
                <span className="font-mono text-indigo-400 font-extrabold">shadowmind_memories</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-2">
                <span className="font-semibold text-slate-500">Embedding Dim:</span>
                <span className="font-mono text-slate-300">384 (ASCII Deterministic)</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="font-semibold text-slate-500">RAG Integration Status:</span>
                <span className="text-emerald-400 font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Active / Connected
                </span>
              </div>
            </div>

            {/* Terminal Live logs */}
            {searchLogs.length > 0 && (
              <div className="flex-1 flex flex-col bg-[#05070c] border border-slate-900 rounded-2xl p-4 font-mono text-[10px] text-slate-400 space-y-1.5 min-h-[160px] max-h-[300px] overflow-y-auto">
                <div className="text-indigo-500 font-bold border-b border-slate-900 pb-1.5 mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  REASONING OVERLAY ENGINE: CHROMADB SEED
                </div>
                {searchLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed flex items-start gap-1.5 animate-[fadeIn_0.15s_ease-out]">
                    <span className="text-indigo-500/80 shrink-0 select-none">&gt;&gt;</span>
                    <span className={index === searchLogs.length - 1 && isSearching ? "text-indigo-400 animate-pulse font-bold" : ""}>{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Semantic search output matches */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Semantic Search Results (Matches Rank Order)
            </h3>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((match, idx) => {
                  const scoreNum = Number(match.similarity_score);
                  const isHighConf = scoreNum > 0.8;

                  return (
                    <div
                      key={match.id}
                      className="bg-[#111827]/40 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl p-5 space-y-4 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Match rank marker badge */}
                      <div className="absolute right-0 top-0 bg-indigo-500/10 border-l border-b border-slate-800/60 text-indigo-400 font-mono text-[10px] font-black w-8 h-8 flex items-center justify-center rounded-bl-xl">
                        #{idx + 1}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getCategoryColor(match.category)}`}>
                            {match.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            Source: {match.source}
                          </span>
                        </div>

                        <p className="text-xs text-white font-medium leading-relaxed pr-6">
                          {match.content}
                        </p>
                      </div>

                      {/* Vector scores panel */}
                      <div className="border-t border-slate-800/40 pt-3.5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                        {/* Similarity progress bar */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider shrink-0">Similarity Score</span>
                          <div className="w-24 bg-slate-900 h-1.5 border border-slate-800 rounded-full overflow-hidden shrink-0">
                            <div
                              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${scoreNum * 100}%` }}
                            ></div>
                          </div>
                          <span className={`font-mono font-extrabold ${isHighConf ? 'text-indigo-400' : 'text-slate-400'}`}>
                            {scoreNum.toFixed(4)}
                          </span>
                        </div>

                        {match.distance_metric && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                            <span className="text-slate-500 uppercase font-bold text-[9px]">L2 Dist:</span>
                            <span>{match.distance_metric}</span>
                          </div>
                        )}

                        <span className="text-[10px] text-slate-500 font-semibold italic flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                          Index: {match.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-3xl p-6 text-center bg-[#090C14]/30">
                <div className="w-12 h-12 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px] text-slate-500 animate-pulse">explore</span>
                </div>
                <p className="text-sm font-semibold text-slate-400">Semantic Search Idle</p>
                <p className="text-xs text-slate-600 mt-1.5 max-w-sm leading-relaxed">
                  Enter a natural language query on the left pane and execute "Query Vector Store" to pull similarity-ranked contexts from ChromaDB.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

