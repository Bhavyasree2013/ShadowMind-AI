package com.example.data.database

import kotlinx.coroutines.flow.Flow

class MemoryRepository(private val db: AppDatabase) {
    private val memoryDao = db.memoryDao()
    private val episodicLogDao = db.episodicLogDao()
    private val taskDao = db.taskDao()
    private val preferenceDao = db.preferenceDao()

    // --- Memories ---
    val allMemories: Flow<List<MemoryEntity>> = memoryDao.getAllMemoriesFlow()

    suspend fun searchMemories(query: String): List<MemoryEntity> =
        memoryDao.searchMemories(query)

    suspend fun getMemoriesByCategory(category: String): List<MemoryEntity> =
        memoryDao.getMemoriesByCategory(category)

    suspend fun insertMemory(content: String, category: String, source: String) {
        memoryDao.insertMemory(
            MemoryEntity(
                content = content,
                category = category,
                source = source
            )
        )
    }

    suspend fun deleteMemory(id: Int) {
        memoryDao.deleteMemoryById(id)
    }

    suspend fun clearMemories() {
        memoryDao.clearAllMemories()
    }

    // --- Episodic History ---
    val allEpisodes: Flow<List<EpisodicLogEntity>> = episodicLogDao.getAllEpisodesFlow()

    suspend fun getRecentEpisodes(limit: Int): List<EpisodicLogEntity> =
        episodicLogDao.getRecentEpisodes(limit)

    suspend fun insertEpisode(role: String, message: String, thoughts: String) {
        episodicLogDao.insertEpisode(
            EpisodicLogEntity(
                role = role,
                message = message,
                thoughts = thoughts
            )
        )
    }

    suspend fun clearHistory() {
        episodicLogDao.clearHistory()
    }

    // --- Tasks ---
    val allTasks: Flow<List<TaskEntity>> = taskDao.getAllTasksFlow()

    suspend fun insertTask(title: String, description: String, status: String, stepsJson: String) {
        taskDao.insertTask(
            TaskEntity(
                title = title,
                description = description,
                status = status,
                stepsJson = stepsJson
            )
        )
    }

    suspend fun updateTaskStatus(id: Int, status: String) {
        taskDao.updateTaskStatus(id, status)
    }

    suspend fun deleteTask(id: Int) {
        taskDao.deleteTaskById(id)
    }

    suspend fun clearTasks() {
        taskDao.clearTasks()
    }

    // --- Preferences ---
    val allPreferences: Flow<List<PreferenceEntity>> = preferenceDao.getAllPreferencesFlow()

    suspend fun getAllPreferencesList(): List<PreferenceEntity> =
        preferenceDao.getAllPreferencesList()

    suspend fun savePreference(key: String, value: String, confidence: Float) {
        preferenceDao.savePreference(
            PreferenceEntity(
                key = key,
                value = value,
                confidence = confidence
            )
        )
    }

    suspend fun deletePreference(key: String) {
        preferenceDao.deletePreferenceByKey(key)
    }

    suspend fun clearPreferences() {
        preferenceDao.clearPreferences()
    }
}
