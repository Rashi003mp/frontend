import React, { useEffect, useState, useRef } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon, PlusIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../../../context/AuthContext";
import { useAdminRevenue } from "../Context/AdminContext";

// Define the initial state for the form outside the component for reusability
const initialFormState = {
  name: "",
  description: "",
  price: "",
  count: "",
  category: "",
  images: [""],
  isActive: true,
  created_at: new Date().toISOString(),
};

export default function CollectionsManagement() {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // --- EDIT/ADD STATE ---
  const [showForm, setShowForm] = useState(false); // Generic state for showing the form
  const [editingProduct, setEditingProduct] = useState(null); // To hold the product being edited
  const [currentFormData, setCurrentFormData] = useState(initialFormState); // State for the form fields
  const formRef = useRef(null); // To scroll to the form when it opens

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auth & Revenue
  const { isAdmin, user, logout } = useAuth();
  const { todayOrdersCount } = useAdminRevenue();

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- HANDLERS FOR ADD & EDIT ---

  // Function to open the form for adding a new product
  const handleStartAdd = () => {
    setEditingProduct(null); // Ensure we're not in edit mode
    setCurrentFormData(initialFormState); // Reset form to initial state
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Function to open the form for editing an existing product
  const handleStartEdit = (product) => {
    setEditingProduct(product); // Set the product to be edited
    setCurrentFormData(product); // Pre-fill the form with its data
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  
  // Function to cancel editing/adding
  const handleCancelForm = () => {
      setShowForm(false);
      setEditingProduct(null);
  };

  // Unified form submission handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const url = editingProduct
      ? `http://localhost:3001/products/${editingProduct.id}` // URL for updating
      : "http://localhost:3001/products"; // URL for creating

    const method = editingProduct ? "PUT" : "POST"; // Method is PUT for edit, POST for new

    // For new products, generate a unique ID and created_at date
    const body = editingProduct 
      ? JSON.stringify(currentFormData)
      : JSON.stringify({ ...currentFormData, id: String(Date.now()), created_at: new Date().toISOString() });

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      setShowForm(false);
      setEditingProduct(null); // Reset editing state
      fetchProducts(); // Refresh the product list
    } catch (err) {
      console.error(`Error ${editingProduct ? 'updating' : 'adding'} product`, err);
    }
  };

  // Delete product (no changes needed here)
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  // Derived state (calculations)
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.count, 0);
  const lowStockCount = products.filter((p) => p.count < 5).length;
  const topSelling = products.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), products[0] || {});
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter(
    (p) =>
      (categoryFilter === "All" || p.category === categoryFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        logout={logout}
        todayOrdersCount={todayOrdersCount}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 p-6">
        {/* Mobile hamburger */}
        <div className="md:hidden mb-4">
          <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-[#CC9966] text-white rounded">
            ☰
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* ... KPI Cards are unchanged ... */}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          {/* ... Toolbar content is unchanged ... */}
          <button
            onClick={handleStartAdd} // Use the new handler to open the add form
            className="flex items-center gap-1 bg-[#CC9966] text-white px-3 py-2 rounded shadow hover:bg-[#B38658]"
          >
            <PlusIcon className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* --- MODIFIED ADD/EDIT PRODUCT FORM --- */}
        {showForm && (
          <div ref={formRef} className="bg-white border border-[#E5D9C5] p-4 rounded mb-4 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <input type="text" placeholder="Name" className="border p-2 rounded"
                  value={currentFormData.name}
                  onChange={(e) => setCurrentFormData({ ...currentFormData, name: e.target.value })}
                />
                <input type="number" placeholder="Price" className="border p-2 rounded"
                  value={currentFormData.price}
                  onChange={(e) => setCurrentFormData({ ...currentFormData, price: Number(e.target.value) || '' })}
                />
                <input type="number" placeholder="Stock Count" className="border p-2 rounded"
                  value={currentFormData.count}
                  onChange={(e) => setCurrentFormData({ ...currentFormData, count: Number(e.target.value) || '' })}
                />
                <input type="text" placeholder="Category" className="border p-2 rounded"
                  value={currentFormData.category}
                  onChange={(e) => setCurrentFormData({ ...currentFormData, category: e.target.value })}
                />
                <input type="text" placeholder="Image URL" className="border p-2 rounded md:col-span-2"
                  value={currentFormData.images[0]}
                  onChange={(e) => setCurrentFormData({ ...currentFormData, images: [e.target.value] })}
                />
              </div>
              <textarea placeholder="Description" className="border p-2 rounded w-full mb-3"
                value={currentFormData.description}
                onChange={(e) => setCurrentFormData({ ...currentFormData, description: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-[#CC9966] text-white px-4 py-2 rounded hover:bg-[#B38658]"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product Table */}
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <ArrowPathIcon className="h-8 w-8 text-[#CC9966] animate-spin" />
            <p className="mt-2 text-sm text-[#5A5A5A]">Loading products...</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5D9C5] rounded shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5D9C5]">
              <thead className="bg-[#F8F5F0]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Image</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Category</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Price</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Stock</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF9F6]">
                    <td className="px-4 py-2">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-2 text-sm">{p.name}</td>
                    <td className="px-4 py-2 text-sm">{p.category}</td>
                    <td className="px-4 py-2 text-sm">₹{p.price}</td>
                    <td className={`px-4 py-2 text-sm ${p.count < 5 ? "text-red-500 font-bold" : ""}`}>{p.count}</td>
                    <td className="px-4 py-2 text-sm">
                      {/* --- ACTION BUTTONS --- */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleStartEdit(p)} // Call edit handler
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <PencilSquareIcon className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
