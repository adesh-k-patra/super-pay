import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { useLocation, useSearch } from "wouter";

interface NavigationHistoryContextType {
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);

export function NavigationHistoryProvider({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const fullLocation = search ? `${location}?${search}` : location;
  const [history, setHistory] = useState<string[]>([fullLocation]);
  const isNavigatingBack = useRef(false);

  useEffect(() => {
    if (isNavigatingBack.current) {
      isNavigatingBack.current = false;
      return;
    }

    setHistory((prev) => {
      const prevLocation = prev[prev.length - 1];
      
      // Don't add to history if it's the same URL
      if (prevLocation === fullLocation) {
        return prev;
      }
      
      // Extract path without query params
      const prevPath = prevLocation?.split('?')[0];
      const currentPath = fullLocation.split('?')[0];
      
      // If only query params changed (same path), replace the last entry instead of adding new one
      if (prevPath === currentPath && prev.length > 0) {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = fullLocation;
        return newHistory;
      }
      
      // Otherwise, add new entry (different page)
      const newHistory = [...prev, fullLocation];
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
  }, [fullLocation]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousLocation = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      isNavigatingBack.current = true;
      navigate(previousLocation || "/home");
    } else {
      setHistory(["/home"]);
      isNavigatingBack.current = true;
      navigate("/home");
    }
  }, [history, navigate]);

  const canGoBack = history.length > 1;

  return (
    <NavigationHistoryContext.Provider value={{ goBack, canGoBack }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory() {
  const context = useContext(NavigationHistoryContext);
  if (context === undefined) {
    throw new Error("useNavigationHistory must be used within a NavigationHistoryProvider");
  }
  return context;
}
