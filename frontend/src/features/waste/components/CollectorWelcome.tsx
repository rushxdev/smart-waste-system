import React from "react";
import { useAuth } from "../../../app/AuthContext";

// Collector Dashboard Welcome Component (Single Responsibility Principle)
interface CollectorWelcomeProps {
  stats: {
    todayPickups: number;
    completedPickups: number;
    remainingPickups: number;
    totalDistance: number;
    estimatedTime: string;
    currentRoute: string;
    nextPickup?: {
      address: string;
      time: string;
      type: string;
    };
  };
  loading: boolean;
}

export const CollectorWelcome: React.FC<CollectorWelcomeProps> = ({ stats, loading }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Good day, {user?.name}! 🚛
        </h1>
        <p className="text-green-100 text-lg">
          Ready for today's collection route? Let's make a difference in our community!
        </p>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your route information...</p>
        </div>
      ) : stats ? (
        <>
          {/* Today's Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">📦</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Today's Pickups</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.todayPickups}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.completedPickups}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">⏳</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Remaining</h3>
                  <p className="text-2xl font-bold text-orange-600">{stats.remainingPickups}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🗺️</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Route Distance</h3>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalDistance} km</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Route Information */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 Current Route Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Route Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route Name:</span>
                    <span className="font-medium text-gray-800">{stats.currentRoute}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="font-medium text-gray-800">{stats.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium text-gray-800">
                      {stats.completedPickups}/{stats.todayPickups} pickups
                    </span>
                  </div>
                </div>
              </div>

              {stats.nextPickup && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Next Pickup</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-2">🏠</span>
                        <span className="font-medium text-gray-800">{stats.nextPickup.address}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-2">⏰</span>
                        <span className="text-gray-700">{stats.nextPickup.time}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-2">🗑️</span>
                        <span className="text-gray-700">{stats.nextPickup.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Progress</h2>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Route Completion</span>
                <span>{Math.round((stats.completedPickups / stats.todayPickups) * 100)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(stats.completedPickups / stats.todayPickups) * 100}%` }}
              ></div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};