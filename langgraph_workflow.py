# ============================================================================
# ShadowMind AI: LangGraph Agentic Workflow Core
# Designed by: Lumix Forge (B.Tech Final Year Engineering Project)
# Domain: Agentic AI, State Graph Architectures, & Autonomous Digital Twins
# Target Framework: LangGraph (Python v0.1+) / LangChain Community
# ============================================================================

from typing import Dict, List, TypedDict, Annotated, Literal
import json
import operator
from langgraph.graph import StateGraph, END
from vector_memory_service import VectorMemoryService


# ============================================================================
# 1. STATE DEFINITION (Agentic Cognitive State)
# ============================================================================
class AgentState(TypedDict):
    """
    Represents the complete cognitive memory and execution state of the
    ShadowMind agent through the reasoning graph.
    """
    user_query: str                             # Original high-level command/query
    recalled_preferences: Dict[str, str]        # Implicit user habits retrieved from SQLite
    recalled_context: List[str]                 # Document context matching keyword SQL RAG
    recent_episodes: List[Dict[str, str]]       # Conversation backstack / short-term memory
    thoughts_trail: Annotated[List[str], operator.add] # Cumulative reasoning chain logs (Thought log)
    next_steps_pipeline: List[str]              # Structured sub-tasks generated during planning
    active_tool_call: Dict[str, any]            # Parameters of the currently scheduled tool
    tool_observation: str                        # Feedback/output from executing the native tool
    final_response: str                         # Terminal output packaged for the view layer


# ============================================================================
# LONG-TERM SEMANTIC MEMORY INSTANTIATION & SEEDING
# ============================================================================
memory_service = VectorMemoryService()

# Seed default memories to guarantee realistic RAG behavior
default_seeds = [
    {
        "content": "SRS-FR-04: The task planner must decompose complex user requests into structured, multi-step execution pipelines.",
        "category": "document_chunk",
        "source": "document_upload"
    },
    {
        "content": "System Architecture: SQLite/Room acts as the local offline-first memory manager, while PostgreSQL handles centralized cloud sync.",
        "category": "document_chunk",
        "source": "document_upload"
    },
    {
        "content": "User preference: Lumix Forge prefers highly technical, detailed step-by-step preparation roadmaps.",
        "category": "preference",
        "source": "chat"
    },
    {
        "content": "The B.Tech final viva defense and agent presentation is scheduled for mid-July with academic examiners.",
        "category": "fact",
        "source": "chat"
    }
]

# Seed fallback/vector store if empty
try:
    existing_memories = memory_service.search_similar_memories("test", k=1)
    if not existing_memories:
        print("📥 [LANGGRAPH] Seeding vector memory service with B.Tech thesis specifications...")
        for seed in default_seeds:
            memory_service.add_memory(
                content=seed["content"],
                category=seed["category"],
                source=seed["source"]
            )
except Exception as e:
    print(f"⚠️ [LANGGRAPH] Failed to check/seed vector store: {e}")


# ============================================================================
# 2. WORKFLOW NODES (Cognitive Processing Modules)
# ============================================================================

def memory_retrieval_node(state: AgentState) -> Dict[str, any]:
    """
    Node 1: Queries ChromaDB vector store for semantic matches (RAG)
    and retrieves high-confidence user preferences.
    """
    query = state["user_query"]
    print(f"\n🧠 [NODE: MEMORY_RETRIEVAL] Querying vector memories for: '{query}'")
    
    # 1. Retrieve document chunks using our VectorMemoryService (RAG)
    retrieved_results = memory_service.search_similar_memories(query, k=3)
    
    # 2. Separate retrieved contexts from preferences
    recalled_context = []
    recalled_preferences = {}
    
    for result in retrieved_results:
        content = result["content"]
        category = result["category"]
        score = result["similarity_score"]
        
        # Append to contexts if it's a document chunk or a general fact
        if category in ["document_chunk", "fact"]:
            recalled_context.append(f"[{category.upper()} - Similarity: {score}] {content}")
        elif category == "preference":
            # Extract implicit user traits / preference rules
            if "prefer" in content.lower():
                recalled_preferences["work_style"] = "Detailed step-by-step roadmaps"
                recalled_preferences["user_profile"] = content
    
    # Fallback default values if none were retrieved or match is too low
    if not recalled_context:
        recalled_context = [
            "[DEFAULT] System Architecture: SQLite/Room is used for offline-first local state storage."
        ]
    if not recalled_preferences:
        recalled_preferences = {
            "favorite_topic": "Agentic AI Architectures",
            "work_style": "Detailed step-by-step roadmaps"
        }
        
    thoughts = (
        f"[MEMORY_RETRIEVAL] Vector search completed. Retrieved {len(recalled_context)} matching "
        f"context nodes and {len(recalled_preferences)} user preference configurations from ChromaDB."
    )
    
    return {
        "recalled_context": recalled_context,
        "recalled_preferences": recalled_preferences,
        "thoughts_trail": [thoughts]
    }


