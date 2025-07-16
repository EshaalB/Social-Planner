import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("sp-theme") || "dark";
  });

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    localStorage.setItem("sp-theme", mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, setMode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);