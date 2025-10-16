import { useState } from "react";
import { useAuth } from "../../app/AuthContext";
import { NavigationLayout } from "../../components/navigation";
import type { NavigationItem } from "../../components/navigation/types";
import { ResidentContent } from "./components/ResidentContent";

export default function ResidentDashboard() {
  const { logout, user } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState<NavigationItem>({
    id: "dashboard",
    label: "Dashboard",
    icon: "🏠",
    path: "/dashboard",
    isActive: true
  });

  const refreshRequests = () => {
    // This will trigger re-render of content when needed
    setActiveNavItem(prev => ({ ...prev }));
  };

  const handleNavigationChange = (item: NavigationItem) => {
    setActiveNavItem(item);
  };

  return (
    <NavigationLayout 
      userRole={user?.role || "resident"}
      currentPath="/dashboard"
      onNavigationChange={handleNavigationChange}
    >
      {/* Header Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {activeNavItem.icon} {activeNavItem.label}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hello, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ResidentContent 
        activeNavItem={activeNavItem}
        onRequestCreated={refreshRequests}
      />
    </NavigationLayout>
  );
}
