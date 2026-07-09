package com.example.agent

import android.content.Context
import android.util.Log
import com.example.BuildConfig
import com.example.data.api.Content
import com.example.data.api.GenerateContentRequest
import com.example.data.api.GenerationConfig
import com.example.data.api.Part
import com.example.data.api.RetrofitClient
import com.example.data.database.MemoryRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

sealed class AgentExecutionState {
    data class Success(
        val finalResponse: String,
        val thoughts: String,
        val toolUsed: String? = null,
        val toolResult: String? = null
    ) : AgentExecutionState()
    data class Error(val message: String) : AgentExecutionState()
}

class ShadowMindAgent(
    private val context: Context,
    private val repository: MemoryRepository
) {
    private val apiKey = BuildConfig.GEMINI_API_KEY

    companion object {
        private const val TAG = "ShadowMindAgent"
    }

    /**
     * Executes the Agentic Reasoning Loop (ReAct paradigm).
     * 1. Retrieve local context (Episodic memory, learned preferences, RAG facts).
     * 2. Build system instruction & prompt.
     * 3. Send to Gemini.
     * 4. Parse thoughts, tool calls, or final response.
     * 5. Execute tools locally on-device and integrate results.
     * 6. Perform memory consolidation (Reflection loop).
     */
    suspend fun execute(userMessage: String): AgentExecutionState = withContext(Dispatchers.IO) {
        try {
            if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
                return@withContext AgentExecutionState.Error(
                    "Gemini API key is not configured. Please add your GEMINI_API_KEY in the AI Studio Secrets panel."
                )
            }

            // 1. Context Retrieval (Semantic & Preference RAG)
            val preferences = repository.getAllPreferencesList()
            val prefContext = preferences.joinToString("\n") { "- ${it.key}: ${it.value} (Confidence: ${it.confidence})" }

            // Semantic Memory Match (RAG)
            val matchingMemories = repository.searchMemories(userMessage)
            val memoryContext = if (matchingMemories.isNotEmpty()) {
                matchingMemories.joinToString("\n") { "- [Source: ${it.source}, Cat: ${it.category}]: ${it.content}" }
            } else {
                "No previous matching memories found."
            }

            // Recent Conversation History (Episodic)
            val recentEpisodes = repository.getRecentEpisodes(6).reversed()
            val historyContext = recentEpisodes.joinToString("\n") { "${it.role.uppercase()}: ${it.message}" }

            // Device Context (Sensors/System Info)
            val deviceStatus = getDeviceStatusString()

            // 2. Build System Instructions and Contextual Prompt
            val systemInstructions = """
                You are ShadowMind AI, an advanced Agentic Digital Twin and Autonomous Personal Assistant created by the "Lumix Forge" engineering team.
                Your purpose is to assist the user by remembering their preferences, managing their tasks, retrieving factual knowledge, and reasoning step-by-step.
                
                You operate under a strict ReAct (Reasoning and Acting) loop. You must express your thoughts, call tools when necessary, and provide your final response using precise XML tags:
                
                <thought>
                Write your step-by-step reasoning here. Be transparent about your goals, what memories you are looking up, what preferences you are considering, and why you are calling a tool or what you plan to answer.
                </thought>
                
                If you need to execute a tool, include the <call_tool> tag immediately after your thoughts:
                <call_tool name="TOOL_NAME" args="TOOL_ARGS" />
                
                Available Tools on-device:
                1. name="create_task" args="{'title': 'Task Title', 'description': 'Task details...', 'steps': ['Step 1', 'Step 2']}"
                   - Use this to schedule multi-step tasks or goals mentioned by the user in your database.
                2. name="save_preference" args="{'key': 'user_preference_key', 'value': 'value_content', 'confidence': 1.0}"
                   - Use this to explicitly register a learned user preference or profile setting (e.g., coding style, favorite drink, wake-up time).
                3. name="search_knowledge_base" args="{'query': 'search terms'}"
                   - Use this to query historical facts or uploaded document knowledge stored locally.
                   
                If you do not need to call any tools, or after you have completed reasoning, provide your final friendly response using:
                <final_response>
                Your final answer or assistance message to the user goes here. Be professional, friendly, and act as their intellectual digital twin.
                </final_response>
                
                IMPORTANT: You must always wrap your reasoning in <thought></thought> and your final output in <final_response></final_response>.
            """.trimIndent()

            val currentPrompt = """
                === ENVIRONMENT STATUS ===
                $deviceStatus
                
                === LEARNED USER PREFERENCES ===
                $prefContext
                
                === RECALLED SEMANTIC MEMORIES ===
                $memoryContext
                
                === RECENT CONVERSATION HISTORY ===
                $historyContext
                
                === USER CURRENT REQUEST ===
                $userMessage
                
                Execute your reasoning cycle now.
            """.trimIndent()

            // 3. Make API request to Gemini
            val request = GenerateContentRequest(
                contents = listOf(Content(parts = listOf(Part(text = currentPrompt)))),
                systemInstruction = Content(parts = listOf(Part(text = systemInstructions))),
                generationConfig = GenerationConfig(temperature = 0.5f)
            )

            val response = RetrofitClient.service.generateContent(apiKey, request)
            val rawResponse = response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
                ?: return@withContext AgentExecutionState.Error("Received empty response from Gemini API.")

            Log.d(TAG, "Raw Response: $rawResponse")

            // 4. Parse XML Tags
            val thoughts = parseTag(rawResponse, "thought") ?: "Reasoning autonomously..."
            val finalResponse = parseTag(rawResponse, "final_response") ?: rawResponse
            val toolCallJson = parseTag(rawResponse, "call_tool")

            var toolUsed: String? = null
            var toolResult: String? = null

            // 5. Tool Call Execution
            if (toolCallJson != null || rawResponse.contains("<call_tool")) {
                try {
                    // Try parsing attributes from <call_tool name="..." args="..." />
                    val nameMatch = Regex("""name="([^"]+)"""").find(rawResponse)
                    val argsMatch = Regex("""args="([^"]+)"""").find(rawResponse)
                    
                    if (nameMatch != null) {
                        val toolName = nameMatch.groupValues[1]
                        val toolArgsStr = argsMatch?.groupValues?.get(1)?.replace('\'', '"') ?: "{}"
                        
                        toolUsed = toolName
                        val argsObj = JSONObject(toolArgsStr)

                        when (toolName) {
                            "create_task" -> {
                                val title = argsObj.optString("title", "Autonomous Task")
                                val desc = argsObj.optString("description", "")
                                val stepsArray = argsObj.optJSONArray("steps")
                                val stepsList = mutableListOf<String>()
                                if (stepsArray != null) {
                                    for (i in 0 until stepsArray.length()) {
                                        stepsList.add(stepsArray.getString(i))
                                    }
                                }
                                val stepsJson = JSONArray(stepsList).toString()
                                repository.insertTask(title, desc, "PENDING", stepsJson)
                                toolResult = "Successfully created autonomous task: '$title' with ${stepsList.size} steps."
                            }
                            "save_preference" -> {
                                val key = argsObj.optString("key", "")
                                val value = argsObj.optString("value", "")
                                val confidence = argsObj.optDouble("confidence", 1.0).toFloat()
                                if (key.isNotEmpty()) {
                                    repository.savePreference(key, value, confidence)
                                    // Also save as memory
                                    repository.insertMemory("Learned preference: $key = $value", "preference", "agent_reflection")
                                    toolResult = "Saved preference: '$key' -> '$value'."
                                } else {
                                    toolResult = "Failed to save preference: Key was empty."
                                }
                            }
                            "search_knowledge_base" -> {
                                val query = argsObj.optString("query", "")
                                val results = repository.searchMemories(query)
                                toolResult = if (results.isNotEmpty()) {
                                    results.joinToString("; ") { it.content }
                                } else {
                                    "No matching records found in local knowledge base."
                                }
                            }
                            else -> {
                                toolResult = "Tool '$toolName' is registered but execution path was not found."
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error executing tool", e)
                    toolResult = "Error executing tool: ${e.message}"
                }
            }

            // 6. Reflection & Implicit Learning Loop
            // Check if the conversation implies any preference that wasn't explicitly saved
            consolidateMemoryInBackground(userMessage, finalResponse)

            // 7. Insert this episode (turn) into the database for context continuity
            repository.insertEpisode("user", userMessage, "")
            repository.insertEpisode("assistant", finalResponse, thoughts)

            return@withContext AgentExecutionState.Success(
                finalResponse = finalResponse,
                thoughts = thoughts,
                toolUsed = toolUsed,
                toolResult = toolResult
            )

        } catch (e: Exception) {
            Log.e(TAG, "Error in agent execute", e)
            return@withContext AgentExecutionState.Error("Agent execution failed: ${e.message}")
        }
    }

    private fun parseTag(text: String, tag: String): String? {
        val startTag = "<$tag"
        val endTag = "</$tag>"
        if (!text.contains(startTag)) return null
        
        return if (tag == "call_tool") {
            // For call_tool, it might be a self-closing tag like <call_tool name="..." />
            val startIndex = text.indexOf(startTag)
            val endIndex = text.indexOf("/>", startIndex)
            if (endIndex != -1) {
                text.substring(startIndex, endIndex + 2)
            } else {
                null
            }
        } else {
            val startIndex = text.indexOf(startTag)
            val contentStartIndex = text.indexOf(">", startIndex) + 1
            val endIndex = text.indexOf(endTag, contentStartIndex)
            if (endIndex != -1 && contentStartIndex != -1) {
                text.substring(contentStartIndex, endIndex).trim()
            } else {
                null
            }
        }
    }

    private fun getDeviceStatusString(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        val dateStr = sdf.format(Date())
        return """
            - Current System Time: $dateStr
            - Environment: Android OS Mobile Application
            - Runtime Platform: Google AI Studio Client Container
            - Architecture Pattern: Local Room DB + Agentic Reasoning Model
        """.trimIndent()
    }

    /**
     * Extracts and consolidates preferences/facts in the background.
     * Keeps ShadowMind learning from every conversation!
     */
    private suspend fun consolidateMemoryInBackground(userMsg: String, assistantMsg: String) {
        try {
            // Simple rule-based extraction for B.Tech demonstration speed,
            // or we can invoke a small prompt, but rule-based ensures 100% offline stability & zero latency!
            val lowerMsg = userMsg.lowercase()
            if (lowerMsg.contains("i like ") || lowerMsg.contains("my favorite") || lowerMsg.contains("i prefer")) {
                // Extract matching preference
                val extractedPref = when {
                    lowerMsg.contains("i like coding in ") || lowerMsg.contains("my favorite language is ") -> {
                        val lang = userMsg.substringAfter("coding in ").substringBefore(" ").substringBefore(".")
                        "preferred_language" to lang
                    }
                    lowerMsg.contains("i like ") -> {
                        val item = userMsg.substringAfter("i like ").trim().removeSuffix(".")
                        "likes" to item
                    }
                    lowerMsg.contains("my favorite ") -> {
                        val fav = userMsg.substringAfter("my favorite ").trim().removeSuffix(".")
                        "favorite_$fav" to "true"
                    }
                    else -> null
                }
                
                extractedPref?.let { (key, value) ->
                    if (key.isNotEmpty() && value.isNotEmpty()) {
                        repository.savePreference(key, value, 0.9f)
                        repository.insertMemory("Implicitly learned user preference: $key is $value", "preference", "agent_reflection")
                    }
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error in memory consolidation", e)
        }
    }
}
