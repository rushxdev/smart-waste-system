import React from "react";
import WasteRequestForm from "./wasteRequestForm";

// Schedule Pickup View Component (Single Responsibility Principle)
interface SchedulePickupViewProps {
  onRequestCreated: () => void;
}

export const SchedulePickupView: React.FC<SchedulePickupViewProps> = ({ 
  onRequestCreated 
}) => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Schedule New Pickup 📅
        </h1>
        <p className="text-gray-600">
          Create a new waste collection request. Fill in the details below and we'll schedule a pickup for you.
        </p>
      </div>
     
      {/* Request Form */}
      <div className="max-w-2xl">
        <WasteRequestForm onRequestCreated={onRequestCreated} />
      </div>
    </div>
  );
};