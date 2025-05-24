import React, {createContext, useContext} from 'react';

const FontContext = createContext();

export const FontProvider = ({children}) => {
  // بدلاً من تحميل خطوط مخصصة، سنستخدم خطوط النظام المحسنة
  const fontConfig = {
    fontsLoaded: true,
    fontFamily: {
      // iOS يستخدم San Francisco مع دعم عربي ممتاز
      // Android يستخدم Roboto مع دعم عربي جيد
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
