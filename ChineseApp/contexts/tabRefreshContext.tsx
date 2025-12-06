import React, { createContext, useCallback, useContext, useState } from "react";

// Context để quản lý refresh state của tất cả các tabs
interface TabRefreshContextType {
  refreshTab: (tabName: string) => void;
  shouldRefresh: (tabName: string) => boolean;
  clearRefresh: (tabName: string) => void;
  setScrollPosition: (tabName: string, position: number) => void;
  getScrollPosition: (tabName: string) => number;
}

const TabRefreshContext = createContext<TabRefreshContextType | undefined>(
  undefined
);

export const TabRefreshProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refreshFlags, setRefreshFlags] = useState<Record<string, boolean>>({});
  const [scrollPositions, setScrollPositions] = useState<
    Record<string, number>
  >({});

  const refreshTab = useCallback((tabName: string) => {
    setRefreshFlags((prev) => ({ ...prev, [tabName]: true }));
  }, []);

  const shouldRefresh = useCallback(
    (tabName: string) => {
      return refreshFlags[tabName] === true;
    },
    [refreshFlags]
  );

  const clearRefresh = useCallback((tabName: string) => {
    setRefreshFlags((prev) => {
      const newFlags = { ...prev };
      delete newFlags[tabName];
      return newFlags;
    });
  }, []);

  const setScrollPosition = useCallback((tabName: string, position: number) => {
    setScrollPositions((prev) => ({ ...prev, [tabName]: position }));
  }, []);

  const getScrollPosition = useCallback(
    (tabName: string) => {
      return scrollPositions[tabName] || 0;
    },
    [scrollPositions]
  );

  return (
    <TabRefreshContext.Provider
      value={{
        refreshTab,
        shouldRefresh,
        clearRefresh,
        setScrollPosition,
        getScrollPosition,
      }}
    >
      {children}
    </TabRefreshContext.Provider>
  );
};

export const useTabRefreshContext = () => {
  const context = useContext(TabRefreshContext);
  if (!context) {
    throw new Error(
      "useTabRefreshContext must be used within TabRefreshProvider"
    );
  }
  return context;
};
