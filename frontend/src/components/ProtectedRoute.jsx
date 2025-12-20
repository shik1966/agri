import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If no user data yet, wait a moment (state might be updating)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if role matches - if not, redirect to correct dashboard
  if (role && user.role && user.role !== role) {
    // Redirect to the correct dashboard based on user's actual role
    if (user.role === "farmer") {
      return <Navigate to="/farmer" replace />;
    } else if (user.role === "trader") {
      return <Navigate to="/trader" replace />;
    } else {
      // Admin or unknown role - default to trader
      return <Navigate to="/trader" replace />;
    }
  }

  return children;
}
