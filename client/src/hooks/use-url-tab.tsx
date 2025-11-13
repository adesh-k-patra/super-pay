import { useLocation } from "wouter";
import { useCallback, useState, useEffect } from "react";

export function useUrlTab(defaultTab: string, paramName: string = "tab") {
  const [location, navigate] = useLocation();
  
  const getTabFromUrl = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(paramName) || defaultTab;
  }, [defaultTab, paramName]);

  const [currentTab, setCurrentTab] = useState(getTabFromUrl);

  useEffect(() => {
    const handleUrlChange = () => {
      const tabFromUrl = getTabFromUrl();
      setCurrentTab(tabFromUrl);
    };

    // Listen to popstate for browser back/forward
    window.addEventListener('popstate', handleUrlChange);
    
    // Also update when location changes (for initial mount and navigation)
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [location, getTabFromUrl]);

  const setTab = useCallback(
    (newTab: string) => {
      const params = new URLSearchParams(window.location.search);
      params.set(paramName, newTab);
      const pathname = location.split('?')[0];
      const newUrl = `${pathname}?${params.toString()}`;
      
      // Update state immediately for instant UI response
      setCurrentTab(newTab);
      
      // Then update the URL
      navigate(newUrl, { replace: true });
    },
    [location, navigate, paramName]
  );

  return [currentTab, setTab] as const;
}
