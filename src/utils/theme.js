import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#667eea',
    secondary: '#764ba2',
    tertiary: '#f093fb',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.15)',
    surfaceVariant: 'rgba(255, 255, 255, 0.08)',
    backdrop: 'rgba(255, 255, 255, 0.25)',
    glassmorphic: {
      primary: 'rgba(255, 255, 255, 0.25)',
      secondary: 'rgba(255, 255, 255, 0.15)',
      border: 'rgba(255, 255, 255, 0.3)',
    },
    elevation: {
      level1: 'rgba(255, 255, 255, 0.1)',
      level2: 'rgba(255, 255, 255, 0.15)',
      level3: 'rgba(255, 255, 255, 0.2)',
    }
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#667eea',
    secondary: '#764ba2',
    tertiary: '#f093fb',
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    surface: 'rgba(255, 255, 255, 0.08)',
    surfaceVariant: 'rgba(255, 255, 255, 0.04)',
    backdrop: 'rgba(0, 0, 0, 0.3)',
    glassmorphic: {
      primary: 'rgba(255, 255, 255, 0.15)',
      secondary: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.2)',
    },
    elevation: {
      level1: 'rgba(255, 255, 255, 0.05)',
      level2: 'rgba(255, 255, 255, 0.08)',
      level3: 'rgba(255, 255, 255, 0.12)',
    }
  },
};
