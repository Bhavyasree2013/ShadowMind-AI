import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatAssistant from './components/ChatAssistant';
import TaskPlanner from './components/TaskPlanner';
import MemoryVault from './components/MemoryVault';
import DefenseAcademy from './components/DefenseAcademy';
import AgentSettings from './components/AgentSettings';

export default function App() {
  const [currentTab, setCurrentTab] = useState('hub');
  const [isReasoning, setIsReasoning] = useState(false);

  // Initial Seed Data mirroring the production SQLite / PostgreSQL schemas
  const [tasks, setTasks] = useState([
    {
      id: 't1',
      title: 'Project Specification Analyzer',
      description: 'Extracted functional SRS mandates into planning queue.',
      status: 'COMPLETED',
      steps: [
        { label: 'Read B.Tech Thesis PDF structure', done: true },
        { label: 'Summarize core requirements', done: true },
        { label: 'Generate technical system flow', done: true },
      ],
      createdAt: '2026-07-08 02:00',
    },
    {
      id: 't2',
      title: 'Local RAG Ingestion Pipeline',
      description: 'Segmented and indexed B.Tech Thesis Thesis_v2.md.',
      status: 'COMPLETED',
      steps: [
        { label: 'Parse markdown files into chunks', done: true },
        { label: 'Generate sentence transformer embeddings', done: true },
        { label: 'Load chunks into SQLite virtual table', done: true },
      ],
      createdAt: '2026-07-08 03:20',
    },
    {
      id: 't3',
      title: 'Autonomous Exam Schedule Generation',
      description: 'Building multi-step preparation roadmap linked to flashcards.',
      status: 'IN_PROGRESS',
      steps: [
        { label: 'Fetch exam schedules from official PDF', done: true },
        { label: 'Map priority topics to available slots', done: false },
        { label: 'Synthesize optimal daily review calendars', done: false },
      ],
      createdAt: '2026-07-08 05:15',
    },
    {
      id: 't4',
      title: 'JWT PostgreSQL Handshake Bridge',
      description: 'Synchronizing on-device Room state with external PostgreSQL.',
      status: 'PENDING',
      steps: [
        { label: 'Provision secure cloud database instance', done: false },
        { label: 'Implement token silent-refresh mechanisms', done: false },
        { label: 'Run local integration test scenarios', done: false },
      ],
      createdAt: '2026-07-08 05:35',
    },
  ]);

  const [enabledTools, setEnabledTools] = useState({
    google_search: true,
    file_analysis: true,
    vector_rag: true,
    postgres_sync: true,
    task_planner: true,
    preferences_miner: true,
  });

  const [stats, setStats] = useState({
    memoriesCount: 1428,
  });

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  const activeToolsCount = Object.values(enabledTools).filter(Boolean).length;
  const toolsCountStr = activeToolsCount < 10 ? `0${activeToolsCount}` : `${activeToolsCount}`;

  const derivedStats = {
    ...stats,
    toolsCount: toolsCountStr,
    totalTasksCount,
    completedTasksCount,
  };

  const toggleTool = (toolId) => {
    setEnabledTools((prev) => ({
      ...prev,
      [toolId]: !prev[toolId],
    }));
  };

  const toggleStep = (taskId, stepIdx) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSteps = [...t.steps];
          updatedSteps[stepIdx] = {
            ...updatedSteps[stepIdx],
            done: !updatedSteps[stepIdx].done,
          };
          
          // Determine status automatically based on checked steps
          const allDone = updatedSteps.every((s) => s.done);
          const someDone = updatedSteps.some((s) => s.done);
          const newStatus = allDone ? 'COMPLETED' : someDone ? 'IN_PROGRESS' : 'PENDING';

          return { ...t, steps: updatedSteps, status: newStatus };
        }
        return t;
      })
    );
  };

  const [workflows, setWorkflows] = useState([
    {
      title: 'Project Specification Analyzer',
      description: 'Extracted functional SRS mandates into planning queue.',
      icon: 'description',
      status: 'Completed',
    },
    {
      title: 'Local RAG Ingestion Pipeline',
      description: 'Segmented and indexed B.Tech Thesis Thesis_v2.md.',
      icon: 'cloud_upload',
      status: 'Completed',
    },
    {
      title: 'Autonomous Exam Schedule Generation',
      description: 'Building multi-step preparation roadmap...',
      icon: 'schedule',
      status: 'In Progress',
    },
  ]);

  const [episodes, setEpisodes] = useState([
    {
      role: 'assistant',
      message: 'Greetings! I am your ShadowMind Digital Twin. I have established safe on-device SQLite memories and authenticated our JWT credentials with the PostgreSQL backend. How shall we collaborate today?',
      thoughts: '[CONSOL_STATE] Loading stored parameters.\n[PREF_RECALL] User name is "Lumix Forge Team". Confidence metric: 1.00.\n[INIT_REPLY] Sending synchronized greetings.',
    }
  ]);

  // Handle dialog messages & mock ReAct reasoning loop responses
  const handleSendMessage = (messageText) => {
    // 1. Append User Message
    const newUserEpisode = { role: 'user', message: messageText };
    setEpisodes((prev) => [...prev, newUserEpisode]);
    setIsReasoning(true);

    // 2. Simulate autonomous ReAct feedback loop
    setTimeout(() => {
      let twinResponse = '';
      let thoughtsTrail = '';

      if (messageText.toLowerCase().includes('viva') || messageText.toLowerCase().includes('schedule')) {
        twinResponse = 'I have analyzed our defense milestones and created a 4-step preparation pipeline under the Workspace panel. It maps your revision steps directly to the viva questionnaire flashcards!';
        thoughtsTrail = '[PLANNER_INIT] User requested viva timeline.\n[DATABASE_SEARCH] Searching local knowledge nodes for "viva defense". Found 8 matching flashcard answers.\n[TOOL_CALL] create_task("Study Viva QA Flashcards", "Covers LLM vs Agentic AI, SQLite structures, and local RAG schemas")\n[TOOL_OBSERVATION] Task committed with row ID 5.\n[FINAL_SYNTHESIS] Outputting plan confirmation to user.';
        
        setTasks((prev) => {
          if (prev.some((t) => t.id === 't5')) return prev;
          const newVivaTask = {
            id: 't5',
            title: 'Study Viva QA Flashcards',
            description: 'Covers LLM vs Agentic AI, SQLite structures, and local RAG schemas.',
            status: 'IN_PROGRESS',
            steps: [
              { label: 'Revise SQLite vs Room mapping', done: true },
              { label: 'Review LangGraph State graph cognitive nodes', done: false },
              { label: 'Memorize SQLite encryption configurations', done: false },
              { label: 'Confirm PostgreSQL synchronized silent-refresh tokens', done: false },
            ],
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
          return [newVivaTask, ...prev];
        });
      } else if (messageText.toLowerCase().includes('specs') || messageText.toLowerCase().includes('specification')) {
        twinResponse = 'According to the official project specifications extracted via RAG, ShadowMind AI uses an Offline-First approach with 4 distinct storage matrices: Episodic Logs, Semantic Facts, User Preferences, and Tasks.';
        thoughtsTrail = '[PLANNER_INIT] Query: project specification.\n[RAG_QUERY] Scanning_semantic_memories for keyword matching.\n[CONTEXT_INJECT] Appending segment: "System Architecture & Flows... Layer 3... Room ORM".\n[FINAL_SYNTHESIS] Summarizing matching architectural nodes.';
        
        setTasks((prev) => {
          if (prev.some((t) => t.id === 't6')) return prev;
          const newSpecTask = {
            id: 't6',
            title: 'Analyze Project Specifications',
            description: 'Extracting SRS functional constraints and planning local storage schema.',
            status: 'IN_PROGRESS',
            steps: [
              { label: 'Parse markdown specifications file', done: true },
              { label: 'Group mandates into 4 core storage matrices', done: false },
              { label: 'Confirm SQLite schema layout vs Postgres keys', done: false },
            ],
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
          return [newSpecTask, ...prev];
        });
      } else if (messageText.toLowerCase().includes('memory') || messageText.toLowerCase().includes('chromadb') || messageText.toLowerCase().includes('rag') || messageText.toLowerCase().includes('vector')) {
        twinResponse = `I have integrated a dedicated "ChromaDB RAG Query" interface into the Semantic Memory Vault! You can switch to that tab to perform natural language semantic similarity searches across our indexed vector collections (with custom K limits and Cosine Closeness metrics) and view the real-time reasoning logs.`;
        thoughtsTrail = `[REASONING] Scanning memories for query matches.\n[CHROMA_CONNECT] Connected to persistent "shadowmind_memories" store.\n[RAG_RETRIEVE] Vector search matched 3 relevant semantic knowledge nodes.\n[FINAL_REPLY] Explaining ChromaDB RAG Search tab features.`;
      } else if (messageText.toLowerCase().includes('tool') || messageText.toLowerCase().includes('settings') || messageText.toLowerCase().includes('search') || messageText.toLowerCase().includes('capability')) {
        const activeList = Object.keys(enabledTools)
          .filter(k => enabledTools[k])
          .map(k => k.replace('_', ' ').toUpperCase())
          .join(', ');
        const inactiveList = Object.keys(enabledTools)
          .filter(k => !enabledTools[k])
          .map(k => k.replace('_', ' ').toUpperCase())
          .join(', ');
        
        twinResponse = `I have synchronized my capability matrix state directly with your settings. Currently, my active tools are: [${activeList || 'NONE'}]. Disabled tools: [${inactiveList || 'NONE'}]. Any subsequent LangGraph planning cycles will adapt to this dynamic execution scope!`;
        thoughtsTrail = `[PLANNER_INIT] Query: Capability state query.\n[CONFIG_CHECK] Active tools list gathered from Settings matrix state.\n[FINAL_SYNTHESIS] Summarizing dynamic capability state.`;
      } else {
        twinResponse = `I have received your command: "${messageText}". I am analyzing our cognitive database to extract any implicit habits or preferences and formulate a structured plan. Let me know if you would like me to compile a task schedule!`;
        thoughtsTrail = `[REASONING] Analyzing query context: "${messageText}"\n[PREFERENCE_EXTRACT] Attempting to find learned behaviors.\n[FINAL_REPLY] Formulating safe conversational fallback.`;
      }

      setEpisodes((prev) => [
        ...prev,
        {
          role: 'assistant',
          message: twinResponse,
          thoughts: thoughtsTrail,
          isStreaming: true,
        },
      ]);
      setIsReasoning(false);
    }, 1500);
  };

  // Trigger quick dialogue shortcuts from Dashboard Suggestions
  const handleQuickAction = (actionKey) => {
    setCurrentTab('twin');
    if (actionKey === 'plan_viva') {
      handleSendMessage('Plan my B.Tech final viva prep schedule');
    } else if (actionKey === 'analyze_specs') {
      handleSendMessage('Analyze official project specifications for me');
    } else if (actionKey === 'extract_habits') {
      handleSendMessage('Check my implicit preferences stored in Room database');
    } else if (actionKey === 'test_rag') {
      handleSendMessage('Perform a test of the localized SQLite RAG pipeline');
    }
  };

  return (
    <div className="flex h-screen bg-[#090C14] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Panel Router */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {currentTab === 'hub' && (
          <Dashboard 
            stats={derivedStats} 
            workflows={workflows} 
            tasks={tasks}
            onToggleStep={toggleStep}
            onQuickAction={handleQuickAction} 
          />
        )}
        {currentTab === 'twin' && (
          <ChatAssistant 
            episodes={episodes} 
            onSendMessage={handleSendMessage} 
            isReasoning={isReasoning} 
          />
        )}
        {currentTab === 'workspace' && (
          <TaskPlanner 
            stats={derivedStats} 
            tasks={tasks}
            setTasks={setTasks}
            onToggleStep={toggleStep}
          />
        )}
        {currentTab === 'memory' && (
          <MemoryVault stats={derivedStats} />
        )}
        {currentTab === 'academic' && (
          <DefenseAcademy />
        )}
        {currentTab === 'settings' && (
          <AgentSettings 
            enabledTools={enabledTools}
            onToggleTool={toggleTool}
          />
        )}
      </main>
    </div>
  );
}
