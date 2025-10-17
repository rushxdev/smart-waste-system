import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ScheduleService } from "../../../services/scheduleService";
import { getUsersByRole } from "../../../services/userService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ScheduleSelectedRequests() {
  const query = useQuery();
  const navigate = useNavigate();
  const idsParam = query.get("requestIds") || "";
  const requestIds = idsParam ? idsParam.split(",") : [];

  const [form, setForm] = useState({ date: "", time: "08:00", city: "", teamMemberId: "", collectionType: "Recyclable" });
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsersByRole("collector");
        setCollectors(data || []);
        if (data && data.length > 0) setForm(f => ({ ...f, teamMemberId: data[0]._id }));
      } catch (e) {
        console.error("Failed to load collectors", e);
      }
    })();
  }, []);

  const submit = async () => {
    if (requestIds.length === 0) {
      alert("No requests selected");
      return;
    }

    if (!form.teamMemberId) {
      alert("Assign Team to confirm");
      return;
    }

    setLoading(true);
    try {
      await ScheduleService.createFromRequests({ ...form, requestIds });
      alert("Scheduled successfully");
      navigate("/manager/requests");
    } catch (e: any) {
      alert(e.message || "Failed to schedule");
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
            <span className="text-sm">{requestIds.length} Individuals Selected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Select City</label>
            <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border p-3 rounded">
              <option value="">City</option>
              <option>City A</option>
              <option>City B</option>
            </select>
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
            {['Recyclable','Non-Recyclable','Hazarduous'].map(type => (
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
          <h4 className="font-semibold mb-2">Summary</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>{form.date || '—'} {form.time || ''}</div>
            <div>Team: <span className="font-medium">{collectors.find(c => c._id === form.teamMemberId)?.name || 'Unassigned'}</span></div>
            <div>{form.collectionType}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={submit} disabled={loading} className="bg-green-800 text-white px-6 py-3 rounded shadow">{loading ? 'Scheduling...' : 'Confirm Schedule'}</button>
          <button onClick={() => navigate('/manager')} className="border border-gray-300 px-6 py-3 rounded">Cancel</button>
        </div>

        {!form.teamMemberId && <div className="text-sm text-red-600 mt-3">Assign Team to confirm</div>}
      </div>
    </div>
  );
}
