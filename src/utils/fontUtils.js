/**
 * Font utilities for system fonts with optimal Arabic support
 * يوفر طرق سهلة لاستخدام خطوط النظام مع دعم محسن للعربية
 */

export const FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

/**
 * Get text style with system font and weight
 * @param {string} weight - Font weight (regular, medium, semiBold, bold)
 * @param {number} size - Font size
 * @param {string} color - Text color
 * @param {string} textAlign - Text alignment
 * @returns {object} Text style object
 */
export const getTextStyle = (
  weight = 'regular',
  size = 16,
  color = '#000',
  textAlign = 'left',
) => ({
  fontWeight: FontWeight[weight] || FontWeight.regular,
  fontSize: size,
  color,
  textAlign,
});

/**
 * Predefined text styles using system fonts
 */
export const TextStyles = {
  // Headers
  h1: (color = '#00623B') => getTextStyle('bold', 32, color, 'right'),
  h2: (color = '#00623B') => getTextStyle('bold', 28, color, 'right'),
  h3: (color = '#00623B') => getTextStyle('semiBold', 24, color, 'right'),
  h4: (color = '#00623B') => getTextStyle('semiBold', 20, color, 'right'),
  h5: (color = '#00623B') => getTextStyle('semiBold', 18, color, 'right'),
  h6: (color = '#00623B') => getTextStyle('medium', 16, color, 'right'),

  // Body text
  body1: (color = '#222') => getTextStyle('regular', 16, color, 'right'),
  body2: (color = '#222') => getTextStyle('regular', 14, color, 'right'),
  caption: (color = '#888') => getTextStyle('regular', 12, color, 'right'),

  // UI elements
  button: (color = '#fff') => getTextStyle('semiBold', 18, color, 'center'),
  buttonSmall: (color = '#fff') => getTextStyle('medium', 14, color, 'center'),
  label: (color = '#444') => getTextStyle('medium', 14, color, 'right'),

  // Navigation
  navLabel: (color = '#888') => getTextStyle('regular', 12, color, 'center'),
  tabLabel: (color = '#00623B') => getTextStyle('medium', 14, color, 'center'),

  // Forms
  inputLabel: (color = '#444') => getTextStyle('medium', 14, color, 'right'),
  inputText: (color = '#222') => getTextStyle('regular', 16, color, 'right'),
  inputPlaceholder: (color = '#888') =>
    getTextStyle('regular', 16, color, 'right'),
  inputError: (color = 'red') => getTextStyle('medium', 14, color, 'right'),

  // Status
  success: (color = '#00623B') => getTextStyle('medium', 14, color, 'right'),
  warning: (color = '#ff9500') => getTextStyle('medium', 14, color, 'right'),
  error: (color = 'red') => getTextStyle('medium', 14, color, 'right'),
};
