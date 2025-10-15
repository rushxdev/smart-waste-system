import { useEffect, useState } from "react";
import { getAnalyticsData, type AnalyticsData } from "../../services/analyticsService";
import AnalyticsCard from "./components/AnalyticsCard";
import { useAuth } from "../../app/AuthContext";
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

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsData();
      setAnalytics(data);
    } catch {
      alert("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          🧑‍💼 Admin Dashboard — {user?.name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {loading ? (
        <p>Loading analytics...</p>
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

          {/* Monthly performance chart */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Monthly Overview
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
        </>
      ) : (
        <p>No analytics data found.</p>
      )}
    </div>
  );
}
