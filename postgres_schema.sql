-- ============================================================================
-- ShadowMind AI: Production-Grade PostgreSQL Database Schema
-- Designed by: Lumix Forge (B.Tech Final Year Engineering Project)
-- Domain: Agentic AI & Intelligent Digital Twins
-- Target DB: PostgreSQL 15+
-- ============================================================================

-- Enable UUID extension for secure, distributed key generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast authentication lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- 2. EPISODIC CONVERSATION HISTORY (Turns & Thought Trails)
-- ============================================================================
CREATE TABLE IF NOT EXISTS episodic_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL, -- Logical groupings of conversations (chat session)
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant', 'system'
    message TEXT NOT NULL,
    thought_trail TEXT, -- The ReAct agentic reasoning steps (thoughts)
    tokens_used INT DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for rapid chronological retrieval of conversation context
CREATE INDEX IF NOT EXISTS idx_chats_user_session ON episodic_chats(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_chats_timestamp ON episodic_chats(timestamp ASC);

-- ============================================================================
-- 3. LONG-TERM SEMANTIC MEMORY & KNOWLEDGE RAG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS semantic_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'preference', 'fact', 'document_chunk', 'reflection'
    source VARCHAR(100) NOT NULL,   -- 'chat', 'document_upload', 'agent_consolidation'
    metadata JSONB, -- Dynamic key-value pairs (e.g. document title, page numbers)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for category-specific memory recalling & context indexing
CREATE INDEX IF NOT EXISTS idx_memories_user_category ON semantic_memories(user_id, category);
-- GIN Index for rapid keywords and metadata searches
CREATE INDEX IF NOT EXISTS idx_memories_metadata ON semantic_memories USING gin(metadata);
-- full text search index on content
CREATE INDEX IF NOT EXISTS idx_memories_content_fts ON semantic_memories USING gin(to_tsvector('english', content));

-- ============================================================================
-- 4. AUTONOMOUS TASK PLANNER TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS autonomous_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'
    steps_json JSONB NOT NULL DEFAULT '[]'::jsonb, -- Structured array of planned steps/pipelines
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for user task tracking
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON autonomous_tasks(user_id, status);

-- ============================================================================
-- 5. PERSONALIZED USER PREFERENCES (Learned Attributes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS learned_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pref_key VARCHAR(100) NOT NULL,
    pref_value TEXT NOT NULL,
    confidence_score NUMERIC(3, 2) NOT NULL DEFAULT 1.00, -- 0.00 to 1.00
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_pref_key UNIQUE (user_id, pref_key)
);

-- ============================================================================
-- AUTOMATION TRIGGERS FOR 'updated_at' COLUMNS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_tasks_modtime
    BEFORE UPDATE ON autonomous_tasks
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_preferences_modtime
    BEFORE UPDATE ON learned_preferences
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();
