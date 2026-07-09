package com.example.data.database

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "memories")
data class MemoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val content: String,
    val category: String, // "preference", "fact", "document_chunk"
    val source: String,   // "chat", "document_upload", "agent_reflection"
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "episodes")
data class EpisodicLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val role: String,      // "user", "assistant"
    val message: String,
    val thoughts: String,  // The agentic thinking trail/reasoning steps leading to this message
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "tasks")
data class TaskEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val description: String,
    val status: String,    // "PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"
    val stepsJson: String, // JSON serialized list of steps (sub-tasks)
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "preferences")
data class PreferenceEntity(
    @PrimaryKey val key: String,
    val value: String,
    val confidence: Float, // Estimated confidence by agent (0.0 to 1.0)
    val timestamp: Long = System.currentTimeMillis()
)
