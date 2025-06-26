import React from 'react';
import { useHomeScreen } from '../context/HomeScreenContext';
import { useUser } from '../context/UserContext';
import HomeScreen from '../screens/HomeScreen';
import ServicesScreen from '../screens/ServicesScreen';
import HomeScreenNew from '../screens/HomeScreenNew';

const HomeScreenSelector = ({ navigation }) => {
  const { useNewHomeScreen } = useHomeScreen();
  const { isAuthenticated, isGuestMode } = useUser();

  // If user is in guest mode, always use the old HomeScreen
  // if (isGuestMode && !isAuthenticated) {
  //   return <ServicesScreen navigation={navigation} />;
  // }

  // If user is authenticated, use HomeScreenNew regardless of config
  // if (isAuthenticated) {
  //   return <ServicesScreen navigation={navigation} />;
  // }

  // Default behavior based on config (for other cases)
  // if (useNewHomeScreen) {
  //   return <ServicesScreen navigation={navigation} />;
  // }

  return <ServicesScreen navigation={navigation} />;
};

export default HomeScreenSelector;
