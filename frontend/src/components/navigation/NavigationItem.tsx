import React from "react";
import type { NavigationItem } from "./types";

// Navigation Item Component (Single Responsibility Principle)
interface NavigationItemProps {
  item: NavigationItem;
  onClick?: (item: NavigationItem) => void;
  showIcon?: boolean;
  className?: string;
}

export const NavigationItemComponent: React.FC<NavigationItemProps> = ({
  item,
  onClick,
  showIcon = true,
  className = ""
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const baseClasses = `
    flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200
    ${item.isActive 
      ? "bg-[#34C759] text-white shadow-md" 
      : "text-green-100 hover:bg-green-700 hover:text-white"
    }
  `;

  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {showIcon && item.icon && (
        <span className="text-xl" role="img" aria-label={item.label}>
          {item.icon}
        </span>
      )}
      <span className="font-medium">{item.label}</span>
      {item.isActive && (
        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
      )}
    </div>
  );
};