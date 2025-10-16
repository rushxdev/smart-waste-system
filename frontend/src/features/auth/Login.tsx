import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
      ><div className="flex items-center justify-center mb-4">
        <div className="w-20 h-20 bg-transparent rounded-full p-2 shadow-lg">
          <img 
        src="/Sustainability-Focused CleanSphere Logo - Minimalist Design 3.png" 
        alt="CleanSphere Logo" 
        className="w-full h-full object-contain"
          />
        </div>
      </div>
        <h2 className="text-2xl font-semibold text-center text-green-700">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded-2xl focus:border-green-700 focus:outline-green-700"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded-2xl focus:border-green-700 focus:outline-green-700"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-white border-2 border-green-700 text-green-700 py-2 rounded-2xl hover:bg-green-700 hover:text-white transition duration-200"
        >
          Login
        </button>
        <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-green-700 hover:underline">
            Register
          </a>
        </p>
      </div>
      </form>
    </div>
  );
}
