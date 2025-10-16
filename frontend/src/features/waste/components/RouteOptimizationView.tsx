import React, { useState } from "react";

// Route Optimization Component for Manager (Single Responsibility Principle)
export const RouteOptimizationView: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState("all");
  const [optimizationMode, setOptimizationMode] = useState("efficiency");

  const zones = [
    { id: "all", name: "All Zones" },
    { id: "zone-a", name: "Zone A" },
    { id: "zone-b", name: "Zone B" },
    { id: "zone-c", name: "Zone C" },
  ];

  const optimizationOptions = [
    { id: "efficiency", name: "Efficiency", icon: "⚡", description: "Minimize time and fuel consumption" },
    { id: "distance", name: "Distance", icon: "📏", description: "Shortest total distance" },
    { id: "priority", name: "Priority", icon: "🔥", description: "High-priority requests first" },
    { id: "balanced", name: "Balanced", icon: "⚖️", description: "Balance all factors" },
  ];

  const routes = [
    {
      id: 1,
      name: "Route A1-Optimized",
      zone: "Zone A",
      totalDistance: "12.3 km",
      estimatedTime: "2h 45m",
      fuelCost: "$18.50",
      stops: 15,
      efficiency: 92,
      status: "optimized"
    },
    {
      id: 2,
      name: "Route B1-Current",
      zone: "Zone B",
      totalDistance: "16.8 km",
      estimatedTime: "3h 20m",
      fuelCost: "$25.20",
      stops: 18,
      efficiency: 78,
      status: "current"
    },
    {
      id: 3,
      name: "Route C1-Suggested",
      zone: "Zone C",
      totalDistance: "14.1 km",
      estimatedTime: "2h 55m",
      fuelCost: "$21.15",
      stops: 16,
      efficiency: 85,
      status: "suggested"
    },
  ];

  const optimizationResults = {
    totalSavings: "23%",
    fuelSavings: "$127.50",
    timeSavings: "4h 15m",
    efficiencyGain: "15%"
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Route Optimization 🗺️
        </h1>
        <p className="text-gray-600">
          Optimize collection routes for maximum efficiency and cost savings.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Zone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Zone
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          {/* Optimization Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optimization Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {optimizationOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setOptimizationMode(option.id)}
                  className={`p-2 rounded-lg border text-sm transition-colors ${
                    optimizationMode === option.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  title={option.description}
                >
                  {option.icon} {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optimization Button */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            🚀 Run Optimization
          </button>
        </div>
      </div>

      {/* Optimization Results */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Optimization Results</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{optimizationResults.totalSavings}</div>
            <div className="text-sm text-gray-600">Total Savings</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{optimizationResults.fuelSavings}</div>
            <div className="text-sm text-gray-600">Fuel Savings</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{optimizationResults.timeSavings}</div>
            <div className="text-sm text-gray-600">Time Savings</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{optimizationResults.efficiencyGain}</div>
            <div className="text-sm text-gray-600">Efficiency Gain</div>
          </div>
        </div>
      </div>

      {/* Route Comparison */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Route Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stops
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{route.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.zone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.totalDistance}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.estimatedTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.fuelCost}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{route.stops}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            route.efficiency >= 90 ? 'bg-green-600' :
                            route.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${route.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{route.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      route.status === "optimized" 
                        ? "bg-green-100 text-green-800"
                        : route.status === "suggested"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-green-600 hover:text-green-900">Apply</button>
                    <button className="text-purple-600 hover:text-purple-900">Export</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Route Visualization</h2>
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <div className="text-gray-600">Interactive map with optimized routes</div>
            <div className="text-sm text-gray-500 mt-1">Map integration coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};