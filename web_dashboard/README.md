# ShadowMind AI: Web Dashboard Application
**Domain**: B.Tech Final Year Engineering Project  
**Sub-Domain**: Agentic AI, Autonomous Digital Twins, & Cognitive Hubs  

This sub-folder houses the foundational, production-grade **React.js & Tailwind CSS components** for the ShadowMind AI Web Dashboard. It integrates a persistent sidebar navigation panel, a telemetry-rich Cognitive Hub, and a chat interface displaying the agent's real-time **ReAct (Thought-Action-Observation) reasoning logs**.

---

## 1. Project Directory Mapping
The components correspond directly to the database relations defined in `/postgres_schema.sql` and mirror the UI state machines of the Jetpack Compose Android client:

- **`App.jsx`**: Core coordinator component handling tab navigation, mock state streams, and simulated dialogue loopback.
- **`components/Sidebar.jsx`**: Left-anchored persistent navigation panel styled with neon status indicators and Lumix Forge branding.
- **`components/Dashboard.jsx`**: Cognitive Hub dashboard showcasing semantic memory metrics, active tools, completed workflows, and quick action nodes.
- **`components/ChatAssistant.jsx`**: Centered conversation screen highlighting expandable **Cognitive Trails (ReAct reasoning steps)** and responsive inputs.

---

## 2. Fast Installation & Setup
To run this dashboard locally, ensure you have **Node.js (v18+)** installed:

### Step 1: Initialize Project
Create a blank React app using Vite:
```bash
npm create vite@latest shadowmind-web -- --template react
cd shadowmind-web
```

### Step 2: Install Styling & Fonts
Install Tailwind CSS (v4) and Google Material Symbols (used for indicators and icons):
```bash
npm install tailwindcss @tailwindcss/vite
```
In your HTML header template (`index.html`), include the Material Symbols stylesheet:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

### Step 3: Copy Code Structures
Move the created files from this folder into your local source folder:
1. Copy `/web_dashboard/App.jsx` to your workspace's `/src/App.jsx`.
2. Copy `/web_dashboard/components/` files to your `/src/components/` folder.

### Step 4: Launch Dev Server
Start your local sandbox server:
```bash
npm run dev
```
Open the generated local address (typically `http://localhost:5173`) in your web browser to demonstrate your fully animated agentic web dashboard to the evaluation panel!
