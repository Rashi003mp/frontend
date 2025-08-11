import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../../../context/AuthContext";
import { useAdminRevenue } from "../Context/AdminContext";

export default function CollectionsManagement() {
  const [products, setProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    count: "",
    category: "",
    images: [""],
    isActive: true,
    created_at: new Date().toISOString(),
  });

  // ✅ Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // ✅ Auth context
  const { isAdmin, user } = useAuth();
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

  // Add product
  const handleAddProduct = async () => {
    try {
      await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, id: String(Date.now()) }),
      });
      setShowAddForm(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        count: "",
        category: "",
        images: [""],
        isActive: true,
        created_at: new Date().toISOString(),
      });
      fetchProducts();
    } catch (err) {
      console.error("Error adding product", err);
    }
  };

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">

      {/* ✅ Sidebar */}
      <AdminSidebar
        user={user}
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
          <div className="bg-white p-4 rounded shadow border border-[#E5D9C5]">
            <h4 className="text-xs text-gray-500">Total Products</h4>
            <p className="text-2xl font-light">{totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border border-[#E5D9C5]">
            <h4 className="text-xs text-gray-500">Total Inventory Value</h4>
            <p className="text-2xl font-light">₹{totalInventoryValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border border-[#E5D9C5]">
            <h4 className="text-xs text-gray-500">Low Stock (&lt;5)</h4>
            <p className="text-2xl font-light">{lowStockCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow border border-[#E5D9C5]">
            <h4 className="text-xs text-gray-500">Top Product</h4>
            <p className="text-sm font-medium">{topSelling?.name || "-"}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
          <div className="flex gap-2">
            <select
              className="border border-[#E5D9C5] rounded px-3 py-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute left-2 top-2.5" />
              <input
                type="text"
                className="pl-8 pr-3 py-2 border border-[#E5D9C5] rounded text-sm"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 bg-[#CC9966] text-white px-3 py-2 rounded shadow hover:bg-[#B38658]"
          >
            <PlusIcon className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white border border-[#E5D9C5] p-4 rounded mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <input
                type="text" placeholder="Name"
                className="border p-2 rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="number" placeholder="Price"
                className="border p-2 rounded"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
              />
              <input
                type="number" placeholder="Stock Count"
                className="border p-2 rounded"
                value={newProduct.count}
                onChange={(e) => setNewProduct({ ...newProduct, count: parseInt(e.target.value) })}
              />
              <input
                type="text" placeholder="Category"
                className="border p-2 rounded"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <input
                type="text" placeholder="Image URL"
                className="border p-2 rounded md:col-span-2"
                value={newProduct.images[0]}
                onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
              />
            </div>
            <textarea
              placeholder="Description"
              className="border p-2 rounded w-full mb-3"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <button
              onClick={handleAddProduct}
              className="bg-[#CC9966] text-white px-4 py-2 rounded hover:bg-[#B38658]"
            >
              Save Product
            </button>
          </div>
        )}

        {/* Product Table */}
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <ArrowPathIcon className="h-8 w-8 text-[#CC9966] animate-spin" />
            <p className="mt-2 text-sm text-[#5A5A5A]">Loading products...</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5D9C5] rounded shadow">
            <table className="min-w-full divide-y divide-[#E5D9C5]">
              <thead className="bg-[#F8F5F0]">
                <tr>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Image</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Category</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Price</th>
                  <th className="px-4 py-2 text-left text-xs text-gray-600">Stock</th>
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
                    <td className={`px-4 py-2 text-sm ${p.count < 5 ? "text-red-500" : ""}`}>{p.count}</td>
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
