package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChatBubble
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Work
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import com.example.ui.ShadowMindViewModel
import com.example.ui.screens.AcademicScreen
import com.example.ui.screens.ChatScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.WorkspaceScreen
import com.example.ui.theme.MyApplicationTheme

enum class NavigationScreen {
    DASHBOARD, CHAT, WORKSPACE, ACADEMIC
}

class MainActivity : ComponentActivity() {
    private val viewModel: ShadowMindViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                ShadowMindApp(viewModel)
            }
        }
    }
}

@Composable
fun ShadowMindApp(viewModel: ShadowMindViewModel) {
    var currentScreen by remember { mutableStateOf(NavigationScreen.DASHBOARD) }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar(
                modifier = Modifier
                    .navigationBarsPadding()
                    .testTag("bottom_nav_bar"),
                containerColor = Color(0xFF0B101D), // Obsidian Slate Navy background
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.DASHBOARD,
                    onClick = { currentScreen = NavigationScreen.DASHBOARD },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Dashboard,
                            contentDescription = "Dashboard"
                        )
                    },
                    label = { Text("Hub") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFF6366F1), // Glowing Indigo
                        selectedTextColor = Color(0xFF6366F1),
                        unselectedIconColor = Color(0xFF94A3B8), // Sleek Slate Gray
                        unselectedTextColor = Color(0xFF94A3B8),
                        indicatorColor = Color(0xFF111827) // Surface Slate
                    ),
                    modifier = Modifier.testTag("nav_hub")
                )

                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.CHAT,
                    onClick = { currentScreen = NavigationScreen.CHAT },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.ChatBubble,
                            contentDescription = "ShadowMind Chat"
                        )
                    },
                    label = { Text("Twin") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFF6366F1),
                        selectedTextColor = Color(0xFF6366F1),
                        unselectedIconColor = Color(0xFF94A3B8),
                        unselectedTextColor = Color(0xFF94A3B8),
                        indicatorColor = Color(0xFF111827)
                    ),
                    modifier = Modifier.testTag("nav_twin")
                )

                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.WORKSPACE,
                    onClick = { currentScreen = NavigationScreen.WORKSPACE },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Work,
                            contentDescription = "Workspace"
                        )
                    },
                    label = { Text("Workspace") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFF6366F1),
                        selectedTextColor = Color(0xFF6366F1),
                        unselectedIconColor = Color(0xFF94A3B8),
                        unselectedTextColor = Color(0xFF94A3B8),
                        indicatorColor = Color(0xFF111827)
                    ),
                    modifier = Modifier.testTag("nav_workspace")
                )

                NavigationBarItem(
                    selected = currentScreen == NavigationScreen.ACADEMIC,
                    onClick = { currentScreen = NavigationScreen.ACADEMIC },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.School,
                            contentDescription = "Academic Guides"
                        )
                    },
                    label = { Text("Defense") },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color(0xFF6366F1),
                        selectedTextColor = Color(0xFF6366F1),
                        unselectedIconColor = Color(0xFF94A3B8),
                        unselectedTextColor = Color(0xFF94A3B8),
                        indicatorColor = Color(0xFF111827)
                    ),
                    modifier = Modifier.testTag("nav_defense")
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentScreen) {
                NavigationScreen.DASHBOARD -> DashboardScreen(viewModel = viewModel)
                NavigationScreen.CHAT -> ChatScreen(viewModel = viewModel)
                NavigationScreen.WORKSPACE -> WorkspaceScreen(viewModel = viewModel)
                NavigationScreen.ACADEMIC -> AcademicScreen(viewModel = viewModel)
            }
        }
    }
}
