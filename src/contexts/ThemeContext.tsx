
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { AppTheme, ThemeName, ThemeContextType, ThemeColors, ThemeTypography, ThemeSpacing, ThemeLayout, ThemeAnimation } from '../types';

// Define default theme properties (used for constructing theme objects)
const defaultColors: Omit<ThemeColors, 'primary'|'secondary'|'accent'|'background'|'surface'|'surfaceAlt'|'border'|'textPrimary'|'textSecondary'|'textDisabled'|'textOnPrimary'|'textOnSecondary'|'error'|'warning'|'success'|'info'|'primaryVariant'|'secondaryVariant'> = {};


const defaultTypography: ThemeTypography = {
  fontFamilySans: "var(--font-family-sans)",
  fontFamilyDisplay: "var(--font-family-display)",
  fontFamilyMono: "var(--font-family-mono)",
};

const defaultSpacing: ThemeSpacing = {
  unit: "var(--spacing-unit)",
};

const defaultLayout: ThemeLayout = {
  borderRadiusSm: "var(--border-radius-sm)",
  borderRadiusDefault: "var(--border-radius-default)",
  borderRadiusMd: "var(--border-radius-md)",
  borderRadiusLg: "var(--border-radius-lg)",
  borderRadiusXl: "var(--border-radius-xl)",
  shadowSm: "var(--shadow-sm)",
  shadowDefault: "var(--shadow-default)",
  shadowMd: "var(--shadow-md)",
  shadowLg: "var(--shadow-lg)",
  shadowXl: "var(--shadow-xl)",
  shadowInner: "var(--shadow-inner)",
};

const defaultAnimation: ThemeAnimation = {
    durationShort: "var(--transition-duration-short)",
    durationMedium: "var(--transition-duration-medium)",
    durationLong: "var(--transition-duration-long)",
    timingFunction: "var(--transition-timing-function)",
};


// Define the themes
const lightTheme: AppTheme = {
  name: 'light',
  isDark: false,
  colors: {
    ...defaultColors,
    primary: "var(--theme-primary)", // Will be #1a73e8 by themes.css
    primaryVariant: "var(--theme-primary-variant)",
    secondary: "var(--theme-secondary)",
    secondaryVariant: "var(--theme-secondary-variant)",
    accent: "var(--theme-accent)",
    background: "var(--theme-background)",
    surface: "var(--theme-surface)",
    surfaceAlt: "var(--theme-surface-alt)",
    border: "var(--theme-border)",
    textPrimary: "var(--theme-text-primary)",
    textSecondary: "var(--theme-text-secondary)",
    textDisabled: "var(--theme-text-disabled)",
    textOnPrimary: "var(--theme-text-on-primary)",
    textOnSecondary: "var(--theme-text-on-secondary)",
    error: "var(--theme-error)",
    warning: "var(--theme-warning)",
    success: "var(--theme-success)",
    info: "var(--theme-info)",
  },
  typography: defaultTypography,
  spacing: defaultSpacing,
  layout: defaultLayout,
  animation: defaultAnimation,
};

const darkTheme: AppTheme = {
  name: 'dark',
  isDark: true,
  colors: {
    ...defaultColors,
    primary: "var(--theme-primary)", // Will be #8ab4f8 by themes.css
    primaryVariant: "var(--theme-primary-variant)",
    secondary: "var(--theme-secondary)",
    secondaryVariant: "var(--theme-secondary-variant)",
    accent: "var(--theme-accent)",
    background: "var(--theme-background)",
    surface: "var(--theme-surface)",
    surfaceAlt: "var(--theme-surface-alt)",
    border: "var(--theme-border)",
    textPrimary: "var(--theme-text-primary)",
    textSecondary: "var(--theme-text-secondary)",
    textDisabled: "var(--theme-text-disabled)",
    textOnPrimary: "var(--theme-text-on-primary)",
    textOnSecondary: "var(--theme-text-on-secondary)",
    error: "var(--theme-error)",
    warning: "var(--theme-warning)",
    success: "var(--theme-success)",
    info: "var(--theme-info)",
  },
  typography: defaultTypography,
  spacing: defaultSpacing,
  layout: defaultLayout,
  animation: defaultAnimation,
};

const highContrastTheme: AppTheme = {
  name: 'high-contrast',
  isDark: false, // Or true, depending on HC base. Let's assume light base for HC.
  colors: {
    ...defaultColors,
    primary: "var(--theme-primary)", // Will be #0053cf by themes.css
    primaryVariant: "var(--theme-primary-variant)",
    secondary: "var(--theme-secondary)",
    secondaryVariant: "var(--theme-secondary-variant)",
    accent: "var(--theme-accent)",
    background: "var(--theme-background)",
    surface: "var(--theme-surface)",
    surfaceAlt: "var(--theme-surface-alt)",
    border: "var(--theme-border)",
    textPrimary: "var(--theme-text-primary)",
    textSecondary: "var(--theme-text-secondary)",
    textDisabled: "var(--theme-text-disabled)",
    textOnPrimary: "var(--theme-text-on-primary)",
    textOnSecondary: "var(--theme-text-on-secondary)",
    error: "var(--theme-error)",
    warning: "var(--theme-warning)",
    success: "var(--theme-success)",
    info: "var(--theme-info)",
  },
  typography: defaultTypography,
  spacing: defaultSpacing,
  layout: defaultLayout,
  animation: defaultAnimation,
};

const themes: Record<ThemeName, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
  'high-contrast': highContrastTheme,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(() => {
    // Check localStorage for saved theme or detect system preference
    const savedTheme = localStorage.getItem('app-theme') as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      return savedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.body.classList.remove(...Object.keys(themes).map(name => `theme-${name}`));
    document.body.classList.add(`theme-${currentThemeName}`);
    localStorage.setItem('app-theme', currentThemeName);
  }, [currentThemeName]);

  // Auto-update if system preference changes and no theme explicitly set by user
   useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
        // Only change if the theme wasn't manually set by the user to something different
        const savedTheme = localStorage.getItem('app-theme') as ThemeName;
        if (!savedTheme || themes[savedTheme] === (e.matches ? themes.dark : themes.light) ) {
             setCurrentThemeName(e.matches ? 'dark' : 'light');
        }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);


  const setTheme = useCallback((themeName: ThemeName) => {
    if (themes[themeName]) {
      setCurrentThemeName(themeName);
    }
  }, []);

  const theme = useMemo(() => themes[currentThemeName], [currentThemeName]);
  const availableThemes = useMemo(() => Object.keys(themes) as ThemeName[], []);


  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
