package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.agent.AgentExecutionState
import com.example.agent.ShadowMindAgent
import com.example.data.database.AppDatabase
import com.example.data.database.EpisodicLogEntity
import com.example.data.database.MemoryEntity
import com.example.data.database.MemoryRepository
import com.example.data.database.PreferenceEntity
import com.example.data.database.TaskEntity
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed class UiState {
    object Idle : UiState()
    object Reasoning : UiState()
    data class Success(val response: String, val thoughts: String, val toolUsed: String?, val toolResult: String?) : UiState()
    data class Error(val message: String) : UiState()
}

class ShadowMindViewModel(application: Application) : AndroidViewModel(application) {
    private val database = AppDatabase.getDatabase(application)
    val repository = MemoryRepository(database)
    private val agent = ShadowMindAgent(application, repository)

    // UI Input field state
    val userQuery = MutableStateFlow("")

    // Agent Processing State
    private val _agentState = MutableStateFlow<UiState>(UiState.Idle)
    val agentState: StateFlow<UiState> = _agentState.asStateFlow()

    // Flows observed from database
    val episodes: StateFlow<List<EpisodicLogEntity>> = repository.allEpisodes
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val memories: StateFlow<List<MemoryEntity>> = repository.allMemories
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val tasks: StateFlow<List<TaskEntity>> = repository.allTasks
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val preferences: StateFlow<List<PreferenceEntity>> = repository.allPreferences
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    init {
        // Pre-populate with a friendly introductory conversation or documentation help if empty!
        viewModelScope.launch {
            val count = repository.getRecentEpisodes(1).size
            if (count == 0) {
                repository.insertEpisode(
                    role = "assistant",
                    message = "Hello! I am ShadowMind AI, your intelligent Digital Twin. I can recall previous conversations, build a semantic knowledge base, plan multi-step tasks, and learn your preferences autonomously. How can I help you today?",
                    thoughts = "Initializing Agent State. Re-establishing episodic context. All modules (RAG, Task Scheduler, Preference Memory) are active."
                )
                // Add some initial memories to show off the system immediately
                repository.insertMemory("Digital Twin of User BHAVYA SREE PINDI", "fact", "initialization")
                repository.insertMemory("Development Team: Lumix Forge (B.Tech Final Year project)", "fact", "initialization")
                repository.insertMemory("Agent Architecture: ReAct (Reasoning and Acting) system powered by Gemini 3.5 Flash", "fact", "initialization")
            }
        }
    }

    /**
     * Sends the current query to the ShadowMind agentic core.
     */
    fun sendUserMessage() {
        val query = userQuery.value.trim()
        if (query.isEmpty()) return

        userQuery.value = ""
        _agentState.value = UiState.Reasoning

        viewModelScope.launch {
            // First log the user's message into episodic memory
            repository.insertEpisode("user", query, "")

            // Execute the agent
            when (val result = agent.execute(query)) {
                is AgentExecutionState.Success -> {
                    _agentState.value = UiState.Success(
                        response = result.finalResponse,
                        thoughts = result.thoughts,
                        toolUsed = result.toolUsed,
                        toolResult = result.toolResult
                    )
                }
                is AgentExecutionState.Error -> {
                    _agentState.value = UiState.Error(result.message)
                }
            }
        }
    }

    /**
     * Allows simulated manual document indexing (RAG)
     */
    fun indexDocument(title: String, content: String) {
        viewModelScope.launch {
            val formatted = "Document: $title\nContent: $content"
            repository.insertMemory(formatted, "document_chunk", "document_upload")
        }
    }

    /**
     * Manually updates a task status
     */
    fun updateTask(id: Int, status: String) {
        viewModelScope.launch {
            repository.updateTaskStatus(id, status)
        }
    }

    /**
     * Manually deletes a task
     */
    fun deleteTask(id: Int) {
        viewModelScope.launch {
            repository.deleteTask(id)
        }
    }

    /**
     * Clears all tables in the database (Database Reset)
     */
    fun resetDatabase() {
        viewModelScope.launch {
            repository.clearHistory()
            repository.clearMemories()
            repository.clearTasks()
            repository.clearPreferences()
            
            // Re-add default greeting
            repository.insertEpisode(
                role = "assistant",
                message = "Database reset complete. All long-term semantic memories, learned preferences, episodic logs, and autonomous tasks have been cleared. I am ready to start fresh as your Digital Twin!",
                thoughts = "Executing database clear tool. Memory registers zeroed out. Re-initializing base state."
            )
        }
    }
}
