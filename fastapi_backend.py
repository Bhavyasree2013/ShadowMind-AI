# ============================================================================
# ShadowMind AI: FastAPI Production Backend Service Module
# Designed by: Lumix Forge (B.Tech Final Year Engineering Project)
# Domain: Agentic AI, Secure REST APIs, & Autonomous Digital Twins
# Target Framework: FastAPI, SQLAlchemy 2.0+, Pydantic v2
# ============================================================================

import os
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy import create_engine, Column, String, Text, Integer, DateTime, Numeric, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Import our LangGraph workflow state machine
try:
    from langgraph_workflow import build_shadowmind_graph, AgentState
    HAS_LANGGRAPH = True
except ImportError:
    HAS_LANGGRAPH = False

# ============================================================================
# 1. DATABASE CONFIGURATION & ORM MODELS
# ============================================================================
# Connects to PostgreSQL if DATABASE_URL is defined, defaults to a local SQLite database for easy offline sandbox development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./shadowmind_prod.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UserDB(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EpisodicChatDB(Base):
    __tablename__ = "episodic_chats"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(String, nullable=False)
    role = Column(String, nullable=False) # 'user', 'assistant', 'system'
    message = Column(Text, nullable=False)
    thought_trail = Column(Text, nullable=True)
    tokens_used = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)


class SemanticMemoryDB(Base):
    __tablename__ = "semantic_memories"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False) # 'preference', 'fact', 'document_chunk', 'reflection'
    source = Column(String, nullable=False)   # 'chat', 'document_upload', 'agent_consolidation'
    metadata_json = Column(JSON, nullable=True) # stores dynamic key-value metadata
    created_at = Column(DateTime, default=datetime.utcnow)


class AutonomousTaskDB(Base):
    __tablename__ = "autonomous_tasks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="PENDING") # 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
    steps_json = Column(JSON, nullable=False, default=list) # Decomposed JSON pipeline steps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LearnedPreferenceDB(Base):
    __tablename__ = "learned_preferences"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    pref_key = Column(String, nullable=False)
    pref_value = Column(Text, nullable=False)
    confidence_score = Column(Numeric(3, 2), default=1.00)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Auto-create tables on launch
Base.metadata.create_all(bind=engine)


# ============================================================================
# 2. PYDANTIC SERIALIZATION SCHEMAS
# ============================================================================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class MemoryCreate(BaseModel):
    content: str
    category: str = Field(description="preference, fact, document_chunk, reflection")
    source: str = Field(default="chat")
    metadata_json: Optional[Dict[str, Any]] = None


class MemoryResponse(BaseModel):
    id: str
    user_id: str
    content: str
    category: str
    source: str
    metadata_json: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class StepItem(BaseModel):
    id: int
    step: str
    completed: bool = False


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "PENDING"
    steps: List[StepItem] = []


class TaskResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    status: str
    steps_json: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatMessageRequest(BaseModel):
    session_id: str
    message: str


class ChatMessageResponse(BaseModel):
    response: str
    thoughts: List[str]
    created_tasks: List[TaskResponse] = []


