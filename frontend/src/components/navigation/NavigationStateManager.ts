import type { NavigationItem } from "./types";

// Navigation State Manager (Single Responsibility Principle)
export class NavigationStateManager {
  private items: NavigationItem[];

  constructor(items: NavigationItem[]) {
    this.items = [...items];
  }

  // Get all navigation items
  getItems(): NavigationItem[] {
    return [...this.items];
  }

  // Set active item by ID
  setActiveItem(id: string): NavigationItem[] {
    this.items = this.items.map(item => ({
      ...item,
      isActive: item.id === id
    }));
    return this.getItems();
  }

  // Set active item by path
  setActiveByPath(path: string): NavigationItem[] {
    this.items = this.items.map(item => ({
      ...item,
      isActive: item.path === path
    }));
    return this.getItems();
  }

  // Get currently active item
  getActiveItem(): NavigationItem | undefined {
    return this.items.find(item => item.isActive);
  }

  // Update a specific item
  updateItem(id: string, updates: Partial<NavigationItem>): NavigationItem[] {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    return this.getItems();
  }
}