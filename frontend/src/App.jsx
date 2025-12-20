import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import FarmerDashboard from "./pages/FarmerDashboard";
import TraderDashboard from "./pages/TraderDashboard";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public product detail page */}
      <Route path="/products/:id" element={<ProductDetail />} />

      <Route
        path="/farmer"
        element={
          <ProtectedRoute role="farmer">
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trader"
        element={
          <ProtectedRoute role="trader">
            <TraderDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
