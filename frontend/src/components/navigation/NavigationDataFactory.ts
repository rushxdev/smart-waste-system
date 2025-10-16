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
        label: "My Requests",
        icon: "📋",
        path: "/my-requests",
        isActive: false
      },
      {
        id: "add-card",
        label: "Add Card",
        icon: "💳",
        path: "/add-card",
        isActive: false
      },
      {
        id: "pricing-summary",
        label: "Pricing & Summary",
        icon: "💰",
        path: "/pricing-summary",
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
      {
        id: "route-planning",
        label: "Route Planning",
        icon: "🗺️",
        path: "/collector/routes",
        isActive: false
      }
    ];
  }

  // ✅ NEW USER ROLE - Admin Navigation
  static createAdminNavigationItems(): NavigationItem[] {
    return [
      {
        id: "admin-dashboard",
        label: "Admin Dashboard",
        icon: "⚙️",
        path: "/admin/dashboard",
        isActive: true
      },
      {
        id: "user-management",
        label: "User Management",
        icon: "👥",
        path: "/admin/users",
        isActive: false
      },
      {
        id: "system-settings",
        label: "System Settings",
        icon: "🔧",
        path: "/admin/settings",
        isActive: false
      },
      {
        id: "reports",
        label: "Reports & Analytics",
        icon: "📊",
        path: "/admin/reports",
        isActive: false
      }
    ];
  }

  // ✅ NEW USER ROLE - Manager Navigation  
  static createManagerNavigationItems(): NavigationItem[] {
    return [
      {
        id: "manager-dashboard",
        label: "Manager Dashboard",
        icon: "📈",
        path: "/manager/dashboard",
        isActive: true
      },
      {
        id: "team-overview",
        label: "Team Overview",
        icon: "👨‍👩‍👧‍👦",
        path: "/manager/team",
        isActive: false
      },
      {
        id: "route-optimization",
        label: "Route Optimization",
        icon: "🛣️",
        path: "/manager/routes",
        isActive: false
      }
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
      case "admin": // ✅ NEW ROLE
        return this.createAdminNavigationItems();
      case "manager": // ✅ NEW ROLE
        return this.createManagerNavigationItems();
      default:
        return this.createResidentNavigationItems();
    }
  }
}