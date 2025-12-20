import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Register() {
  const [role, setRole] = useState("farmer");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        ...form,
        role,
      });

      if (res.data.token && res.data.user) {
        const userRole = res.data.user.role;
        
        // Update auth context first
        login(res.data.user, res.data.token);
        
        // Navigate based on role from response - use a small delay to ensure state is updated
        setTimeout(() => {
          if (userRole === "farmer") {
            nav("/farmer", { replace: true });
          } else if (userRole === "trader") {
            nav("/trader", { replace: true });
          } else {
            // Admin or other roles - default to trader for now
            nav("/trader", { replace: true });
          }
        }, 100);
      } else {
        setError("Invalid response from server. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || "Registration failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 w-full max-w-sm rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
        />

        <select
          className="w-full p-2 border rounded mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="farmer">Farmer</option>
          <option value="trader">Trader</option>
        </select>

        <button 
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </form>
      </div>
    </>
  );
}
