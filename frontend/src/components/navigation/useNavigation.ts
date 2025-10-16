import { useState, useCallback } from "react";
import type { NavigationItem } from "./types";
import { NavigationDataFactory } from "./NavigationDataFactory";
import { NavigationStateManager } from "./NavigationStateManager";

// Navigation Hook (Dependency Inversion Principle)
export const useNavigation = (userRole: string = "resident") => {
  const [navigationManager] = useState(() => {
    const items = NavigationDataFactory.createNavigationForRole(userRole);
    return new NavigationStateManager(items);
  });

  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(
    navigationManager.getItems()
  );

  const setActiveItem = useCallback((id: string) => {
    const updatedItems = navigationManager.setActiveItem(id);
    setNavigationItems(updatedItems);
  }, [navigationManager]);

  const setActiveByPath = useCallback((path: string) => {
    const updatedItems = navigationManager.setActiveByPath(path);
    setNavigationItems(updatedItems);
  }, [navigationManager]);

  const getActiveItem = useCallback(() => {
    return navigationManager.getActiveItem();
  }, [navigationManager]);

  const handleNavigation = useCallback((item: NavigationItem) => {
    setActiveItem(item.id);
    
    // Here you could integrate with React Router or your routing solution
    if (item.path) {
      console.log(`Navigating to: ${item.path}`);
      // window.location.href = item.path; // Simple navigation
      // or use React Router: navigate(item.path);
    }
  }, [setActiveItem]);

  return {
    navigationItems,
    setActiveItem,
    setActiveByPath,
    getActiveItem,
    handleNavigation,
  };
};