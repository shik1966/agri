import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FarmerDashboard() {
  const { user, token, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price_per_unit: "",
    quantity: "",
    category: "",
    unit: "kg",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    try {
      const res = await axios.get(`${API_URL}/api/products/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Product fetch error:", err);
      setError("Failed to load products. Please refresh the page.");
    }
  }

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  async function handleAddProduct(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.title || !formData.price_per_unit || !formData.quantity || !formData.category || !formData.unit) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (Number(formData.price_per_unit) <= 0 || Number(formData.quantity) <= 0) {
      setError("Price and quantity must be greater than 0.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/products`,
        {
          title: formData.title,
          price_per_unit: Number(formData.price_per_unit),
          quantity: Number(formData.quantity),
          category: formData.category,
          unit: formData.unit,
          description: formData.description || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts([res.data, ...products]);
      setFormData({
        title: "",
        price_per_unit: "",
        quantity: "",
        category: "",
        unit: "kg",
        description: "",
      });
      setError("");
    } catch (err) {
      console.error("Product creation error:", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Could not create product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product. Please try again.");
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}. Manage your product listings.</p>
          </div>

          {/* ADD PRODUCT */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Add Product</h2>

        {error && (
          <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAddProduct} className="space-y-3">
          <input
            type="text"
            placeholder="Product title *"
            className="w-full border p-2 rounded"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Price per unit (EGP) *"
              className="w-full border p-2 rounded"
              value={formData.price_per_unit}
              onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
              required
              min="0"
            />

            <input
              type="number"
              placeholder="Quantity *"
              className="w-full border p-2 rounded"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              min="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Category * (e.g., Vegetables, Fruits)"
              className="w-full border p-2 rounded"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />

            <select
              className="w-full border p-2 rounded"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
            >
              <option value="kg">kg</option>
              <option value="ton">ton</option>
              <option value="crate">crate</option>
              <option value="piece">piece</option>
              <option value="bag">bag</option>
            </select>
          </div>

          <textarea
            placeholder="Description (optional)"
            className="w-full border p-2 rounded"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <button 
            className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>

          {/* DISPLAY PRODUCTS */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Listings</h2>
              <span className="text-sm text-gray-600">
                {products.length} {products.length === 1 ? "product" : "products"}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌾</div>
                <p className="text-gray-500 text-lg mb-2">You haven't posted any products yet.</p>
                <p className="text-gray-400 text-sm">Add your first product above to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <Link
                          to={`/products/${p._id}`}
                          className="font-semibold text-lg text-gray-900 hover:text-green-600 transition"
                        >
                          {p.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1 capitalize">{p.category}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        p.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : p.status === "sold"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Price:</span> {p.price_per_unit} EGP per {p.unit}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Quantity:</span> {p.quantity} {p.unit}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Total Value:</span>{" "}
                        {(p.quantity * p.price_per_unit).toLocaleString()} EGP
                      </p>
                      {p.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/products/${p._id}`}
                        className="flex-1 text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
