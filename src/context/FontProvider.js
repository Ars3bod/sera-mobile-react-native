import React, { createContext, useContext } from 'react';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
  // Font configuration - System fonts for consistent rendering
  // Note: Using system fonts (iOS: San Francisco, Android: Roboto) for React Native CLI projects
  const fontConfig = {
    fontsLoaded: true,
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
  };

  return (
    <FontContext.Provider value={fontConfig}>{children}</FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
