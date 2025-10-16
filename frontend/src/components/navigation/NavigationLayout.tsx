import React, { useState, cloneElement } from "react";
import type { NavigationItem } from "./types";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { useNavigation } from "./useNavigation";
import { useAuth } from "../../app/AuthContext";

// Layout Component with Navigation (Composition over Inheritance)
interface NavigationLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  currentPath?: string;
  onNavigationChange?: (item: NavigationItem) => void;
  showSidebar?: boolean;
  activeItem?: NavigationItem;
}

export const NavigationLayout: React.FC<NavigationLayoutProps> = ({
  children,
  userRole = "resident",
  currentPath,
  onNavigationChange,
  showSidebar = true,
  activeItem
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { navigationItems, handleNavigation } = useNavigation(userRole);
  const { user, logout } = useAuth();

  const handleItemClick = (item: NavigationItem) => {
    handleNavigation(item);
    if (onNavigationChange) {
      onNavigationChange(item);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!showSidebar) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Clone children and pass sidebar state as props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child, { isSidebarOpen } as any);
    }
    return child;
  });

  // Get the active item for display
  const currentActiveItem = activeItem || navigationItems.find(item => item.isActive) || navigationItems[0];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Navigation Sidebar - Full height */}
      {isSidebarOpen && (
        <div className="h-full transition-all duration-300 ease-in-out z-50">
          <BreadcrumbNavigation
            items={navigationItems}
            onItemClick={handleItemClick}
            currentPath={currentPath}
            showIcons={true}
            onToggleSidebar={toggleSidebar}
          />
        </div>
      )}

      {/* Main Content Area - Adjusts based on sidebar state */}
      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out">
        {/* Top Header Bar - Positioned below sidebar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 z-20 relative">
          <div className="flex justify-between items-center px-6">
            <div className="flex items-center space-x-4">
              {/* Toggle Button - Only show when sidebar is closed */}
              {!isSidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="bg-[#3C4E1E] text-white p-2 rounded-lg shadow hover:bg-[#2A3616] transition-colors duration-200"
                  aria-label="Open navigation sidebar"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              )}
              
              {/* Page Title */}
              <h1 className="text-xl font-semibold text-gray-800">
                {currentActiveItem.icon} {currentActiveItem.label}
              </h1>
            </div>
            
            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user?.name}</span>
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 capitalize">
                  {user?.role || userRole}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {childrenWithProps}
        </div>
      </div>
    </div>
  );
};