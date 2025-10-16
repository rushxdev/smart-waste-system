// Example: How to use the enhanced navigation system

import { NavigationDataFactory } from "./NavigationDataFactory";

// 1. ✅ BASIC USAGE - Default role-based navigation
const basicNavigation = NavigationDataFactory.createNavigationForRole("resident");

// 2. ✅ DYNAMIC USAGE - With user permissions
const userPermissions = ["can_view_analytics", "can_manage_billing"];
const dynamicNavigation = NavigationDataFactory.createDynamicNavigation("resident", userPermissions);

// 3. ✅ CONTEXTUAL USAGE - Based on user state
const contextualNavigation = NavigationDataFactory.createContextualNavigation("resident", {
  hasActiveRequests: true,
  isFirstTime: false
});

// 4. ✅ CUSTOM NAVIGATION - Completely custom items
const customNavigation = [
  {
    id: "custom-page",
    label: "Custom Feature",
    icon: "⭐",
    path: "/custom",
    isActive: false
  },
  ...NavigationDataFactory.createResidentNavigationItems()
];

export {
  basicNavigation,
  dynamicNavigation,
  contextualNavigation,
  customNavigation
};