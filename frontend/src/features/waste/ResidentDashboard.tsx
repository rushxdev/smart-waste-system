import { useState } from "react";
import { useAuth } from "../../app/AuthContext";
import { NavigationLayout } from "../../components/navigation";
import type { NavigationItem } from "../../components/navigation/types";
import { ResidentContent } from "./components/ResidentContent";

export default function ResidentDashboard() {
  const { user } = useAuth();
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
      activeItem={activeNavItem}
    >
      {/* Main Content */}
      <ResidentContent 
        activeNavItem={activeNavItem}
        onRequestCreated={refreshRequests}
      />
    </NavigationLayout>
  );
}
