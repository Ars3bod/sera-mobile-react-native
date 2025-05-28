import 'react-native-gesture-handler';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import {ThemeProvider} from './src/context/ThemeContext';
import {HomeScreenProvider} from './src/context/HomeScreenContext';
import {FontProvider} from './src/context/FontProvider';
import {UserProvider} from './src/context/UserContext';
import './src/localization/i18n';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <FontProvider>
        <ThemeProvider>
          <HomeScreenProvider>
            <UserProvider>
              <AppNavigator />
            </UserProvider>
          </HomeScreenProvider>
        </ThemeProvider>
      </FontProvider>
    </GestureHandlerRootView>
  );
}
