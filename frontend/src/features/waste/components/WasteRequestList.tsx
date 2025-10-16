import { useEffect, useState } from "react";
import { type WasteRequest, getResidentWasteRequests } from "../../../services/wasteService";

export default function WasteRequestList() {
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getResidentWasteRequests();
      setRequests(data);
    } catch {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">My Waste Requests</h3>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No waste requests yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Weight (kg)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Requested On</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="text-center border-b">
                <td className="p-2 border">{r.wasteType}</td>
                <td className="p-2 border">{r.weight}</td>
                <td
                  className={`p-2 border ${
                    r.status === "Collected" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {r.status || "Pending"}
                </td>
                <td
                  className={`p-2 border ${
                    r.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {r.paymentStatus || "Unpaid"}
                </td>
                <td className="p-2 border">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
