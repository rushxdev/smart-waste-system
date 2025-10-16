import React from "react";
import type { NavigationItem } from "../../../components/navigation/types";
import { DashboardWelcome } from "./DashboardWelcome";
import { SchedulePickupView } from "./SchedulePickupView";
import { MyRequestsView } from "./MyRequestsView";
import WasteRequestList from "./WasteRequestList";

// Content Manager Component (Single Responsibility Principle)
interface ResidentContentProps {
  activeNavItem: NavigationItem;
  onRequestCreated: () => void;
}

export const ResidentContent: React.FC<ResidentContentProps> = ({
  activeNavItem,
  onRequestCreated
}) => {
  const renderContent = () => {
    switch (activeNavItem.id) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardWelcome />
            {/* Dashboard also shows recent requests */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Requests
              </h2>
              <WasteRequestList />
            </div>
          </div>
        );

      case "request-pickup":
        return <SchedulePickupView onRequestCreated={onRequestCreated} />;

      case "my-requests":
        return <MyRequestsView />;
      
      case "add-card":
        return <AddCard />;

      case "pricing-summary":
        return <PricingSummary />;
        
      case "tracking":
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Track Your Pickups 📍
              </h1>
              <p className="text-gray-600">
                Track the real-time status of your waste collection requests.
              </p>
            </div>
            
            {/* Tracking Interface */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Active Pickups
              </h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Request #12345</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      In Transit
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Plastic waste - 5kg</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Pickup Progress</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Request #12344</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      Scheduled
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Food waste - 3kg</p>
                  <p className="text-gray-500 text-xs mt-1">Scheduled for tomorrow 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <DashboardWelcome />;
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {renderContent()}
    </div>
  );
};