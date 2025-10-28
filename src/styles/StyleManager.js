import { StyleSheet, I18nManager } from 'react-native';

class StyleManager {
  static instance = null;

  constructor() {
    if (StyleManager.instance) {
      return StyleManager.instance;
    }

    // Color palette
    this.colors = {
      primary: '#00623B',
      primaryLight: '#E6F4EA',
      secondary: '#1a2233',
      background: '#fff',
      surface: '#f8f8f8',
      text: {
        primary: '#222',
        secondary: '#444',
        muted: '#888',
        light: '#bbb',
        white: '#fff',
      },
      border: {
        light: '#eee',
        medium: '#ccc',
        dark: '#ddd',
      },
      status: {
        error: 'red',
        success: '#00623B',
        warning: '#ff9500',
      },
    };

    // Typography - Using system fonts for React Native CLI
    this.typography = {
      fontFamily: {
        regular: 'System',
        medium: 'System',
        semiBold: 'System',
        bold: 'System',
      },
      sizes: {
        xs: 13,
        sm: 15,
        base: 16,
        lg: 18,
        xl: 20,
        xxl: 22,
        xxxl: 24,
        huge: 28,
        massive: 32,
        giant: 40,
      },
      weights: {
        normal: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
      },
      lineHeights: {
        tight: 22,
        normal: 24,
        relaxed: 28,
      },
    };

    // Spacing
    this.spacing = {
      xs: 4,
      sm: 8,
      base: 12,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    };

    // Border radius
    this.borderRadius = {
      sm: 8,
      base: 12,
      md: 14,
      lg: 16,
      xl: 24,
    };

    // Shadows
    this.shadows = {
      light: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      },
      medium: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      },
      heavy: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      },
    };

    // Cache for created stylesheets
    this._styleCache = {};

    StyleManager.instance = this;
  }

  // Get singleton instance
  static getInstance() {
    if (!StyleManager.instance) {
      StyleManager.instance = new StyleManager();
    }
    return StyleManager.instance;
  }

  // Safe StyleSheet creation with error handling
  createStyleSheet(key, styles) {
    if (this._styleCache[key]) {
      return this._styleCache[key];
    }

    try {
      this._styleCache[key] = StyleSheet.create(styles);
      return this._styleCache[key];
    } catch (error) {
      console.warn('StyleManager: Error creating stylesheet:', error);
      // Return plain styles object as fallback
      return styles;
    }
  }

  // Common component styles
  getCommonStyles() {
    return this.createStyleSheet('common', {
      // Layout
      safeArea: {
        flex: 1,
        backgroundColor: this.colors.background,
      },
      container: {
        flex: 1,
        backgroundColor: this.colors.background,
      },
      scrollContent: {
        padding: this.spacing.xl,
        paddingBottom: this.spacing.xl,
      },

      // Typography
      headerText: {
        color: this.colors.primary,
        fontSize: this.typography.sizes.xxxl,
        fontWeight: this.typography.weights.bold,
        textAlign: 'right',
        marginBottom: this.spacing.sm,
        marginTop: this.spacing.base,
      },
      subHeaderText: {
        color: this.colors.text.primary,
        fontSize: this.typography.sizes.sm,
        fontWeight: this.typography.weights.normal,
        textAlign: 'right',
        marginBottom: this.spacing.lg,
        lineHeight: this.typography.lineHeights.tight,
      },
      sectionTitle: {
        color: this.colors.primary,
        fontSize: this.typography.sizes.xl,
        fontWeight: this.typography.weights.semiBold,
        textAlign: 'right',
        marginBottom: this.spacing.sm,
        marginTop: this.spacing.lg,
      },
      sectionDescription: {
        color: this.colors.text.primary,
        fontSize: this.typography.sizes.sm,
        fontWeight: this.typography.weights.normal,
        textAlign: 'right',
        marginBottom: this.spacing.md,
        lineHeight: this.typography.lineHeights.tight,
      },

      // Cards
      mainCard: {
        flex: 1,
        backgroundColor: this.colors.background,
        borderRadius: this.borderRadius.md,
        borderWidth: 1,
        borderColor: this.colors.border.light,
        alignItems: 'center',
        paddingVertical: this.spacing.lg,
        marginHorizontal: this.spacing.xs,
        ...this.shadows.medium,
      },
      infoCard: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        alignItems: 'center',
        backgroundColor: this.colors.surface,
        borderRadius: this.borderRadius.md,
        padding: this.spacing.md,
        marginBottom: this.spacing.base,
        ...this.shadows.light,
      },

      // Navigation
      navBarSafeArea: {
        backgroundColor: this.colors.background,
        borderTopWidth: 1,
        borderColor: this.colors.border.light,
      },
      navBar: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: this.colors.background,
        paddingVertical: this.spacing.base,
        paddingHorizontal: this.spacing.sm,
        height: 64,
      },
      navTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },

      // Buttons
      primaryButton: {
        backgroundColor: this.colors.primary,
        borderRadius: this.borderRadius.base,
        paddingVertical: this.spacing.md,
        paddingHorizontal: this.spacing.xxxl,
        alignItems: 'center',
        width: '100%',
      },
      buttonText: {
        color: this.colors.text.white,
        fontSize: this.typography.sizes.xl,
        fontWeight: this.typography.weights.semiBold,
      },

      // Inputs
      textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: this.colors.border.medium,
        borderRadius: this.spacing.sm,
        padding: this.spacing.base,
        fontSize: this.typography.sizes.lg,
        fontWeight: this.typography.weights.normal,
        marginBottom: this.spacing.md,
        backgroundColor: this.colors.background,
      },

      // Text styles
      primaryText: {
        color: this.colors.primary,
        fontSize: this.typography.sizes.base,
        fontWeight: this.typography.weights.semiBold,
      },
      secondaryText: {
        color: this.colors.text.secondary,
        fontSize: this.typography.sizes.xs,
        fontWeight: this.typography.weights.normal,
        textAlign: 'right',
      },
      mutedText: {
        color: this.colors.text.muted,
        fontSize: this.typography.sizes.sm,
        fontWeight: this.typography.weights.normal,
        textAlign: 'center',
      },
      errorText: {
        color: this.colors.status.error,
        marginTop: this.spacing.base,
        fontSize: this.typography.sizes.base,
        fontWeight: this.typography.weights.medium,
      },

      // Utility classes
      flexRow: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        justifyContent: 'space-between',
      },
      centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      textRight: {
        textAlign: 'right',
      },
      textCenter: {
        textAlign: 'center',
      },
    });
  }

  // Home screen specific styles
  getHomeScreenStyles(theme) {
    const colors = theme ? theme.colors : this.colors;
    const shadows = theme ? theme.shadows : this.shadows;

    return this.createStyleSheet('homeScreen', {
      safeArea: {
        flex: 1,
        backgroundColor: colors.background || this.colors.background,
      },
      container: {
        flex: 1,
        backgroundColor: colors.background || this.colors.background,
      },
      scrollContent: {
        padding: this.spacing.xl,
        paddingBottom: this.spacing.xl,
      },
      headerText: {
        color: colors.primary || this.colors.primary,
        fontSize: this.typography.sizes.xxxl,
        fontWeight: this.typography.weights.bold,
        textAlign: 'right',
        marginBottom: this.spacing.sm,
        marginTop: this.spacing.base,
      },
      subHeaderText: {
        color: colors.text || this.colors.text.primary,
        fontSize: this.typography.sizes.sm,
        fontWeight: this.typography.weights.normal,
        textAlign: 'right',
        marginBottom: this.spacing.lg,
        lineHeight: this.typography.lineHeights.tight,
      },
      mainCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: this.spacing.lg,
      },
      mainCard: {
        flex: 1,
        backgroundColor:
          colors.card || colors.surface || this.colors.background,
        borderRadius: this.borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border || this.colors.border.light,
        alignItems: 'center',
        paddingVertical: this.spacing.lg,
        marginHorizontal: this.spacing.xs,
        ...(shadows ? shadows.medium : this.shadows.medium),
      },
      mainCardIcon: {
        color: colors.primary || this.colors.primary,
        marginBottom: this.spacing.sm,
        width: 32,
        height: 32,
      },
      mainCardText: {
        color: colors.text || this.colors.text.primary,
        fontSize: this.typography.sizes.base,
        fontWeight: this.typography.weights.semiBold,
        textAlign: 'center',
      },
      sectionTitle: {
        color: colors.primary || this.colors.primary,
        fontSize: this.typography.sizes.xl,
        fontWeight: this.typography.weights.semiBold,
        textAlign: 'right',
        marginBottom: this.spacing.sm,
        marginTop: this.spacing.lg,
      },
      sectionDescription: {
        color: colors.text || this.colors.text.primary,
        fontSize: this.typography.sizes.sm,
        fontWeight: this.typography.weights.normal,
        textAlign: 'right',
        marginBottom: this.spacing.md,
        lineHeight: this.typography.lineHeights.tight,
      },
      infoCard: {
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
        alignItems: 'center',
        backgroundColor: colors.card || colors.surface || this.colors.surface,
        borderRadius: this.borderRadius.md,
        padding: this.spacing.md,
        marginBottom: this.spacing.base,
        ...(shadows ? shadows.light : this.shadows.light),
      },
      infoCardIcon: {
        color: colors.primary || this.colors.primary,
        marginLeft: I18nManager.isRTL ? 0 : this.spacing.base,
        marginRight: I18nManager.isRTL ? this.spacing.base : 0,
        width: 24,
        height: 24,
      },
      infoCardTitle: {
        color: colors.text || this.colors.text.primary,
        fontSize: this.typography.sizes.base,
        fontWeight: this.typography.weights.semiBold,
        textAlign: 'right',
        marginBottom: this.spacing.xs,
      },
      secondaryText: {
        color: colors.textSecondary || this.colors.text.secondary,
        fontSize: this.typography.sizes.sm,
        fontWeight: this.typography.weights.normal,
        textAlign: 'right',
      },
      navBarSafeArea: {
        backgroundColor: colors.surface || this.colors.background,
      },
      navBar: {
        flexDirection: 'row',
        backgroundColor: colors.surface || this.colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border || this.colors.border.light,
        paddingVertical: this.spacing.sm,
      },
      navTab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: this.spacing.xs,
      },
      navIcon: {
        color: colors.icon || this.colors.text.muted,
        marginBottom: this.spacing.xs / 2,
        width: 20,
        height: 20,
      },
      navLabel: {
        color: colors.textSecondary || this.colors.text.muted,
        fontSize: this.typography.sizes.xs,
        fontWeight: this.typography.weights.normal,
        textAlign: 'center',
      },
    });
  }

  // Nafath screen styles
  getNafathStyles(theme) {
    const colors = theme ? theme.colors : this.colors;
    const shadows = theme ? theme.shadows : this.shadows;
    const common = this.getCommonStyles();

    return this.createStyleSheet('nafath', {
      ...common,
      container: {
        flex: 1,
        backgroundColor: colors.background || this.colors.background,
      },
      card: {
        width: '85%',
        backgroundColor: colors.card || colors.surface || this.colors.surface,
        borderRadius: this.borderRadius.xl,
        padding: this.spacing.xxl,
        alignItems: 'center',
        ...(shadows ? shadows.heavy : this.shadows.heavy),
      },
      title: {
        fontSize: this.typography.sizes.huge,
        fontWeight: this.typography.weights.bold,
        color: colors.primary || this.colors.primary,
        marginBottom: this.spacing.sm,
      },
      subtitle: {
        fontSize: this.typography.sizes.sm,
        fontWeight: this.typography.weights.normal,
        color: colors.textSecondary || this.colors.text.muted,
        textAlign: 'center',
        marginBottom: this.spacing.md,
      },
      textInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border || this.colors.border.medium,
        borderRadius: this.spacing.sm,
        padding: this.spacing.base,
        fontSize: this.typography.sizes.lg,
        fontWeight: this.typography.weights.normal,
        marginBottom: this.spacing.md,
        backgroundColor:
          colors.inputBackground || colors.surface || this.colors.background,
        color: colors.inputText || colors.text || this.colors.text.primary,
      },
      primaryButton: {
        backgroundColor: colors.primary || this.colors.primary,
        borderRadius: this.borderRadius.base,
        paddingVertical: this.spacing.md,
        paddingHorizontal: this.spacing.xxxl,
        alignItems: 'center',
        width: '100%',
      },
      buttonText: {
        color: colors.textInverse || this.colors.text.white,
        fontSize: this.typography.sizes.xl,
        fontWeight: this.typography.weights.semiBold,
      },
      randomBox: {
        backgroundColor: colors.surface || this.colors.border.dark,
        borderRadius: this.spacing.sm,
        paddingHorizontal: this.spacing.xxxl,
        paddingVertical: this.spacing.sm,
        marginBottom: this.spacing.base,
        borderWidth: 1,
        borderColor: colors.border || this.colors.border.light,
      },
      randomText: {
        fontSize: this.typography.sizes.giant,
        fontWeight: this.typography.weights.bold,
        color: colors.text || this.colors.text.primary,
      },
      timer: {
        fontSize: this.typography.sizes.lg,
        color: colors.textSecondary || this.colors.secondary,
        marginBottom: this.spacing.sm,
      },
      resendBtn: {
        width: '100%',
        borderRadius: this.spacing.sm,
        marginBottom: this.spacing.sm,
        paddingVertical: 10,
        alignItems: 'center',
      },
      resendActive: {
        backgroundColor: colors.primaryLight || this.colors.primaryLight,
      },
      resendDisabled: {
        backgroundColor: colors.surface || '#f0f0f0',
      },
      resendActiveText: {
        color: colors.primary || this.colors.primary,
        fontSize: this.typography.sizes.lg,
        fontWeight: this.typography.weights.bold,
      },
      resendDisabledText: {
        color: colors.textSecondary || this.colors.text.light,
        fontSize: this.typography.sizes.lg,
        fontWeight: this.typography.weights.bold,
      },
      errorText: {
        color: colors.error || this.colors.status.error,
        marginTop: this.spacing.base,
        fontSize: this.typography.sizes.base,
        textAlign: 'center',
      },
      openBtn: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: colors.primary || this.colors.primary,
        borderRadius: this.borderRadius.lg,
        paddingVertical: this.spacing.lg,
        alignItems: 'center',
        ...(shadows ? shadows.medium : this.shadows.medium),
      },
      centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
  }
}

// Export singleton instance
export default StyleManager.getInstance();