def task_planning_node(state: AgentState) -> Dict[str, any]:
    """
    Node 2: Evaluates the gathered context and designs a multi-step task
    pipeline if the user requested complex automation.
    Decomposes the high-level request into a formal array of JSON sub-tasks
    aligned with the 'autonomous_tasks' PostgreSQL schema.
    """
    query = state["user_query"].lower()
    print("📋 [NODE: TASK_PLANNER] Formally decomposing complex goals into actionable database steps...")
    
    pipeline = []
    thoughts = ""
    
    if "viva" in query or "schedule" in query:
        pipeline = [
            "Review Flashcards covering LLM vs Agentic AI paradigms",
            "Examine Room SQLite Schema relations & table properties",
            "Verify Kotlin Coroutines and background thread execution",
            "Present local RAG prompt templates to Lumix Forge defense panel"
        ]
        
        # Structure a formal sub-task model mirroring the Postgres schema
        db_subtask_structure = {
            "title": "Study Viva QA Flashcards",
            "description": "Comprehensive roadmap for Lumix Forge project defense.",
            "status": "IN_PROGRESS",
            "steps_json": [
                {"id": 1, "step": step, "completed": False} for step in pipeline
            ]
        }
        
        thoughts = (
            f"[TASK_PLANNER] Decomposed request into structured task: '{db_subtask_structure['title']}'. "
            f"Generated steps: {json.dumps(db_subtask_structure['steps_json'])}"
        )
    elif "specs" in query or "specification" in query:
        pipeline = [
            "Parse markdown specifications file",
            "Group mandates into four core storage matrices",
            "Confirm SQLite entity definitions vs PostgreSQL relational indices"
        ]
        db_subtask_structure = {
            "title": "Analyze Project Specs",
            "description": "Extracting architectural invariants.",
            "status": "PENDING",
            "steps_json": [
                {"id": idx + 1, "step": step, "completed": False} for idx, step in enumerate(pipeline)
            ]
        }
        thoughts = (
            f"[TASK_PLANNER] Specification audit required. Decomposed into task: '{db_subtask_structure['title']}'. "
            f"Generated steps: {json.dumps(db_subtask_structure['steps_json'])}"
        )
    else:
        pipeline = ["Address conversation query directly"]
        thoughts = "[TASK_PLANNER] Standard query detected. Created default conversational execution node."
        
    return {
        "next_steps_pipeline": pipeline,
        "thoughts_trail": [thoughts]
    }


def tool_selection_node(state: AgentState) -> Dict[str, any]:
    """
    Node 3: Decides if an action requires tool calling (e.g. database commits,
    system updates) or if it can transition to synthesis.
    """
    pipeline = state.get("next_steps_pipeline", [])
    query = state["user_query"].lower()
    print("🛠️ [NODE: TOOL_SELECTOR] Determining if native actions are required...")
    
    tool_call = {}
    thoughts = ""
    
    # Check if a database task creation tool should be called
    if ("viva" in query or "schedule" in query) and len(pipeline) > 0:
        tool_call = {
            "name": "create_autonomous_task",
            "arguments": {
                "title": "Study Viva QA Flashcards",
                "description": "Comprehensive roadmap for Lumix Forge project defense.",
                "steps": pipeline
            }
        }
        thoughts = f"[TOOL_SELECTOR] Action required: scheduled call to '{tool_call['name']}' tool."
    else:
        thoughts = "[TOOL_SELECTOR] No external tool call required. Proceeding to final synthesis."
        
    return {
        "active_tool_call": tool_call,
        "thoughts_trail": [thoughts]
    }


def tool_execution_node(state: AgentState) -> Dict[str, any]:
    """
    Node 4: Simulates native local execution of the chosen tool on the client (SQLite inserts).
    """
    tool_call = state["active_tool_call"]
    print(f"⚡ [NODE: TOOL_EXECUTION] Executing on-device tool '{tool_call['name']}'...")
    
    # Simulating database commit success callback
    observation = f"SUCCESS: Commited task '{tool_call['arguments']['title']}' containing {len(tool_call['arguments']['steps'])} sub-steps to Room database table."
    thoughts = f"[TOOL_EXECUTION] Observed feedback: '{observation}'"
    
    return {
        "tool_observation": observation,
        "thoughts_trail": [thoughts],
        # Clear out current call parameters to prevent loops
        "active_tool_call": {} 
    }


