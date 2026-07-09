package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.unit.sp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoStories
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.ui.ShadowMindViewModel

@Composable
fun AcademicScreen(
    viewModel: ShadowMindViewModel,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf("Project Specification", "Viva Q&A Hub")

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = Color.White,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                    color = MaterialTheme.colorScheme.primary
                )
            }
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Medium,
                            color = if (selectedTab == index) MaterialTheme.colorScheme.primary else Color.Gray
                        )
                    }
                )
            }
        }

        when (selectedTab) {
            0 -> ProjectSpecsTab()
            1 -> VivaQaTab()
        }
    }
}

@Composable
fun ProjectSpecsTab() {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "B.Tech Final Year Thesis Project Specs",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Text(
                text = "Official Academic Guidelines for the Lumix Forge Defense Panel",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        item {
            SpecSectionCard(
                title = "1. Project Metadata",
                content = """
                    • Project Title: ShadowMind AI: An Agentic AI-Powered Digital Twin for Intelligent Memory and Autonomous Personal Assistance
                    • Team Name: Lumix Forge (4-Student Core Engineering Team)
                    • Domain: Artificial Intelligence & System Design
                    • Sub-Domain: Agentic AI, Autonomous Reasoning Systems (ReAct), and Local RAG
                """.trimIndent()
            )
        }

        item {
            SpecSectionCard(
                title = "2. System Architecture & Flows",
                content = """
                    • Layer 1 (UI Viewport): Jetpack Compose declarative single-activity mobile application with high-density telemetry widgets.
                    • Layer 2 (State Machine & Logic): Jetpack ViewModel exposing reactive Flows, managing thread switches via Kotlin Coroutines.
                    • Layer 3 (Agent Reasoning Engine): ReAct loop (Reasoning & Acting) powered by Gemini 3.5 Flash; dynamically handles tool calls and extracts user attributes.
                    • Layer 4 (Cognitive Storage Fabric): SQLite on-device database managed by Room ORM. Coordinates:
                      - Episodic Logs (Conversation backstack)
                      - Semantic Memories (Document segments & indexing)
                      - Preference registries (Learned key-values)
                      - Autonomous Task structures.
                """.trimIndent()
            )
        }

        item {
            SpecSectionCard(
                title = "3. Software Requirements Specification (SRS)",
                content = """
                    • Functional Requirements:
                      - SRS-FR-01 (Authentication): Simulated JWT local session matching student profiles.
                      - SRS-FR-02 (Episodic Recall): Preserves previous conversation history.
                      - SRS-FR-03 (Semantic Preference Learning): Extracts user habits and attributes implicitly during dialogue.
                      - SRS-FR-04 (Autonomous Task Planner): Deconstructs high-level goals into multi-step pipelines.
                      - SRS-FR-05 (RAG pipeline): Indexing of text document segments in Room SQL tables for context search injection.
                      - SRS-FR-06 (On-device tool execution): Formulates structured tool definitions, routes calls, and returns execution feedback.
                    
                    • Non-Functional Requirements:
                      - SRS-NFR-01 (Offline First): Cognitive memory indices, tasks, and learned states operate entirely offline, syncing queries with Gemini.
                      - SRS-NFR-02 (Low Latency): Thread safe non-blocking asynchronous coroutines execution (<100ms local overhead).
                      - SRS-NFR-03 (UI Ergonomics): Adheres strictly to Material 3 responsive specifications with custom canvas shaders.
                """.trimIndent()
            )
        }

        item {
            SpecSectionCard(
                title = "4. RAG Pipeline & Prompt Strategy",
                content = """
                    • Document Ingestion: Text documents are broken down, formatted with metadata, and committed to SQLite indices.
                    • Keyword RAG Match: Queries perform deep keyword and containment lookups in SQL index tables, fetching context chunks with high temporal correlation.
                    • Prompt Strategy: Employs standard ReAct prompting containing system rules, current environment specs, learned preferences, recalled RAG memories, and recent episodic turns.
                    • XML Tag Boundaries: Enforces strict <thought> and <final_response> containment, ensuring robust native parsing in the JVM.
                """.trimIndent()
            )
        }
        
        item {
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
fun SpecSectionCard(title: String, content: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = content,
                style = MaterialTheme.typography.bodySmall,
                color = Color.White,
                lineHeight = 18.sp
            )
        }
    }
}

data class VivaQuestion(
    val id: Int,
    val question: String,
    val answer: String
)