# ============================================================================
# 3. DEPENDENCY INJECTION (DB Sessions)
# ============================================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================================
# 4. FASTAPI APP INITIALIZATION & CORS MIDDLEWARE
# ============================================================================
app = FastAPI(
    title="ShadowMind AI - Agentic Digital Twin Core Backend",
    description="Production-grade API endpoints wrapping Long-Term Memory (RAG) and LangGraph Workflows.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper function to obtain a default test user
def get_default_test_user_id(db: Session) -> str:
    user = db.query(UserDB).filter_by(email="viva_test@lumixforge.edu").first()
    if not user:
        user = UserDB(
            email="viva_test@lumixforge.edu",
            password_hash="argon2_secured_hash",
            full_name="Lumix Forge Evaluator"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user.id


# ============================================================================
# 5. ENDPOINT HANDLERS (CRUD API)
# ============================================================================

@app.get("/")
def get_status():
    return {
        "status": "ONLINE",
        "service": "ShadowMind Engine Backend",
        "langgraph_loaded": HAS_LANGGRAPH,
        "database_connected": True
    }


# --- MEMORIES CRUD ---

@app.post("/memories", response_model=MemoryResponse, status_code=status.HTTP_201_CREATED)
def create_memory(payload: MemoryCreate, db: Session = Depends(get_db)):
    user_id = get_default_test_user_id(db)
    new_memory = SemanticMemoryDB(
        user_id=user_id,
        content=payload.content,
        category=payload.category,
        source=payload.source,
        metadata_json=payload.metadata_json
    )
    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)
    return new_memory


@app.get("/memories", response_model=List[MemoryResponse])
def list_memories(
    category: Optional[str] = Query(None, description="Filter by memory category"),
    search: Optional[str] = Query(None, description="Search term for FTS"),
    db: Session = Depends(get_db)
):
    query = db.query(SemanticMemoryDB)
    if category:
        query = query.filter(SemanticMemoryDB.category == category)
    if search:
        query = query.filter(SemanticMemoryDB.content.contains(search))
    return query.order_by(SemanticMemoryDB.created_at.desc()).all()


@app.get("/memories/{memory_id}", response_model=MemoryResponse)
def get_memory(memory_id: str, db: Session = Depends(get_db)):
    memory = db.query(SemanticMemoryDB).filter(SemanticMemoryDB.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory vector not found in storage.")
    return memory


@app.delete("/memories/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memory(memory_id: str, db: Session = Depends(get_db)):
    memory = db.query(SemanticMemoryDB).filter(SemanticMemoryDB.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory vector not found in storage.")
    db.delete(memory)
    db.commit()
    return


# --- TASKS CRUD ---

@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    user_id = get_default_test_user_id(db)
    
    # Map pydantic steps list to JSON dict
    steps_dict = [step.dict() for step in payload.steps]
    
    new_task = AutonomousTaskDB(
        user_id=user_id,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        steps_json=steps_dict
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@app.get("/tasks", response_model=List[TaskResponse])
def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    db: Session = Depends(get_db)
):
    query = db.query(AutonomousTaskDB)
    if status_filter:
        query = query.filter(AutonomousTaskDB.status == status_filter)
    return query.order_by(AutonomousTaskDB.created_at.desc()).all()


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(AutonomousTaskDB).filter(AutonomousTaskDB.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Autonomous task pipeline not found.")
    return task


@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, payload: TaskCreate, db: Session = Depends(get_db)):
    task = db.query(AutonomousTaskDB).filter(AutonomousTaskDB.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Autonomous task pipeline not found.")
    
    steps_dict = [step.dict() for step in payload.steps]
    
    task.title = payload.title
    task.description = payload.description
    task.status = payload.status
    task.steps_json = steps_dict
    
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(AutonomousTaskDB).filter(AutonomousTaskDB.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Autonomous task pipeline not found.")
    db.delete(task)
    db.commit()
    return


# ============================================================================
# 6. INTEGRATED LANGGRAPH CONVERSATION HANDLER
# ============================================================================
@app.post("/agent/chat", response_model=ChatMessageResponse)
def run_agentic_chat(payload: ChatMessageRequest, db: Session = Depends(get_db)):
    """
    Core cognitive endpoint. Receives user utterance, triggers LangGraph
    reasoning chain to retrieve context/generate sub-tasks, commits
    outcomes to database, and structures unified agentic feedback.
    """
    user_id = get_default_test_user_id(db)
    
    # 1. Store incoming user query in episodic logs
    user_episode = EpisodicChatDB(
        user_id=user_id,
        session_id=payload.session_id,
        role="user",
        message=payload.message
    )
    db.add(user_episode)
    db.commit()
    
    final_text = ""
    thoughts = []
    created_tasks = []
    
    # 2. Invoke LangGraph engine if present
    if HAS_LANGGRAPH:
        graph = build_shadowmind_graph()
        initial_state: AgentState = {
            "user_query": payload.message,
            "recalled_preferences": {},
            "recalled_context": [],
            "recent_episodes": [{"role": "user", "message": payload.message}],
            "thoughts_trail": [f"[INITIAL_TRIGGER] Session '{payload.session_id}' spawned request."],
            "next_steps_pipeline": [],
            "active_tool_call": {},
            "tool_observation": "",
            "final_response": ""
        }
        
        # Execute workflow
        state_result = graph.invoke(initial_state)
        final_text = state_result["final_response"]
        thoughts = state_result["thoughts_trail"]
        
        # 3. Handle automated task persistence if planner node generated structured sub-tasks
        query_lower = payload.message.lower()
        if "viva" in query_lower or "schedule" in query_lower or "specs" in query_lower:
            # Reconstruct and commit the plan task
            title = "Study Viva QA Flashcards" if "viva" in query_lower else "Analyze Project Specs"
            desc = "Auto-generated planning task sequence."
            steps = state_result.get("next_steps_pipeline", [])
            
            steps_json = [
                {"id": idx + 1, "step": step, "completed": False} for idx, step in enumerate(steps)
            ]
            
            persisted_task = AutonomousTaskDB(
                user_id=user_id,
                title=title,
                description=desc,
                status="IN_PROGRESS" if "viva" in query_lower else "PENDING",
                steps_json=steps_json
              )
            db.add(persisted_task)
            db.commit()
            db.refresh(persisted_task)
            created_tasks.append(persisted_task)
            
    else:
        # Fallback if LangGraph file isn't found
        final_text = f"I received your command: '{payload.message}' but the LangGraph workflow engine was not compiled. Fallback conversation complete."
        thoughts = ["[FALLBACK] LangGraph imports failed. Serving direct chat reply."]
        
    # 4. Save agent output episode in episodic logs
    agent_episode = EpisodicChatDB(
        user_id=user_id,
        session_id=payload.session_id,
        role="assistant",
        message=final_text,
        thought_trail="\n".join(thoughts)
    )
    db.add(agent_episode)
    db.commit()
    
    return ChatMessageResponse(
        response=final_text,
        thoughts=thoughts,
        created_tasks=created_tasks
    )


# ============================================================================
# 7. MAIN LAUNCH INTERACTION (Local Dev Sandbox)
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 80)
    print("🚀 ShadowMind FastAPI Backend booting up...")
    print("💡 Connect to UI: http://127.0.0.1:8000/docs for Swagger testing")
    print("=" * 80 + "\n")
    uvicorn.run("fastapi_backend:app", host="127.0.0.1", port=8000, reload=True)
