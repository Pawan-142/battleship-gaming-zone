import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('battleship_theme_v2') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('battleship_theme_v2', theme);
    } catch {
      // safe fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
      return;
    }
    document.startViewTransition(() => {
      setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
