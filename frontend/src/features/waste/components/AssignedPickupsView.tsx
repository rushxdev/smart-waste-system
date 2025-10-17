import React, { useState, useEffect } from "react";
import { getCollectorRequests, updateWorkStatus } from "../../../services/wasteService";
import { useAuth } from "../../../app/AuthContext";
import type { WasteRequest } from "../../../services/wasteService";

// Assigned Pickups View Component for Collector (Single Responsibility Principle)
export const AssignedPickupsView: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [pickups, setPickups] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPickups();
  }, [user]);

  const loadPickups = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getCollectorRequests(user.id);
      setPickups(data);
    } catch (error) {
      console.error("Failed to load pickups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string | undefined, newStatus: string) => {
    if (!requestId) return;
    try {
      await updateWorkStatus(requestId, newStatus);
      await loadPickups(); // Reload data
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };


  const getStatusColor = (workStatus?: string) => {
    switch (workStatus) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Not complete":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWasteTypeIcon = (type: string) => {
    switch (type) {
      case "Recyclable":
        return "♻️";
      case "Organic":
        return "🍃";
      case "Electronic":
        return "💻";
      case "Mixed":
      case "Non-Recyclable":
        return "🗑️";
      case "Hazardous":
        return "⚠️";
      default:
        return "📦";
    }
  };

  const filteredPickups = pickups.filter(pickup =>
    filterStatus === "all" || pickup.workStatus === filterStatus
  );

  const sortedPickups = [...filteredPickups].sort((a, b) => {
    if (sortBy === "time") {
      return (a.preferredTime || "").localeCompare(b.preferredTime || "");
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Assigned Pickups 📦
        </h1>
        <p className="text-gray-600">
          Manage your assigned collection routes and track pickup progress.
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Pickups</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="time">Pickup Time</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📍 Optimize Route
            </button>
          </div>
        </div>
      </div>

      {/* Pickup Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {pickups.filter(p => p.workStatus === "Pending").length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">
            {pickups.filter(p => p.workStatus === "In Progress").length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">
            {pickups.filter(p => p.workStatus === "Completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Pickups List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Today's Pickup Schedule ({sortedPickups.length} items)
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading pickups...</div>
          ) : sortedPickups.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No pickups assigned yet</div>
          ) : (
            sortedPickups.map((pickup) => (
              <div key={pickup._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{getWasteTypeIcon(pickup.wasteType)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{pickup.address}</h3>
                        <p className="text-gray-600">{(pickup as any).residentName || pickup.residentId}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Preferred Date:</span>
                        <div className="font-medium text-gray-800">{pickup.preferredDate}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Preferred Time:</span>
                        <div className="font-medium text-gray-800">{pickup.preferredTime}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Waste Type:</span>
                        <div className="font-medium text-gray-800">{pickup.wasteType}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <div className="font-medium text-gray-800">{pickup.status}</div>
                      </div>
                    </div>

                    {pickup.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600 text-sm font-medium">📝 Note: </span>
                        <span className="text-blue-700 text-sm">{pickup.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.workStatus)}`}>
                      {pickup.workStatus || "Not Started"}
                    </span>

                    <div className="flex flex-col space-y-2 mt-3">
                      {pickup.workStatus === "Pending" && (
                        <button
                          onClick={() => handleStatusUpdate(pickup._id, "In Progress")}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          ▶️ Start
                        </button>
                      )}
                      {pickup.workStatus === "In Progress" && (
                        <button
                          onClick={() => handleStatusUpdate(pickup._id, "Completed")}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          ✅ Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};