import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Easing} from 'react-native-reanimated';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import NafathLoginScreen from '../screens/NafathLoginScreen';
import NafathVerificationScreen from '../screens/NafathVerificationScreen';

const Stack = createNativeStackNavigator();

// Custom transition config
const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  animationDuration: 300,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={screenOptions}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: 'fade',
            animationDuration: 500,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animation: 'slide_from_bottom',
            animationDuration: 400,
          }}
        />
        <Stack.Screen
          name="NafathLogin"
          component={NafathLoginScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="NafathVerification"
          component={NafathVerificationScreen}
          options={{
            animation: 'slide_from_right',
            gestureEnabled: false, // Prevent going back during verification
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animation: 'fade',
            animationDuration: 500,
            gestureEnabled: false, // Prevent going back to login
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