@Composable
fun VivaQaTab() {
    val questions = remember {
        listOf(
            VivaQuestion(
                1,
                "What is Agentic AI and how does it differ from traditional Generative AI?",
                "Traditional Generative AI is passive and response-driven: you provide a prompt, and it returns static output. Agentic AI is goal-driven and proactive. It possesses autonomy, planning capabilities, tools usage, and reflection loops. It breaks down a complex goal into steps, decides which tools to call, inspects execution feedback, and adjusts its action plan dynamically."
            ),
            VivaQuestion(
                2,
                "Explain the ReAct paradigm used in ShadowMind AI.",
                "ReAct stands for 'Reasoning and Acting'. It is an agentic design pattern where the model is prompted to alternate between generating its reasoning trail (Thought) and calling native functions (Action). The result of the action (Observation) is fed back into the model, prompting the next cycle of thought until a final solution is formulated."
            ),
            VivaQuestion(
                3,
                "How is 'Long-Term Memory' modeled in your SQLite/Room architecture?",
                "We partition long-term memory into three distinct subsystems:\n1. Episodic Memory: Stored in the 'episodes' table as conversation turns with corresponding thought logs, establishing dialog history.\n2. Semantic Memory / Knowledge: Stored in 'memories', representing explicit facts and segmented document chunks.\n3. Procedural Memory / Preferences: Stored in the 'preferences' table, mapping learned user profiles (e.g. favorite topics, habits) with associated agent confidence metrics."
            ),
            VivaQuestion(
                4,
                "How does the Retrieval-Augmented Generation (RAG) pipeline operate here?",
                "The user indexes text documents which are committed into our Room database. When a query is initiated, the repository performs a fast search on SQL indices. Matching chunks are retrieved and injected as context alongside the system prompt, allowing the agent to formulate context-aware answers without needing to fine-tune the model."
            ),
            VivaQuestion(
                5,
                "What safety and scalability considerations exist for storing API keys on mobile clients?",
                "APKs are subject to reverse engineering and decompilation. For this prototype, we secure API keys inside the Gradle Secrets Plugin which injects them from .env at compile time, never committing credentials into git. In production, we would use a proxy backend service (like Firebase AI App Check) to authenticate clients before calling external model endpoints."
            ),
            VivaQuestion(
                6,
                "How is tool calling parsed on the mobile client?",
                "We prompt the Gemini model to output tool execution requests in a clean, robust XML tag system (e.g. <call_tool name='create_task' args='...' />). On-device, the JVM parses the tags using highly optimized regular expressions, executes the corresponding Kotlin function locally (e.g. database inserts), and routes the execution results seamlessly."
            ),
            VivaQuestion(
                7,
                "Why did you choose Kotlin Coroutines and Jetpack Compose for the mobile platform?",
                "Jetpack Compose provides a declarative UI model which reactively binds to state flows exposed by the ViewModel, avoiding stale views. Kotlin Coroutines handle background execution (API network requests and Room database writing) asynchronously without freezing the UI thread, ensuring optimal performance."
            ),
            VivaQuestion(
                8,
                "What is the role of ChromaDB and PostgreSQL in your larger architectural blueprint?",
                "In our production blueprint, Postgres serves as our centralized multi-tenant relational system for secure user authorization and relational entities, while ChromaDB serves as the cloud vector database for dense embedding indexing (semantic vector search). For this portable demo, we built a local Room SQLite RAG equivalent to make the client 100% self-contained and demonstratable."
            )
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = "Viva Defense Preparation Hub",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Text(
                text = "Interactive flashcards containing high-yield final year viva questions and model answers.",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        items(questions) { q ->
            VivaQuestionItemCard(q = q)
        }
        
        item {
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
fun VivaQuestionItemCard(q: VivaQuestion) {
    var isExpanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { isExpanded = !isExpanded }
            .border(
                1.dp,
                if (isExpanded) MaterialTheme.colorScheme.primary.copy(alpha = 0.5f) else Color.Transparent,
                RoundedCornerShape(12.dp)
            ),
        colors = CardDefaults.cardColors(
            containerColor = if (isExpanded) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.surface
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.School,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.secondary,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Q${q.id}: ${q.question}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
                Icon(
                    imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = Color.Gray,
                    modifier = Modifier.size(20.dp)
                )
            }

            AnimatedVisibility(visible = isExpanded) {
                Column(modifier = Modifier.padding(top = 12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.MenuBook,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "DEFENSE MODEL ANSWER",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = q.answer,
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.White,
                        lineHeight = 16.sp
                    )
                }
            }
        }
    }
}
