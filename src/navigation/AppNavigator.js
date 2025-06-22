import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Easing } from 'react-native-reanimated';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreenSelector from '../components/HomeScreenSelector';
import NafathLoginScreen from '../screens/NafathLoginScreen';
import NafathVerificationScreen from '../screens/NafathVerificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ServicesScreen from '../screens/ServicesScreen';
import MoreScreen from '../screens/MoreScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import NewsScreen from '../screens/NewsScreen';
import PoliciesScreen from '../screens/PoliciesScreen';
import FAQScreen from '../screens/FAQScreen';
import ImportantLinksScreen from '../screens/ImportantLinksScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import CreateComplaintScreen from '../screens/CreateComplaintScreen';
import ViewComplaintsScreen from '../screens/ViewComplaintsScreen';
import PermitsScreen from '../screens/PermitsScreen';
import ViewPermitsScreen from '../screens/ViewPermitsScreen';
import CreatePowerGenerationPermitScreen from '../screens/CreatePowerGenerationPermitScreen';
import CreateDistrictCoolingPermitScreen from '../screens/CreateDistrictCoolingPermitScreen';
import UsagePolicyScreen from '../screens/UsagePolicyScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import DataProtectionScreen from '../screens/DataProtectionScreen';
import CookiePolicyScreen from '../screens/CookiePolicyScreen';
import CompensationStandardsScreen from '../screens/CompensationStandardsScreen';

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
          component={HomeScreenSelector}
          options={{
            animation: 'fade',
            animationDuration: 500,
            gestureEnabled: false, // Prevent going back to login
          }}
        />
        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="More"
          component={MoreScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="News"
          component={NewsScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="Policies"
          component={PoliciesScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="FAQ"
          component={FAQScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="ImportantLinks"
          component={ImportantLinksScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="CompensationStandards"
          component={CompensationStandardsScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="Complaints"
          component={ComplaintsScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="CreateComplaint"
          component={CreateComplaintScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="ViewComplaints"
          component={ViewComplaintsScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="Permits"
          component={PermitsScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="ViewPermits"
          component={ViewPermitsScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="CreatePowerGenerationPermit"
          component={CreatePowerGenerationPermitScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="CreateDistrictCoolingPermit"
          component={CreateDistrictCoolingPermitScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="UsagePolicy"
          component={UsagePolicyScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="DataProtection"
          component={DataProtectionScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="CookiePolicy"
          component={CookiePolicyScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 300,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
