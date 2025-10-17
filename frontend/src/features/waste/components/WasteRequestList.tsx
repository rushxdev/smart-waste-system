import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type WasteRequest, getResidentWasteRequests } from "../../../services/wasteService";
import { WasteRequestRow } from "./WasteRequestRow";

// Props interface following Interface Segregation Principle
interface WasteRequestListProps {
  filter?: string;
}

// Single Responsibility: Fetch and display filtered list of waste requests
export default function WasteRequestList({ filter = "all" }: WasteRequestListProps) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResidentWasteRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load requests:", err);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Filter requests based on selected filter
  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;

    const status = (request.status || "pending").toLowerCase();
    const filterLower = filter.toLowerCase();

    return status === filterLower;
  });

  const handleRequestClick = (requestId: string) => {
    navigate(`/resident/track-pickup/${requestId}`);
  };

  if (loading) {
    return (
      <div className="bg-white shadow p-6 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow p-6 rounded-xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadRequests}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">
        My Waste Requests
        {filter !== "all" && (
          <span className="ml-2 text-sm font-normal text-gray-600">
            (Filtered by: {filter})
          </span>
        )}
      </h3>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {filter === "all"
              ? "No waste requests yet. Schedule your first pickup to get started!"
              : `No ${filter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border text-left">Type</th>
                <th className="p-3 border">Weight (kg)</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Payment</th>
                <th className="p-3 border">Requested On</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <WasteRequestRow
                  key={request._id}
                  request={request}
                  onClick={handleRequestClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredRequests.length > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          Showing {filteredRequests.length} of {requests.length} requests. Click any row to track pickup status.
        </p>
      )}
    </div>
  );
}
