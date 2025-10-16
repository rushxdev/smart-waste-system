import React from "react";
import type { NavigationItem } from "../../../components/navigation/types";
import { CollectorWelcome } from "./CollectorWelcome";
import { AssignedPickupsView } from "./AssignedPickupsView";

// Collector Content Component following SOLID principles (Single Responsibility Principle)
interface CollectorContentProps {
  activeItem: NavigationItem;
}

export const CollectorContent: React.FC<CollectorContentProps> = ({ activeItem }) => {
  // Mock collector stats data for CollectorWelcome component
  const mockStats = {
    todayPickups: 15,
    completedPickups: 8,
    remainingPickups: 7,
    totalDistance: 24.5,
    estimatedTime: "4h 15m",
    currentRoute: "Route A1 - Morning",
    nextPickup: {
      address: "789 Pine Road, House #15",
      time: "10:15 AM",
      type: "Mixed Waste"
    }
  };

  // Content rendering based on navigation selection (Open/Closed Principle)
  const renderContent = () => {
    switch (activeItem.id) {
      case "dashboard":
        return <CollectorWelcome stats={mockStats} loading={false} />;
      case "assigned-pickups":
        return <AssignedPickupsView />;
      default:
        return <CollectorWelcome stats={mockStats} loading={false} />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};