import React, {createContext, useContext} from 'react';

// App Configuration - Change this to control which home screen to use
const APP_CONFIG = {
  useNewHomeScreen: true, // Set to true to use new home screen, false for old
};

const HomeScreenContext = createContext();

export const HomeScreenProvider = ({children}) => {
  // Use app configuration instead of user preference
  const useNewHomeScreen = APP_CONFIG.useNewHomeScreen;
  const isLoading = false; // No loading since it's a static config

  const value = {
    useNewHomeScreen,
    isLoading,
  };

  return (
    <HomeScreenContext.Provider value={value}>
      {children}
    </HomeScreenContext.Provider>
  );
};

export const useHomeScreen = () => {
  const context = useContext(HomeScreenContext);
  if (!context) {
    throw new Error('useHomeScreen must be used within a HomeScreenProvider');
  }
  return context;
};
