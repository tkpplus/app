import React, { createContext, useContext, useState, useEffect } from 'react';

interface ShabbatModeContextType {
  isShabbatMode: boolean;
  toggleShabbatMode: () => void;
}

const ShabbatModeContext = createContext<ShabbatModeContextType>({
  isShabbatMode: false,
  toggleShabbatMode: () => {},
});

export function ShabbatModeProvider({ children }: { children: React.ReactNode }) {
  const [isShabbatMode, setIsShabbatMode] = useState(() => {
    return localStorage.getItem('shabbatMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('shabbatMode', isShabbatMode.toString());
    if (isShabbatMode) {
      document.documentElement.classList.add('shabbat-mode');
    } else {
      document.documentElement.classList.remove('shabbat-mode');
    }
  }, [isShabbatMode]);

  const toggleShabbatMode = () => setIsShabbatMode(prev => !prev);

  return (
    <ShabbatModeContext.Provider value={{ isShabbatMode, toggleShabbatMode }}>
      {children}
    </ShabbatModeContext.Provider>
  );
}

export function useShabbatMode() {
  return useContext(ShabbatModeContext);
}
