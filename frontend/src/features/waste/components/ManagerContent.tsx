import React from "react";
import type { NavigationItem } from "../../../components/navigation/types";
import { ManagerWelcome } from "./ManagerWelcome";
import { TeamOverviewView } from "./TeamOverviewView";
import { RouteOptimizationView } from "./RouteOptimizationView";
import ManagerRequests from "./ManagerRequests";

// Manager Content Component following SOLID principles (Single Responsibility Principle)
interface ManagerContentProps {
  activeItem: NavigationItem;
}

export const ManagerContent: React.FC<ManagerContentProps> = ({ activeItem }) => {
  // Mock analytics data for ManagerWelcome component
  const mockAnalytics = {
    totalCollections: 245,
    pendingRequests: 18,
    activeCollectors: 12,
    completionRate: 94.2,
    totalWasteCollected: 1250,
    totalRequests: 187,
    totalPayments: 45000,
    monthlyData: [
      { month: "Jan", waste: 850, payments: 32000 },
      { month: "Feb", waste: 920, payments: 35000 },
      { month: "Mar", waste: 1100, payments: 42000 },
      { month: "Apr", waste: 1250, payments: 45000 },
      { month: "May", waste: 1180, payments: 43000 },
      { month: "Jun", waste: 1350, payments: 48000 },
    ],
    recentActivity: [
      { id: 1, type: "collection", message: "Route A1 completed by John Smith", time: "10 minutes ago" },
      { id: 2, type: "request", message: "New pickup request in Zone B", time: "15 minutes ago" },
      { id: 3, type: "alert", message: "Route C1 delayed due to traffic", time: "23 minutes ago" },
      { id: 4, type: "completion", message: "Daily target achieved for Zone A", time: "1 hour ago" },
    ]
  };

  // Content rendering based on navigation selection (Open/Closed Principle)
  const renderContent = () => {
    switch (activeItem.id) {
      case "manager-dashboard":
        return <ManagerWelcome analytics={mockAnalytics} loading={false} />;
      case "requests":
        return <ManagerRequests />;
      case "team-overview":
        return <TeamOverviewView />;
      case "route-optimization":
        return <RouteOptimizationView />;
      default:
        return <ManagerWelcome analytics={mockAnalytics} loading={false} />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};