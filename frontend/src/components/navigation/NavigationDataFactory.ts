import type { NavigationItem } from "./types";

// Navigation Data Factory (Single Responsibility Principle)
export class NavigationDataFactory {
  static createResidentNavigationItems(): NavigationItem[] {
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "🏠",
        path: "/dashboard",
        isActive: true
      },
      {
        id: "request-pickup",
        label: "Schedule Pickup",
        icon: "📅",
        path: "/schedule-pickup",
        isActive: false
      },
      {
        id: "my-requests",
        label: "Pickup Requests",
        icon: "📋",
        path: "/my-requests",
        isActive: false
      }
    ];
  }

  static createCollectorNavigationItems(): NavigationItem[] {
    return [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "🏠",
        path: "/collector/dashboard",
        isActive: true
      },
      {
        id: "assigned-pickups",
        label: "Assigned Pickups",
        icon: "📦",
        path: "/collector/pickups",
        isActive: false
      },
    ];
  }

  // ✅ MANAGER ROLE - Manager Navigation  
  static createManagerNavigationItems(): NavigationItem[] {
    return [
      {
        id: "manager-dashboard",
        label: "Dashboard",
        icon: "📈",
        path: "/manager/dashboard",
        isActive: true
      },
      {
        id: "requests",
        label: "Requests",
        icon: "📥",
        path: "/manager/requests",
        isActive: false
      },
      {
        id: "team-overview",
        label: "Team Overview",
        icon: "👷",
        path: "/manager/team",
        isActive: false
      },
    ];
  }

  // ✅ DYNAMIC NAVIGATION - Based on user permissions
  static createDynamicNavigation(role: string, permissions: string[] = []): NavigationItem[] {
    const baseItems = this.createNavigationForRole(role);
    const dynamicItems: NavigationItem[] = [];

    // Add conditional items based on permissions
    if (permissions.includes('can_view_analytics')) {
      dynamicItems.push({
        id: "analytics",
        label: "Analytics",
        icon: "📊",
        path: "/analytics",
        isActive: false
      });
    }

    if (permissions.includes('can_manage_billing')) {
      dynamicItems.push({
        id: "billing",
        label: "Billing Management",
        icon: "💰",
        path: "/billing",
        isActive: false
      });
    }

    if (permissions.includes('can_view_support')) {
      dynamicItems.push({
        id: "support",
        label: "Support Center",
        icon: "🎧",
        path: "/support",
        isActive: false
      });
    }

    return [...baseItems, ...dynamicItems];
  }

  // ✅ CONTEXTUAL NAVIGATION - Based on current state
  static createContextualNavigation(role: string, context: { hasActiveRequests?: boolean, isFirstTime?: boolean } = {}): NavigationItem[] {
    const baseItems = this.createNavigationForRole(role);

    // Add contextual items
    if (context.isFirstTime) {
      baseItems.unshift({
        id: "getting-started",
        label: "Getting Started",
        icon: "🚀",
        path: "/getting-started",
        isActive: false
      });
    }

    if (context.hasActiveRequests) {
      baseItems.push({
        id: "active-requests",
        label: "Active Requests",
        icon: "🔥",
        path: "/active-requests",
        isActive: false
      });
    }

    return baseItems;
  }

  // Factory method to get navigation based on user role (Open/Closed Principle)
  static createNavigationForRole(role: string): NavigationItem[] {
    switch (role.toLowerCase()) {
      case "resident":
        return this.createResidentNavigationItems();
      case "collector":
        return this.createCollectorNavigationItems();
      case "manager": // ✅ MANAGER ROLE
      case "admin": // ✅ BACKWARD COMPATIBILITY - Map admin to manager
        return this.createManagerNavigationItems();
      default:
        return this.createResidentNavigationItems();
    }
  }
}