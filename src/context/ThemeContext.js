import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Define color schemes
const lightTheme = {
  mode: 'light',
  colors: {
    // Primary colors
    primary: '#00623B',
    primaryLight: '#00623B20',
    primaryDark: '#004829',

    // Background colors
    background: '#f8f9fa',
    surface: '#ffffff',
    card: '#ffffff',

    // Text colors
    text: '#2c3e50',
    textSecondary: '#6c757d',
    textInverse: '#ffffff',

    // Border colors
    border: '#e9ecef',
    borderLight: '#f1f3f4',

    // Status colors
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',

    // Shadow
    shadow: '#000000',

    // Icon colors
    icon: '#6c757d',
    iconActive: '#00623B',

    // Input colors
    inputBackground: '#ffffff',
    inputBorder: '#e9ecef',
    inputText: '#2c3e50',
    placeholder: '#6c757d',
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    // Primary colors
    primary: '#00A876',
    primaryLight: '#00A87620',
    primaryDark: '#007A57',

    // Background colors
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2D2D2D',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textInverse: '#000000',

    // Border colors
    border: '#404040',
    borderLight: '#2D2D2D',

    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Shadow
    shadow: '#000000',

    // Icon colors
    icon: '#B0B0B0',
    iconActive: '#00A876',

    // Input colors
    inputBackground: '#2D2D2D',
    inputBorder: '#404040',
    inputText: '#FFFFFF',
    placeholder: '#B0B0B0',
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 5,
    },
  },
};

const THEME_STORAGE_KEY = '@sera_theme_mode';

export const ThemeProvider = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage
  useEffect(() => {
    loadThemeFromStorage();
  }, []);

  const loadThemeFromStorage = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        newTheme ? 'dark' : 'light',
      );
    } catch (error) {
      console.log('Error saving theme to storage:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
