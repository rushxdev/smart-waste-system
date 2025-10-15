import { useState } from "react";
import WasteRequestForm from "./components/wasteRequestForm";
import WasteRequestList from "./components/WasteRequestList";
import { useAuth } from "../../app/AuthContext";

export default function ResidentDashboard() {
  const { logout, user } = useAuth();
  const [reloadFlag, setReloadFlag] = useState(false);

  const refreshRequests = () => setReloadFlag((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          👋 Welcome, {user?.name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <WasteRequestForm onRequestCreated={refreshRequests} />
        <WasteRequestList key={String(reloadFlag)} />
      </div>
    </div>
  );
}
