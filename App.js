import 'react-native-gesture-handler';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import {ThemeProvider} from './src/context/ThemeContext';
import {FontProvider} from './src/context/FontProvider';
import './src/localization/i18n';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <FontProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </FontProvider>
    </GestureHandlerRootView>
  );
}
