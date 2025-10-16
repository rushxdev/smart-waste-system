import { NavigationLayout } from "../../components/navigation/NavigationLayout";
import { ManagerContent } from "./components/ManagerContent";
import { NavigationDataFactory } from "../../components/navigation/NavigationDataFactory";
import type { NavigationItem } from "../../components/navigation/types";
import { useState } from "react";

// Manager Dashboard with navigation (following SOLID principles)
export default function ManagerDashboard() {
  const [activeItem, setActiveItem] = useState<NavigationItem>(
    NavigationDataFactory.createManagerNavigationItems()[0]
  );

  const handleNavigationChange = (item: NavigationItem) => {
    setActiveItem(item);
  };

  return (
    <NavigationLayout
      userRole="manager"
      onNavigationChange={handleNavigationChange}
      activeItem={activeItem}
    >
      <ManagerContent activeItem={activeItem} />
    </NavigationLayout>
  );
}
