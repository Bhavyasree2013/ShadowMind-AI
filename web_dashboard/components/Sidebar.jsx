import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'hub', label: 'Cognitive Hub', icon: 'grid_view' },
    { id: 'twin', label: 'Twin Assistant', icon: 'smart_toy' },
    { id: 'workspace', label: 'Planner Workspace', icon: 'list_alt' },
    { id: 'memory', label: 'Memory Vault', icon: 'database' },
    { id: 'academic', label: 'Defense Academy', icon: 'school' },
    { id: 'settings', label: 'Agent Settings', icon: 'settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0B101D] border-r border-slate-800 flex flex-col justify-between">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex flex-col mb-8">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse"></span>
            ShadowMind AI
          </h1>
          <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold mt-1">
            Lumix Forge • Digital Twin
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 font-medium'
                }`}
              >
                {/* Vertical Indicator Strip */}
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-md shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                )}
                <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Synchronized Core Footer */}
      <div className="p-6 border-t border-slate-800/50">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
              Twin Synced
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            Room Local DB & Postgres Server connected via JWT handshake.
          </p>
        </div>
      </div>
    </aside>
  );
}
