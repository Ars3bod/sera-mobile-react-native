import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { HomeScreenProvider } from './src/context/HomeScreenContext';
import { FontProvider } from './src/context/FontProvider';
import { UserProvider } from './src/context/UserContext';
import { SessionProvider } from './src/context/SessionManager';
import './src/localization/i18n';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontProvider>
        <ThemeProvider>
          <HomeScreenProvider>
            <UserProvider>
              <NavigationContainer>
                <SessionProvider>
                  <AppNavigator />
                </SessionProvider>
              </NavigationContainer>
            </UserProvider>
          </HomeScreenProvider>
        </ThemeProvider>
      </FontProvider>
    </GestureHandlerRootView>
  );
}
