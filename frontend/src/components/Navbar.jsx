import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to={isLoggedIn ? (user?.role === "farmer" ? "/farmer" : "/trader") : "/"} className="flex items-center hover:opacity-80 transition">
            <span className="text-2xl font-bold text-green-600">🌾 AgriMarket</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {user?.role === "trader" && (
                  <Link
                    to="/trader"
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Browse Products
                  </Link>
                )}
                {user?.role === "farmer" && (
                  <Link
                    to="/farmer"
                    className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    My Products
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user?.name} ({user?.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

