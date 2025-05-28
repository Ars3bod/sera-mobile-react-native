import React from 'react';
import {useHomeScreen} from '../context/HomeScreenContext';
import HomeScreen from '../screens/HomeScreen';
import HomeScreenNew from '../screens/HomeScreenNew';

const HomeScreenSelector = ({navigation}) => {
  const {useNewHomeScreen} = useHomeScreen();

  if (useNewHomeScreen) {
    return <HomeScreenNew navigation={navigation} />;
  }

  return <HomeScreen navigation={navigation} />;
};

export default HomeScreenSelector;
