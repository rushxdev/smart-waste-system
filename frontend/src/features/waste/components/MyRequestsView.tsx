import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WasteRequestList from "./WasteRequestList";
import { getResidentWasteRequests, type WasteRequest } from "../../../services/wasteService";

// Statistics interface following Interface Segregation Principle
interface RequestStatistics {
  total: number;
  completed: number;
  pending: number;
  totalWeight: number;
}

// My Requests View Component (Single Responsibility Principle)
export const MyRequestsView: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [stats, setStats] = useState<RequestStatistics>({
    total: 0,
    completed: 0,
    pending: 0,
    totalWeight: 0
  });

  const filterButtons = [
    { id: "all", label: "All Requests", color: "blue" },
    { id: "pending", label: "Pending", color: "yellow" },
    { id: "scheduled", label: "Scheduled", color: "orange" },
    { id: "completed", label: "Completed", color: "green" },
    { id: "cancelled", label: "Cancelled", color: "red" }
  ];

  // Fetch and calculate statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const requests: WasteRequest[] = await getResidentWasteRequests();

        const statistics: RequestStatistics = {
          total: requests.length,
          completed: requests.filter(r =>
            r.status === "Completed" || r.status === "Collected"
          ).length,
          pending: requests.filter(r =>
            !r.status || r.status === "Pending"
          ).length,
          totalWeight: requests.reduce((sum, r) => sum + (r.weight || 0), 0)
        };

        setStats(statistics);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
      }
    };

    fetchStatistics();
  }, []);

  const handleScheduleNewPickup = () => {
    navigate("/resident");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          My Waste Requests
        </h1>
        <p className="text-gray-600">
          View and manage all your waste collection requests. Track status, payments, and history.
        </p>
      </div>

      {/* Status Filter */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter by Status</h2>
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? `bg-${filter.color}-500 text-white`
                  : `bg-${filter.color}-100 text-${filter.color}-700 hover:bg-${filter.color}-200`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <WasteRequestList filter={activeFilter} />

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleScheduleNewPickup}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Schedule New Pickup
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Download Report
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
            Contact Support
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalWeight}kg</div>
          <div className="text-sm text-gray-600">Total Weight</div>
        </div>
      </div>
    </div>
  );
};