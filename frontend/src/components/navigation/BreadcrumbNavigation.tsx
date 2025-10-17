import React, { useState, useEffect } from "react";
import type { BreadcrumbProps, NavigationItem } from "./types";
import { NavigationItemComponent } from "./NavigationItem";
import { NavigationStateManager } from "./NavigationStateManager";

// Breadcrumb Navigation Component (Open/Closed Principle - extensible through props)
export const BreadcrumbNavigation: React.FC<BreadcrumbProps> = ({
  items,
  onItemClick,
  currentPath,
  showIcons = true,
  className = "",
  onToggleSidebar,
  isOpen = true
}) => {
  const [navigationManager] = useState(() => new NavigationStateManager(items));
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(items);

  // Update active item based on current path
  useEffect(() => {
    if (currentPath) {
      const updatedItems = navigationManager.setActiveByPath(currentPath);
      setNavigationItems(updatedItems);
    }
  }, [currentPath, navigationManager]);

  const handleItemClick = (item: NavigationItem) => {
    // Update internal state
    const updatedItems = navigationManager.setActiveItem(item.id);
    setNavigationItems(updatedItems);

    // Notify parent component
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const baseClasses = `
    bg-[#3C4E1E] h-screen w-full shadow-lg flex flex-col
    ${className}
  `;

  return (
    <nav className={baseClasses} role="navigation" aria-label="Main navigation">
      {/* Navigation Header with Logo */}
      <div className="p-6 pb-4 flex-shrink-0">
        {/* Toggle Button - Top Right (moved here from header) */}
        {onToggleSidebar && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onToggleSidebar}
              className="bg-[#3C4E1E] bg-opacity-20 text-white p-2 rounded-lg shadow hover:bg-opacity-30 transition-colors duration-200"
              aria-label={"Toggle navigation sidebar"}
            >
              {/* Show X when open, hamburger when closed */}
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        )}
        
        {/* Logo and Title Section - show only when open */}
        {isOpen && (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className={`w-20 h-20 bg-white rounded-full p-2 shadow-lg flex items-center justify-center`}>
                <img 
                  src="/Sustainability-Focused CleanSphere Logo - Minimalist Design 3.png" 
                  alt="CleanSphere Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-white mb-1">
                CleanSphere
              </h2>
              <p className="text-green-200 text-sm mb-3">
                Smart Waste System
              </p>
              <div className="h-1 bg-green-500 rounded-full w-16 mx-auto"></div>
            </div>
          </>
        )}
      </div>

      {/* Navigation Items */}
      <div className={`${isOpen ? 'flex-1 px-6 space-y-2 overflow-y-auto' : 'flex flex-col items-center justify-start space-y-4 overflow-y-auto py-6'}`}>
        {navigationItems.map((item) => (
          <NavigationItemComponent
            key={item.id}
            item={item}
            onClick={handleItemClick}
            showIcon={showIcons}
            isOpen={isOpen}
          />
        ))}
      </div>

      {/* Navigation Footer - hide when collapsed */}
      {isOpen && (
        <div className="p-6 pt-4 flex-shrink-0 border-t border-green-700">
          <div className="text-green-300 text-sm text-center">
            <p className="mb-2">Need help?</p>
            <button className="text-green-400 hover:text-white transition-colors text-sm font-medium">
              Contact Support
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};