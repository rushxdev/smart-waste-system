import { useState } from "react";
import { useAuth } from "../../app/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "resident" });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(form.name, form.email, form.password, form.role);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-4xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-green-700">Register</h2>
        <input
          placeholder="Name"
          className="w-full border border-gray-300 p-2 rounded-2xl focus:border-green-700 focus:outline-green-700"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded-2xl focus:border-green-700 focus:outline-green-700"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded-2xl focus:border-green-700 focus:outline-green-700"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full border border-gray-300 p-2 rounded-2xl focus:border-green-700 focus:outline-green-700"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="resident">Resident</option>
          <option value="collector">Collector</option>
          <option value="manager">Manager</option>
        </select>
        <button
          type="submit"
          className="w-full bg-white border-2 border-green-700 text-green-700 py-2 rounded-2xl hover:bg-green-700 hover:text-white transition duration-200"
        >
          Register
        </button>
        <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-green-700 hover:underline">
            Login
          </a>
        </p>
      </div>
      </form>
    </div>
  );
}
