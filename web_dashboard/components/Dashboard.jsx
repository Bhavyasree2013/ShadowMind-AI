import React from 'react';

export default function Dashboard({ stats, workflows, tasks = [], onToggleStep, onQuickAction }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#090C14]">
      {/* Header Banner */}
      <div className="relative bg-[#111827] rounded-3xl p-6 border border-slate-800 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              Digital Twin Intelligence Hub
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Hello, Lumix Forge Team</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Your agent has observed 12 cognitive actions today. Memory pipeline is optimized.
            </p>
          </div>
          <button
            onClick={() => onQuickAction('plan_viva')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-200 shadow-lg shadow-indigo-950/40 active:scale-95"
          >
            Plan Viva Schedule
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Semantic Memory Size</span>
            <span className="material-symbols-outlined text-[18px] text-indigo-400">database</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{stats.memoriesCount || 0}</span>
            <span className="text-[11px] text-indigo-400 font-semibold">Indexed Vectors</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
              style={{ width: `${Math.min(100, ((stats.memoriesCount || 0) * 8))}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Autonomous Tools Access</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-400">api</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{stats.toolsCount || '06'}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Active Services</span>
          </div>
          <div className="flex gap-1.5 mt-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F2937]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F2937]"></span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Tasks Completed</span>
            <span className="material-symbols-outlined text-[18px] text-amber-500">task_alt</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{stats.completedTasksCount || 0}</span>
            <span className="text-[11px] text-amber-500 font-semibold">/ {stats.totalTasksCount || 0} Total</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 font-semibold truncate">
            {stats.totalTasksCount - stats.completedTasksCount} goals awaiting scheduled reasoning pipelines.
          </p>
        </div>
      </div>

      {/* LangGraph Planner Decomposed Task Tracker */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            LangGraph Planner: Decomposed Task Status Tracker
          </h3>
          <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            Agent Sync Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => {
            const completedCount = task.steps.filter((s) => s.done).length;
            const totalSteps = task.steps.length;
            const progressPercent = Math.round((completedCount / totalSteps) * 100);

            return (
              <div 
                key={task.id} 
                className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                    <span className={`text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase shrink-0 ${
                      task.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mt-4">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500">
                      <span>Execution Progress ({completedCount}/{totalSteps} Steps)</span>
                      <span className="text-indigo-400 font-extrabold">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 border border-slate-800/60 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Sub-tasks checklist */}
                <div className="border-t border-slate-800/40 pt-3.5 mt-2">
                  <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-2">Decomposed Sub-Tasks</p>
                  <div className="grid grid-cols-1 gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {task.steps.map((step, idx) => (
                      <div 
                        key={idx}
                        onClick={() => onToggleStep(task.id, idx)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          step.done 
                            ? 'bg-slate-900/30 border-slate-800/60 text-slate-500' 
                            : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700/60 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[16px] shrink-0 ${
                          step.done ? 'text-emerald-500 font-bold' : 'text-slate-600'
                        }`}>
                          {step.done ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span className={`text-[11px] font-semibold leading-none truncate ${step.done ? 'line-through text-slate-500' : ''}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-Column Section: Active Workflows & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Recent Workflows */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Recent Multi-Step Workflows
          </h3>
          <div className="space-y-3">
            {workflows.map((wf, index) => (
              <div 
                key={index} 
                className="bg-[#111827]/40 hover:bg-[#111827]/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-indigo-400">
                  <span className="material-symbols-outlined text-[20px]">{wf.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{wf.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{wf.description}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                  wf.status === 'Completed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                }`}>
                  {wf.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Dialogue Actions */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Suggested Interventions
          </h3>
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3">
            <p className="text-xs text-slate-400 leading-normal mb-2">
              Launch pre-configured agentic instructions directly into the LLM chat pipeline.
            </p>
            <button
              onClick={() => onQuickAction('analyze_specs')}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-xs font-medium text-slate-200 group transition-all"
            >
              <span>Analyze B.Tech Thesis Specs</span>
              <span className="material-symbols-outlined text-[16px] text-indigo-400 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button
              onClick={() => onQuickAction('extract_habits')}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-xs font-medium text-slate-200 group transition-all"
            >
              <span>Audit Implicit User Preferences</span>
              <span className="material-symbols-outlined text-[16px] text-indigo-400 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
            <button
              onClick={() => onQuickAction('test_rag')}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-xs font-medium text-slate-200 group transition-all"
            >
              <span>Test SQL Keyword RAG</span>
              <span className="material-symbols-outlined text-[16px] text-indigo-400 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
