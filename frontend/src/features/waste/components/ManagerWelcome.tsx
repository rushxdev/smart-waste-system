import React from "react";
import { useAuth } from "../../../app/AuthContext";
import AnalyticsCard from "./AnalyticsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Manager Dashboard Welcome Component (Single Responsibility Principle)
interface ManagerWelcomeProps {
  analytics: any;
  loading: boolean;
}

export const ManagerWelcome: React.FC<ManagerWelcomeProps> = ({ analytics, loading }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, Manager {user?.name}! 👨‍💼
        </h1>
        <p className="text-green-100 text-lg">
          Overview of your waste management operations and team performance
        </p>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      ) : analytics ? (
        <>
          {/* Top summary cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Total Waste Collected (kg)"
              value={analytics.totalWasteCollected}
              color="green"
            />
            <AnalyticsCard
              title="Total Collection Requests"
              value={analytics.totalRequests}
              color="blue"
            />
            <AnalyticsCard
              title="Total Payments (LKR)"
              value={`Rs. ${analytics.totalPayments.toLocaleString()}`}
              color="yellow"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Completed Today</h3>
                  <p className="text-2xl font-bold text-green-600">24</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">👥</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Active Collectors</h3>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🚛</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Routes Active</h3>
                  <p className="text-2xl font-bold text-yellow-600">12</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="text-2xl mr-3">💰</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Today's Revenue</h3>
                  <p className="text-2xl font-bold text-purple-600">Rs. 45,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly performance chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Monthly Performance Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="waste"
                  stroke="#22c55e"
                  name="Waste (kg)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="payments"
                  stroke="#3b82f6"
                  name="Payments (Rs)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Management Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Route optimization completed - 1 hour ago</span>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">New collector assigned to Zone A - 2 hours ago</span>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Weekly report generated - 3 hours ago</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Payment reconciliation completed - 5 hours ago</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">Analytics data is not available at the moment.</p>
        </div>
      )}
    </div>
  );
};