import { useState } from "react";
import { useAuth } from "../../../app/AuthContext";

export default function MyProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log("Profile update:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-green-600">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-green-100 capitalize">
                {user.role === "collector" ? "Waste Collector" : user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-6">
              {/* Info Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Full Name</span>
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email</span>
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Role</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">User ID</span>
                    <span className="text-gray-500 text-sm font-mono">{user.id}</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Edit Profile
                </h2>
                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Read-only Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user.role}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 capitalize cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">Account Security</h3>
            <p className="text-sm text-blue-700 mt-1">
              Keep your account secure. If you need to change your password or update security
              settings, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
