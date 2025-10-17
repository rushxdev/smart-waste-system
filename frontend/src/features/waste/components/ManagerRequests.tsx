import { useEffect, useState } from "react";
import { getAllWasteRequests } from "../../../services/wasteService";
import { ScheduleService } from "../../../services/scheduleService";

export default function ManagerRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", time: "08:00", city: "", managerId: "manager123" });

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

  useEffect(() => { load(); }, []);

  const toggle = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const openSchedule = () => {
    if (selected.length === 0) return alert("Select one or more requests to schedule");
    setShowForm(true);
  };

  const submit = async () => {
    try {
      await ScheduleService.createFromRequests({ ...form, requestIds: selected });
      alert("Scheduled successfully");
      setShowForm(false);
      setSelected([]);
      load();
    } catch (e: any) {
      alert(e.message || "Failed to schedule");
    }
  };

  const unscheduled = requests.filter(r => (r.status || 'Pending') === 'Pending');
  const scheduled = requests.filter(r => (r.status || 'Pending') === 'Scheduled');

  return (
    <div className="bg-white shadow p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">Pickup Requests</h3>
      {loading ? <p>Loading...</p> : (
        <>
          <section className="mb-6">
            <h4 className="font-medium mb-2">Unscheduled Requests</h4>
            {unscheduled.length === 0 ? (
              <p>No unscheduled requests.</p>
            ) : (
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Select</th>
                    <th className="p-2 border">Resident</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Weight</th>
                    <th className="p-2 border">Requested On</th>
                  </tr>
                </thead>
                <tbody>
                  {unscheduled.map((r) => (
                    <tr key={r._id} className="text-center border-b">
                      <td className="p-2 border">
                        <input type="checkbox" checked={selected.includes(r._id)} onChange={() => toggle(r._id)} />
                      </td>
                      <td className="p-2 border">{r.residentName || r.residentId}</td>
                      <td className="p-2 border">{r.wasteType}</td>
                      <td className="p-2 border">{r.weight}</td>
                      <td className="p-2 border">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="flex items-center space-x-2">
              <button onClick={openSchedule} className="bg-green-600 text-white px-4 py-2 rounded">Schedule</button>
              <button onClick={load} className="bg-gray-200 px-4 py-2 rounded">Refresh</button>
            </div>
          </section>

          <section>
            <h4 className="font-medium mb-2">Scheduled Requests</h4>
            {scheduled.length === 0 ? (
              <p>No scheduled requests.</p>
            ) : (
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Resident</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Weight</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Requested On</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduled.map((r) => (
                    <tr key={r._id} className="text-center border-b">
                      <td className="p-2 border">{r.residentName || r.residentId}</td>
                      <td className="p-2 border">{r.wasteType}</td>
                      <td className="p-2 border">{r.weight}</td>
                      <td className="p-2 border">{r.status}</td>
                      <td className="p-2 border">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {showForm && (
            <div className="mt-6 p-4 border rounded">
              <h4 className="font-medium mb-2">Schedule Selected Requests</h4>
              <div className="grid grid-cols-2 gap-2">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Schedule name" className="p-2 border" />
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="p-2 border" />
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="p-2 border" />
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" className="p-2 border" />
              </div>
              <div className="mt-4 space-x-2">
                <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">Confirm</button>
                <button onClick={() => setShowForm(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
