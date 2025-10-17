import { useAuth } from "../../../app/AuthContext";

export default function MyProfile() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <p className="text-gray-900">{user.name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Role</label>
          <p className="text-gray-900 capitalize">{user.role}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">User ID</label>
          <p className="text-gray-600 text-sm">{user.id}</p>
        </div>
      </div>
    </div>
  );
}
