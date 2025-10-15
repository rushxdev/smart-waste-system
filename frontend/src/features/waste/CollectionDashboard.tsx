import { useAuth } from "../../app/AuthContext";
import CollectorRequestList from "./components/CollectorRequestList";

export default function CollectorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          🚛 Collector Dashboard — {user?.name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <CollectorRequestList />
    </div>
  );
}

