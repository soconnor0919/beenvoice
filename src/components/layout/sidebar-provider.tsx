"use client";

import * as React from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  expand: () => void;
  collapse: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined,
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? (JSON.parse(saved) as boolean) : false;
  });

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
      return next;
    });
  }, []);

  const expand = React.useCallback(() => {
    setIsCollapsed(false);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(false));
  }, []);

  const collapse = React.useCallback(() => {
    setIsCollapsed(true);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(true));
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleCollapse, expand, collapse }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
