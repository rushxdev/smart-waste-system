import { useEffect, useState } from "react";
import { type WasteRequest, getCollectorRequests, updateRequestStatus } from "./../../../services/wasteService";

export default function CollectorRequestList() {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getCollectorRequests();
      setRequests(data);
    } catch {
      alert("Failed to load assigned requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, currentStatus?: string) => {
    const newStatus = currentStatus === "Pending" ? "Collected" : "Pending";
    try {
      await updateRequestStatus(id, newStatus);
      await loadRequests();
    } catch {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Assigned Waste Requests</h3>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No assigned requests.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Resident</th>
              <th className="p-2 border">Waste Type</th>
              <th className="p-2 border">Weight (kg)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="text-center border-b">
                <td className="p-2 border">{r.residentName || "Resident"}</td>
                <td className="p-2 border">{r.wasteType}</td>
                <td className="p-2 border">{r.weight}</td>
                <td
                  className={`p-2 border ${
                    r.status === "Collected" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {r.status}
                </td>
                <td
                  className={`p-2 border ${
                    r.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {r.paymentStatus}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleStatusUpdate(r._id!, r.status)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    {r.status === "Collected" ? "Mark Pending" : "Mark Collected"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
