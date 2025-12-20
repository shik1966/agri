import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const { isLoggedIn, user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-green-600">AgriMarket</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect farmers and traders in a modern agricultural marketplace.
              Buy and sell fresh produce directly from local farmers.
            </p>

            {!isLoggedIn ? (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition text-lg"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex gap-4 justify-center">
                <Link
                  to={user?.role === "farmer" ? "/farmer" : "/trader"}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold mb-2">For Farmers</h3>
              <p className="text-gray-600">
                List your products, set your prices, and connect directly with traders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">For Traders</h3>
              <p className="text-gray-600">
                Browse fresh products, compare prices, and source directly from farmers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Direct Connection</h3>
              <p className="text-gray-600">
                No middlemen. Connect directly with farmers and negotiate deals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

