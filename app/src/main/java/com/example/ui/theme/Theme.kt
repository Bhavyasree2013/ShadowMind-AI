package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = IndigoPrimary,
    secondary = EmeraldSuccess,
    tertiary = AmberWarning,
    background = DeepDarkBackground,
    surface = SurfaceSlate,
    onPrimary = TextWhite,
    onSecondary = TextDark,
    onTertiary = TextWhite,
    onBackground = TextWhite,
    onSurface = TextWhite,
    surfaceVariant = SurfaceCard,
    onSurfaceVariant = TextGray
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF00838F),
    secondary = Color(0xFF558B2F),
    tertiary = Color(0xFFC2185B),
    background = Color(0xFFF5F7FA),
    surface = Color.White,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = Color(0xFF1A2130),
    onSurface = Color(0xFF1A2130),
    surfaceVariant = Color(0xFFECEFF1),
    onSurfaceVariant = Color(0xFF37474F)
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = true, // Default to gorgeous dark mode for the digital twin!
    dynamicColor: Boolean = false, // Disable to preserve the custom brand identity
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
