# ShadowMind AI: Academic Thesis & System Design Document
**Project Title**: ShadowMind AI: An Agentic AI-Powered Digital Twin for Intelligent Memory and Autonomous Personal Assistance  
**Team Name**: Lumix Forge  
**Sub-Domain**: Agentic AI & Cognitive Mobile Environments  

---

## 1. Executive Project Summary
Traditional conversational interfaces are stateless, reactive, and lack personal context. To transition from basic Generative Q&A to true cognitive automation, **ShadowMind AI** introduces an agentic, offline-first "Digital Twin" client. Operating on the device, it dynamically tracks daily episodic interactions, captures semantic preferences implicitly, acts as an autonomous multi-step planner, and indexes research material into a local Retrieval-Augmented Generation (RAG) structure.

---

## 2. Software Requirements Specification (SRS)

### 2.1 Functional Requirements
1. **JWT Local Session Emulation (SRS-FR-01)**: Simulated cryptographic tokens for Lumix Forge team members to demonstrate access security.
2. **Episodic Conversation Recall (SRS-FR-02)**: Real-time serialization and persistent logging of every user query alongside the corresponding model response.
3. **Implicit Preference Learning (SRS-FR-03)**: Dynamic reflection loops analyzing input syntax for preference extraction (e.g., likes, habits) and updating a high-confidence local database register.
4. **Autonomous Goal Deconstruction (SRS-FR-04)**: High-level instructions (e.g. "Prepare my project thesis schedule") are parsed by the agent into detailed multi-step task lists with distinct sub-steps.
5. **On-Device RAG Indexing (SRS-FR-05)**: Allows direct ingestion of research papers, text summaries, or lecture materials, fragmenting them into searchable context blocks.
6. **Structured XML ReAct Tool Calling (SRS-FR-06)**: Uses XML tag enclosures (`<thought>`, `<call_tool>`, `<final_response>`) to enable precise native parsing, tool execution, and response routing.

### 2.2 Non-Functional Requirements
1. **Offline-First Cognitive Continuity (SRS-NFR-01)**: Core memory indexes, task schedules, and preferences reside fully offline in standard SQLite via Android Room ORM.
2. **Thread-Safe Low Latency (SRS-NFR-02)**: Database writes and Gemini network transactions execute asynchronously on separate virtual background thread pools via Kotlin Coroutines.
3. **Material Design 3 Ergonomics (SRS-NFR-03)**: Highly intuitive mobile layout with Electric Cyan, Obsidian Slate, and Neon Lime gradients; integrates a rotating neural canvas telemetry shader.

---

## 3. High-Fidelity System Architecture

```
   +-------------------------------------------------------------+
   |                       Jetpack Compose UI                    |
   |   (Hub Dashboard, ReAct Chat, Tasks Space, Defense Academy) |
   +------------------------------+------------------------------+
                                  | Observes Flows
                                  v
   +-------------------------------------------------------------+
   |                       ShadowMindViewModel                   |
   |              (State Flows, Ingestion, Event Handlers)       |
   +------------------------------+------------------------------+
                                  | Invokes
                                  v
   +-------------------------------------------------------------+
   |                        ShadowMindAgent                      |
   |      (ReAct Engine, XML Parser, Memory Extractions, RAG)     |
   +---------------+--------------+--------------+---------------+
                   |              |              |
     Calls API     v              v Saves Local  v
   +---------------+----+   +-----+--------------+---------------+
   |   Gemini 3.5  |   |   |        Local Room SQLite DB       |
   |   REST Engine |   |   |   (Memories, Tasks, Preferences)  |
   +--------------------+   +------------------------------------+
```

---

## 4. Agentic ReAct (Reasoning and Acting) Workflow

The core executor employs the **Reason-Act-Observe** cycle:
1. **User Request**: User sends a high-level goal or query.
2. **RAG Injection**: Local Room database executes a keyword search across semantic memory tables, retrieving matches alongside user preferences.
3. **LLM Synthesis**: The model processes the aggregated prompt and outputs tags:
   - `<thought>`: Step-by-step reasoning chain explaining goals.
   - `<call_tool>`: Direct command indicating tool name and structured arguments.
4. **Execution**: The client parses the XML tag, triggers the target Kotlin local function (e.g. database insert), gathers the feedback, and feeds the output back into the model to complete the loop.
5. **Final Output**: The agent delivers the finalized `<final_response>` block, rendering the execution trail in real-time.

---

## 5. Room Database Schema Design (ER)

- **`memories` table**:
  - `id` (INTEGER, PrimaryKey, AutoGenerate)
  - `content` (TEXT)
  - `category` (TEXT) - e.g., "fact", "document_chunk", "preference"
  - `source` (TEXT) - e.g., "chat", "document_upload"
  - `timestamp` (INTEGER)

- **`episodes` table**:
  - `id` (INTEGER, PrimaryKey, AutoGenerate)
  - `role` (TEXT) - "user" or "assistant"
  - `message` (TEXT)
  - `thoughts` (TEXT) - Raw reasoning trail from `<thought>`

- **`tasks` table**:
  - `id` (INTEGER, PrimaryKey, AutoGenerate)
  - `title` (TEXT)
  - `description` (TEXT)
  - `status` (TEXT) - "PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"
  - `stepsJson` (TEXT) - JSON-encoded list of sub-steps

- **`preferences` table**:
  - `key` (TEXT, PrimaryKey)
  - `value` (TEXT)
  - `confidence` (REAL)
  - `timestamp` (INTEGER)

---

## 5.1 Production PostgreSQL Database Schema (Distributed Architecture)

While the mobile application leverages an offline-first SQLite/Room structure, the production backend coordinates using a robust **PostgreSQL schema** to support multi-client syncing, user session telemetry, and heavy vector embeddings indexes. 

The complete, production-grade schema is available in `/postgres_schema.sql` and includes:
1. **`users`**: Secure UUID-keyed student/user profiles.
2. **`episodic_chats`**: Session-partitioned conversation logs tracking thoughts and usage.
3. **`semantic_memories`**: GIN-indexed knowledge bases and document segment registers.
4. **`autonomous_tasks`**: Multi-agent step registers storing structured pipelines.
5. **`learned_preferences`**: Key-value profiles mapping cognitive traits.

---

## 6. Testing & Deployment Strategy

### 6.1 Testing Suite
- **Unit Testing**: Standard JUnit tests verifying that database repositories, entity mappings, and utility classes initialize correctly.
- **State Machine Verification**: Robolectric tests verifying that ViewModel flows react correctly to sending user messages and indexing mock documents.
- **Integration Validation**: Retrofit mock tests verifying that request structures match Gemini API's official schema specifications.

### 6.2 Deployment Pipeline
1. **Compile & Package**: Execute `./gradlew assembleDebug` in standard Linux environments to compile class structures and package resources into APK format.
2. **Device Execution**: Install directly via physical debug connection or launch inside the Google AI Studio streaming emulator sandbox for immediate live validation.
