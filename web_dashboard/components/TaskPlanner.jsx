import React, { useState } from 'react';

export default function TaskPlanner({ stats, tasks, setTasks, onToggleStep }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `t_${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc || 'User-defined autonomous agent execution workflow.',
      status: 'PENDING',
      steps: [
        { label: 'Initialize planning node', done: false },
        { label: 'Resolve dependency graph', done: false },
        { label: 'Execute target action logic', done: false },
      ],
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddModal(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IN_PROGRESS':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090C14] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/50 flex justify-between items-center bg-[#0B101D]">
        <div>
          <h2 className="text-base font-bold text-white">Planner Workspace</h2>
          <p className="text-xs text-slate-500">Decompose user instructions into structured autonomous execution sequences</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Task Pipeline
        </button>
      </div>

      {/* Task Stack */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {tasks.map((task) => {
          const completedCount = task.steps.filter((s) => s.done).length;
          const progressPercent = Math.round((completedCount / task.steps.length) * 100);

          return (
            <div
              key={task.id}
              className="bg-[#111827]/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/50 transition-all space-y-4"
            >
              {/* Header block */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {task.title}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(task.status)}`}>
                      {task.status}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Created: {task.createdAt}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                  <span>Execution Progress ({completedCount}/{task.steps.length} Steps)</span>
                  <span className="text-indigo-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-900/60 h-1.5 border border-slate-800 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Steps checklist */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-800/40 pt-4">
                {task.steps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => onToggleStep(task.id, idx)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      step.done
                        ? 'bg-slate-900/30 border-slate-800/60 text-slate-400'
                        : 'bg-slate-900/80 border-slate-800 text-white hover:border-slate-700/70'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${
                      step.done ? 'text-emerald-500 font-bold' : 'text-slate-600'
                    }`}>
                      {step.done ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className={`text-[11px] font-semibold leading-none ${step.done ? 'line-through text-slate-500' : ''}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B101D] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-800/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-[20px]">smart_toy</span>
                Schedule Autonomous Task
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Implicit User Preferences"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Task Description
                </label>
                <textarea
                  placeholder="e.g. Scan databases to extract cognitive styles and sync back."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  rows="3"
                  className="w-full bg-[#111827] border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md active:scale-95"
                >
                  Confirm & Initialize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
