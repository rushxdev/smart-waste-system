import React from "react";
import { useAuth } from "../../../app/AuthContext";

// Dashboard Welcome Component (Single Responsibility Principle)
export const DashboardWelcome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-green-100 text-lg">
          Here's an overview of your waste management activity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📋</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Requests</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✅</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏳</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};