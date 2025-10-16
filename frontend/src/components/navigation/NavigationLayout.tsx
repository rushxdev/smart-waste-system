import React from "react";
import type { NavigationItem } from "./types";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { useNavigation } from "./useNavigation";

// Layout Component with Navigation (Composition over Inheritance)
interface NavigationLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  currentPath?: string;
  onNavigationChange?: (item: NavigationItem) => void;
  showSidebar?: boolean;
}

export const NavigationLayout: React.FC<NavigationLayoutProps> = ({
  children,
  userRole = "resident",
  currentPath,
  onNavigationChange,
  showSidebar = true
}) => {
  const { navigationItems, handleNavigation } = useNavigation(userRole);

  const handleItemClick = (item: NavigationItem) => {
    handleNavigation(item);
    if (onNavigationChange) {
      onNavigationChange(item);
    }
  };

  if (!showSidebar) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Navigation Sidebar */}
      <div className="flex-shrink-0">
        <BreadcrumbNavigation
          items={navigationItems}
          onItemClick={handleItemClick}
          currentPath={currentPath}
          showIcons={true}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};