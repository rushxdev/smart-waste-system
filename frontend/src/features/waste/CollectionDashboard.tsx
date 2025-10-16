import { NavigationLayout } from "../../components/navigation/NavigationLayout";
import { CollectorContent } from "./components/CollectorContent";
import { NavigationDataFactory } from "../../components/navigation/NavigationDataFactory";
import type { NavigationItem } from "../../components/navigation/types";
import { useState } from "react";

// Collector Dashboard with navigation (following SOLID principles)
export default function CollectorDashboard() {
  const [activeItem, setActiveItem] = useState<NavigationItem>(
    NavigationDataFactory.createCollectorNavigationItems()[0]
  );

  const handleNavigationChange = (item: NavigationItem) => {
    setActiveItem(item);
  };

  return (
    <NavigationLayout
      userRole="collector"
      onNavigationChange={handleNavigationChange}
      activeItem={activeItem}
    >
      <CollectorContent activeItem={activeItem} />
    </NavigationLayout>
  );
}

