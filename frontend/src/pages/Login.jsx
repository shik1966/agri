import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // <-- NEW
  const nav = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", { email, password });

      if (res.data.token && res.data.user) {
        const userRole = res.data.user.role;
        
        // Update auth context first
        login(res.data.user, res.data.token);
        
        // Navigate based on role - use a small delay to ensure state is updated
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
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || "Invalid email or password. Please try again.";
      setError(errorMsg);
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
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p> // <-- NEW
        )}

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        <p className="mt-3 text-sm">
          No account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </form>
      </div>
    </>
  );
}
