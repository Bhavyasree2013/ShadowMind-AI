import React, { useState } from 'react';

export default function AgentSettings({ enabledTools, onToggleTool, onSave }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [isAuditing, setIsAuditing] = useState(false);

  const tools = [
    {
      id: 'google_search',
      title: 'Google Search Integration',
      desc: 'Enables live web queries to gather current real-time contexts, academic papers, and external verification sources.',
      icon: 'search',
      category: 'External Retrieval',
      requiredTier: 'Standard',
    },
    {
      id: 'file_analysis',
      title: 'File Analysis Engine',
      desc: 'Parses local markdown specs, files, and PDFs directly into the on-device memory indexing matrices.',
      icon: 'description',
      category: 'Data Processing',
      requiredTier: 'Standard',
    },
    {
      id: 'vector_rag',
      title: 'SQLite Vector RAG Indexer',
      desc: 'Queries the ChromaDB / SQLite virtual memory schemas for high-fidelity semantic similarity match responses.',
      icon: 'database',
      category: 'Semantic Memory',
      requiredTier: 'Core',
    },
    {
      id: 'postgres_sync',
      title: 'PostgreSQL Cloud Synchronizer',
      desc: 'Schedules background JWT authenticated handshakes to back up offline states and sync sub-tasks.',
      icon: 'cloud_sync',
      category: 'Central Sync',
      requiredTier: 'Premium',
    },
    {
      id: 'task_planner',
      title: 'Cognitive Task Planner',
      desc: 'Invokes the formal planning nodes within LangGraph state graphs to automatically decompose goals into sub-tasks.',
      icon: 'analytics',
      category: 'Reasoning Engine',
      requiredTier: 'Core',
    },
    {
      id: 'preferences_miner',
      title: 'Implicit Preferences Miner',
      desc: 'Learns habits and conversational preferences implicitly from chat episodes, updating confidence weights dynamically.',
      icon: 'psychology',
      category: 'Learned Profile',
      requiredTier: 'Core',
    },
  ];

  const handleToggle = (toolId, toolTitle) => {
    onToggleTool(toolId);
    setToastMessage(`Agent state updated: '${toolTitle}' ${!enabledTools[toolId] ? 'enabled' : 'disabled'}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditLogs([]);
    
    const steps = [
      '🚀 Initializing Agent Cognitive Capability Diagnostics...',
      '📡 Querying active LangGraph node configuration matrices...',
      `🔍 Active tools detected: ${Object.keys(enabledTools).filter(k => enabledTools[k]).join(', ') || 'None'}`,
      '🧠 Formulating system confidence index scores...',
      '⚡ Testing internal ChromaDB vector retrieval indices...',
      '💾 Verifying local Room SQLite / PostgreSQL JWT sync handshake credentials...',
      '🎉 Audit complete. Agent operating status: OPTIMAL.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAuditLogs(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setIsAuditing(false);
        }
      }, (idx + 1) * 400);
    });
  };

  // Calculate cognitive index
  const activeCount = Object.values(enabledTools).filter(Boolean).length;
  const totalCount = tools.length;
  const cognitivePercent = Math.round((activeCount / totalCount) * 100);

  const getCognitiveRating = () => {
    if (cognitivePercent === 100) return { label: 'Autonomous Digital Twin', color: 'text-indigo-400', desc: 'Fully realized Agentic Twin with complete multi-agent reasoning and indexing capabilities.' };
    if (cognitivePercent >= 70) return { label: 'Balanced Assistant', color: 'text-emerald-400', desc: 'Well-rounded assistant with core reasoning and cloud-sync capabilities active.' };
    if (cognitivePercent >= 40) return { label: 'Localized Sandboxed LLM', color: 'text-amber-400', desc: 'Operating primarily on cached offline memories. External query pipelines are throttled.' };
    return { label: 'Restricted Core Only', color: 'text-rose-400', desc: 'Minimum functional utility. Only direct local inputs and basic workflows will execute.' };
  };

  const rating = getCognitiveRating();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090C14] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/50 flex justify-between items-center bg-[#0B101D]">
        <div>
          <h2 className="text-base font-bold text-white">Agent Capabilities & Settings</h2>
          <p className="text-xs text-slate-500">Configure LangGraph cognitive nodes, database synchronization sync, and active tool selection states</p>
        </div>
        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">
            Settings Real-time Sync
          </span>
        </div>
      </div>

      {/* Toast Alert Banner */}
      {showToast && (
        <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center justify-between animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {toastMessage}
          </div>
          <button onClick={() => setShowToast(false)} className="text-emerald-400 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Dynamic Cognitive Capability Score Panel */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Cognitive Capacity Monitor
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white">{cognitivePercent}%</span>
                <span className={`text-xs font-extrabold uppercase ${rating.color}`}>
                  {rating.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {rating.desc}
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="flex items-center gap-4 shrink-0 bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl">
              <div className="relative w-14 h-14 flex items-center justify-center">
                {/* SVG Circular Progress bar */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="4"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="transparent"
                    stroke="#6366f1"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - cognitivePercent / 100)}`}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <span className="text-xs font-black text-white">{activeCount}/{totalCount}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Enabled Tools</p>
                <p className="text-xs font-bold text-slate-300 mt-0.5">Active capabilities</p>
              </div>
            </div>
          </div>
        </div>

        {/* List of LangGraph Tool Selection Toggles */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Select Active Reasoning Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => {
              const isActive = enabledTools[tool.id];
              return (
                <div
                  key={tool.id}
                  className={`border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700/60'
                      : 'bg-[#111827]/10 border-slate-900 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isActive ? 'bg-indigo-600/10 text-indigo-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{tool.title}</h4>
                          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wide">
                            {tool.category}
                          </span>
                        </div>
                      </div>

                      {/* Custom Modern Switch Toggle */}
                      <button
                        onClick={() => handleToggle(tool.id, tool.title)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                          isActive ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          isActive ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  {/* Footing Details */}
                  <div className="border-t border-slate-800/40 pt-3 mt-4 flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                      Status: {isActive ? 'Available' : 'Throttled'}
                    </span>
                    <span>Req Tier: {tool.requiredTier}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostics Sandbox Console */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Agent Capability Diagnostic Sandbox
              </h4>
              <p className="text-[10px] text-slate-500">Run safe local mock checks to verify compile states and RAG capability bindings</p>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className={`px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-all ${
                isAuditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className={`material-symbols-outlined text-[14px] ${isAuditing ? 'animate-spin' : ''}`}>
                settings_backup_restore
              </span>
              {isAuditing ? 'Auditing...' : 'Run Diagnostics'}
            </button>
          </div>

          {auditLogs.length > 0 && (
            <div className="bg-black/40 border border-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-1 max-h-44 overflow-y-auto">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-indigo-500 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
