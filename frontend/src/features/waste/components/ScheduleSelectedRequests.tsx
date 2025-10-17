import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScheduleService } from "../../../services/scheduleService";
import { getUsersByRole } from "../../../services/userService";
import { getAllWasteRequests } from "../../../services/wasteService";
import type { WasteRequest } from "../../../services/wasteService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ScheduleSelectedRequests() {
  const query = useQuery();
  const navigate = useNavigate();
  const idsParam = query.get("requestIds") || "";
  const requestIds = idsParam ? idsParam.split(",") : [];

  const [form, setForm] = useState({ name: "", date: "", time: "08:00", city: "", teamMemberId: "", collectionType: "Recyclable" });
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        // Fetch collectors
        const collectorData = await getUsersByRole("collector");
        setCollectors(collectorData || []);
        if (collectorData && collectorData.length > 0) setForm(f => ({ ...f, teamMemberId: collectorData[0]._id }));

        // Fetch selected waste requests
        if (requestIds.length > 0) {
          const allRequests = await getAllWasteRequests();
          const filtered = allRequests.filter((req: WasteRequest) => requestIds.includes(req._id || ""));

          // Auto-populate form data from requests
          if (filtered.length > 0) {
            // Extract city from first request's address
            const firstAddress = filtered[0].address || "";
            const cityMatch = firstAddress.split(",").pop()?.trim() || "";

            // Get waste types
            const wasteTypes = [...new Set(filtered.map((r: WasteRequest) => r.wasteType))];
            const collectionType = wasteTypes.length === 1 ? wasteTypes[0] : filtered[0].wasteType;

            // Generate schedule name
            const scheduleName = `${collectionType} Collection - ${cityMatch}`;

            setForm(f => ({
              ...f,
              city: cityMatch,
              collectionType: collectionType || "Recyclable",
              name: scheduleName
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    // Validate all required fields
    if (requestIds.length === 0) {
      alert("No requests selected");
      return;
    }

    if (!form.name) {
      alert("Schedule name is required");
      return;
    }

    if (!form.date) {
      alert("Date is required");
      return;
    }

    if (!form.city) {
      alert("City is required");
      return;
    }

    if (!form.teamMemberId) {
      alert("Team assignment is required");
      return;
    }

    setLoading(true);
    try {
      await ScheduleService.createFromRequests({ ...form, requestIds });
      alert("Scheduled successfully");
      navigate("/manager");
    } catch (e) {
      const error = e as Error;
      alert(error.message || "Failed to schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} aria-label="Go back" className="text-gray-600 hover:text-gray-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold">Schedule Waste Collection</h2>
          </div>
          <div className="text-sm text-gray-600">Request ID</div>
        </div>

        <div className="mb-4 flex items-center space-x-3">
          <div className="inline-flex items-center bg-green-50 text-green-700 px-3 py-2 rounded">
            <input type="checkbox" className="mr-2 h-4 w-4 text-green-600" checked readOnly />
            <span className="text-sm">{requestIds.length} Request{requestIds.length !== 1 ? 's' : ''} Selected</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Schedule Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border p-3 rounded"
            placeholder="Enter schedule name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className="w-full border p-3 rounded"
              placeholder="City name"
            />
          </div>

          <div className="flex space-x-2 items-center">
            <div className="w-1/2">
              <label className="block text-sm text-gray-700 mb-2">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border p-3 rounded" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-700 mb-2">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="w-full border p-3 rounded" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Preferred Collection Type</label>
          <div className="flex space-x-3">
            {['Recyclable','Non-Recyclable','Hazardous'].map(type => (
              <button key={type} onClick={() => setForm(f => ({ ...f, collectionType: type }))} className={`px-4 py-2 rounded-full ${form.collectionType === type ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{type}</button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Team and Route Assignment</label>
          <select value={form.teamMemberId} onChange={e => setForm(f => ({ ...f, teamMemberId: e.target.value }))} className="w-1/2 border p-3 rounded">
            {collectors && collectors.length > 0 ? collectors.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            )) : (
              <option value="">Select Team</option>
            )}
          </select>
        </div>

        <div className="mt-2 mb-4 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Schedule Summary</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div><span className="font-medium">Name:</span> {form.name || '—'}</div>
            <div><span className="font-medium">Date & Time:</span> {form.date || '—'} at {form.time || '—'}</div>
            <div><span className="font-medium">City:</span> {form.city || '—'}</div>
            <div><span className="font-medium">Team:</span> {collectors.find(c => c._id === form.teamMemberId)?.name || 'Unassigned'}</div>
            <div><span className="font-medium">Collection Type:</span> {form.collectionType}</div>
            <div><span className="font-medium">Requests:</span> {requestIds.length} waste pickup request{requestIds.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={submit} disabled={loading} className="bg-green-800 text-white px-6 py-3 rounded shadow">{loading ? 'Scheduling...' : 'Confirm Schedule'}</button>
          <button onClick={() => navigate('/manager')} className="border border-gray-300 px-6 py-3 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
