"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type TabState = "idle" | "loading" | "ready";

interface TabStatusContextType {
  statuses: Record<string, TabState>;
  setStatus: (tab: string, status: TabState) => void;
}

const TabStatusContext = createContext<TabStatusContextType>({
  statuses: {},
  setStatus: () => {},
});

export function TabStatusProvider({ children }: { children: ReactNode }) {
  const [statuses, setStatuses] = useState<Record<string, TabState>>({});

  const setStatus = useCallback((tab: string, status: TabState) => {
    setStatuses((prev) => ({ ...prev, [tab]: status }));
  }, []);

  return (
    <TabStatusContext.Provider value={{ statuses, setStatus }}>
      {children}
    </TabStatusContext.Provider>
  );
}

export function useTabStatus() {
  return useContext(TabStatusContext);
}
