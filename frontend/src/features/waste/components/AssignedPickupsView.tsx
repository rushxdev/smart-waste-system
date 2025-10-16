import React, { useState } from "react";

// Assigned Pickups View Component for Collector (Single Responsibility Principle)
export const AssignedPickupsView: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("time");

  const pickups = [
    {
      id: 1,
      address: "123 Main Street, Apt 2A",
      customerName: "John Smith",
      phone: "+94 77 123 4567",
      pickupTime: "09:00 AM",
      wasteType: "Recyclable",
      status: "pending",
      priority: "normal",
      notes: "Ring doorbell twice",
      estimatedWeight: "15 kg"
    },
    {
      id: 2,
      address: "456 Oak Avenue",
      customerName: "Sarah Johnson",
      phone: "+94 77 234 5678",
      pickupTime: "09:30 AM",
      wasteType: "Organic",
      status: "completed",
      priority: "high",
      notes: "Fragile items included",
      estimatedWeight: "8 kg"
    },
    {
      id: 3,
      address: "789 Pine Road, House #15",
      customerName: "Mike Wilson",
      phone: "+94 77 345 6789",
      pickupTime: "10:15 AM",
      wasteType: "Mixed",
      status: "in-progress",
      priority: "normal",
      notes: "Gate code: 1234",
      estimatedWeight: "22 kg"
    },
    {
      id: 4,
      address: "321 Elm Street",
      customerName: "Emily Davis",
      phone: "+94 77 456 7890",
      pickupTime: "11:00 AM",
      wasteType: "Electronic",
      status: "pending",
      priority: "high",
      notes: "Handle with care - computers",
      estimatedWeight: "12 kg"
    },
    {
      id: 5,
      address: "654 Maple Lane, Unit B",
      customerName: "David Brown",
      phone: "+94 77 567 8901",
      pickupTime: "11:45 AM",
      wasteType: "Recyclable",
      status: "pending",
      priority: "normal",
      notes: "Leave at side entrance",
      estimatedWeight: "18 kg"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "normal":
        return "text-gray-600";
      default:
        return "text-gray-600";
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
        return "🗑️";
      default:
        return "📦";
    }
  };

  const filteredPickups = pickups.filter(pickup => 
    filterStatus === "all" || pickup.status === filterStatus
  );

  const sortedPickups = [...filteredPickups].sort((a, b) => {
    if (sortBy === "time") {
      return a.pickupTime.localeCompare(b.pickupTime);
    } else if (sortBy === "priority") {
      return a.priority === "high" ? -1 : 1;
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
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
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
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">
            {pickups.filter(p => p.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {pickups.filter(p => p.status === "in-progress").length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">
            {pickups.filter(p => p.status === "completed").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-2xl font-bold text-purple-600">
            {pickups.reduce((sum, p) => sum + parseFloat(p.estimatedWeight), 0)} kg
          </div>
          <div className="text-sm text-gray-600">Total Weight</div>
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
          {sortedPickups.map((pickup) => (
            <div key={pickup.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getWasteTypeIcon(pickup.wasteType)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{pickup.address}</h3>
                      <p className="text-gray-600">{pickup.customerName} • {pickup.phone}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Pickup Time:</span>
                      <div className="font-medium text-gray-800">{pickup.pickupTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Waste Type:</span>
                      <div className="font-medium text-gray-800">{pickup.wasteType}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimated Weight:</span>
                      <div className="font-medium text-gray-800">{pickup.estimatedWeight}</div>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                    {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                  </span>
                  
                  <span className={`text-xs font-medium ${getPriorityColor(pickup.priority)}`}>
                    {pickup.priority === "high" ? "🔥 High Priority" : "📋 Normal"}
                  </span>

                  <div className="flex space-x-2 mt-3">
                    <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                      📍 Navigate
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                      📞 Call
                    </button>
                    {pickup.status === "pending" && (
                      <button className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors">
                        ▶️ Start
                      </button>
                    )}
                    {pickup.status === "in-progress" && (
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                        ✅ Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};