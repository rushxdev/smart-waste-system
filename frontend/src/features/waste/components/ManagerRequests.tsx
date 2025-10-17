import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllWasteRequests } from "../../../services/wasteService";

export default function ManagerRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // Form moved to separate page; keep only selection state here
  const [view, setView] = useState<"unscheduled" | "scheduled">("unscheduled");
  const location = useLocation();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllWasteRequests();
      setRequests(data);
    } catch (e) {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // read optional ?view= scheduled|unscheduled to set initial tab
    const params = new URLSearchParams(location.search);
    const v = params.get('view');
    if (v === 'scheduled' || v === 'unscheduled') setView(v);
    load(); 
  }, [location.search]);

  const toggle = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const navigate = useNavigate();
  const openSchedule = () => {
    if (selected.length === 0) return alert("Select one or more requests to schedule");
    // navigate to scheduling page with selected IDs
    const q = selected.join(",");
    navigate(`/manager/schedule-requests?requestIds=${encodeURIComponent(q)}`);
  };

  // submit is handled on the schedule page

  const unscheduled = requests.filter(r => (r.status || 'Pending') === 'Pending');
  const scheduled = requests.filter(r => (r.status || 'Pending') === 'Scheduled');

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Pickup Requests</h3>
      {/* Top links to switch between views */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setView("unscheduled")}
          className={`px-3 py-1 rounded ${view === "unscheduled" ? "bg-green-600 text-white" : "bg-gray-100"}`}
        >
          Unscheduled Requests
        </button>
        <button
          onClick={() => setView("scheduled")}
          className={`px-3 py-1 rounded ${view === "scheduled" ? "bg-green-600 text-white" : "bg-gray-100"}`}
        >
          Scheduled Requests
        </button>
      </div>
      {loading ? <p>Loading...</p> : (
        <>
          {view === "unscheduled" && (
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Unscheduled Requests</h4>
                <div className="flex items-center space-x-2">
                  <button onClick={openSchedule} className="bg-green-600 text-white px-4 py-2 rounded">Schedule</button>
                  <button onClick={load} className="bg-gray-200 px-4 py-2 rounded">Refresh</button>
                </div>
              </div>
                {unscheduled.length === 0 ? (
                  <p className="text-sm text-gray-600">No unscheduled requests.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-sm overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unscheduled.map((r, idx) => (
                          <tr key={r._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50`}> 
                            <td className="px-4 py-3">
                              <input aria-label={`Select request ${r._id}`} type="checkbox" className="h-4 w-4 text-green-600 rounded border-gray-300" checked={selected.includes(r._id)} onChange={() => toggle(r._id)} />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">{r.residentName || r.residentId}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{r.workStatus || 'Not complete'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{r.wasteType}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{r.address || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${r.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : r.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                {r.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </section>
          )}

          {view === "scheduled" && (
            <section>
              <h4 className="font-medium mb-2">Scheduled Requests</h4>
              <div className="flex items-center justify-between mb-3">
                <div />
                <div className="flex items-center space-x-2">
                  <button onClick={load} className="bg-gray-200 px-4 py-2 rounded">Refresh</button>
                </div>
              </div>
              {scheduled.length === 0 ? (
                <p className="text-sm text-gray-600">No scheduled requests.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduled.map((r, idx) => (
                        <tr key={r._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50`}>
                          <td className="px-4 py-3 text-sm text-gray-800">{r.residentName || r.residentId}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.workStatus || 'Pending'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.wasteType}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.address || '-'}</td>
                          <td className="px-4 py-3 text-sm"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{r.status}</span></td>
                          <td className="px-4 py-3 text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* Scheduling now happens on separate page */}
        </>
      )}
    </div>
  );
}