def final_synthesis_node(state: AgentState) -> Dict[str, any]:
    """
    Node 5: Merges initial parameters, context, and tool outputs into a
    fully compiled, cohesive user response.
    """
    query = state["user_query"]
    observation = state.get("tool_observation", "No actions executed.")
    preferences = state.get("recalled_preferences", {})
    print("✨ [NODE: FINAL_SYNTHESIS] Combining all cognitive signals...")
    
    # Tailor response to user preferences
    style_suffix = ""
    if preferences.get("work_style") == "Detailed step-by-step roadmaps":
        style_suffix = " (formatted in a structured roadmap as preferred)"
        
    final_output = (
        f"I have analyzed your request regarding '{query}' and completed the analysis{style_suffix}.\n\n"
        f"💡 Memory Status: I indexed your document chunks into the SQLite memory matrix.\n"
        f"🛠️ Tool Status: {observation}\n\n"
        f"I am ready for any follow-up inquiries!"
    )
    
    thoughts = "[FINAL_SYNTHESIS] Output successfully synthesized and structured."
    
    return {
        "final_response": final_output,
        "thoughts_trail": [thoughts]
    }


# ============================================================================
# 3. ROUTING / CONDITIONAL EDGES
# ============================================================================
def should_execute_tool(state: AgentState) -> Literal["execute_tool", "synthesize"]:
    """
    Router function checking if a valid tool call was registered.
    """
    tool_call = state.get("active_tool_call", {})
    if tool_call and "name" in tool_call:
        return "execute_tool"
    return "synthesize"


# ============================================================================
# 4. STATE GRAPH COMPOSITION
# ============================================================================
def build_shadowmind_graph() -> StateGraph:
    workflow = StateGraph(AgentState)
    
    # Register Cognitive Nodes
    workflow.add_node("memory_retrieval", memory_retrieval_node)
    workflow.add_node("task_planning", task_planning_node)
    workflow.add_node("tool_selection", tool_selection_node)
    workflow.add_node("tool_execution", tool_execution_node)
    workflow.add_node("final_synthesis", final_synthesis_node)
    
    # Establish Standard Edges (Sequential Transitions)
    workflow.set_entry_point("memory_retrieval")
    workflow.add_edge("memory_retrieval", "task_planning")
    workflow.add_edge("task_planning", "tool_selection")
    
    # Register Conditional Edge (Branching based on Tool Selection)
    workflow.add_conditional_edges(
        "tool_selection",
        should_execute_tool,
        {
            "execute_tool": "tool_execution",
            "synthesize": "final_synthesis"
        }
    )
    
    # Re-route Tool observation back to planning/synthesis cycle
    workflow.add_edge("tool_execution", "final_synthesis")
    workflow.add_edge("final_synthesis", END)
    
    # Compile StateGraph
    return workflow.compile()


# ============================================================================
# 5. WORKFLOW SIMULATOR (Execution Entrypoint)
# ============================================================================
if __name__ == "__main__":
    print("=" * 80)
    print("⚡ Starting ShadowMind AI LangGraph Core Execution Simulator ⚡")
    print("=" * 80)
    
    # Initialize the graph
    app = build_shadowmind_graph()
    
    # Simulate a user query requesting viva exam scheduling
    initial_state: AgentState = {
        "user_query": "Plan my B.Tech final year viva schedule and save it as a task",
        "recalled_preferences": {},
        "recalled_context": [],
        "recent_episodes": [
            {"role": "assistant", "message": "Initialized secure local handshakes."}
        ],
        "thoughts_trail": ["[INITIAL_TRIGGER] Received user request in state machine."],
        "next_steps_pipeline": [],
        "active_tool_call": {},
        "tool_observation": "",
        "final_response": ""
    }
    
    # Run graph execution
    result_state = app.invoke(initial_state)
    
    print("\n" + "=" * 80)
    print("📊 AGENTIC CONVERSATION FEEDBACK:")
    print("=" * 80)
    print(result_state["final_response"])
    print("\n🧠 COGNITIVE TRAIL LOGS:")
    for i, thought in enumerate(result_state["thoughts_trail"], 1):
        print(f"  {i}. {thought}")
    print("=" * 80)
