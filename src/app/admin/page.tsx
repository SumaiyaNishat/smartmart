"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface OrderDetail {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  thana: string;
  district: string;
  product: {
    _id: string;
    name: string;
    price: number;
  } | null;
  quantity: number;
  totalPrice: number;
  deliveryStatus: "pending" | "delivered";
  createdAt: string;
}

interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  discount: number;
  featured: boolean;
}

interface UserDetail {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  blocked: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState<"overview" | "orders" | "products" | "users">("overview");

  // State caches
  const [stats, setStats] = React.useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [orders, setOrders] = React.useState<OrderDetail[]>([]);
  const [products, setProducts] = React.useState<ProductDetail[]>([]);
  const [users, setUsers] = React.useState<UserDetail[]>([]);

  // Loadings
  const [loadingStats, setLoadingStats] = React.useState(true);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  // Deliver Confirmation Modal
  const [deliverTarget, setDeliverTarget] = React.useState<OrderDetail | null>(null);
  const [delivering, setDelivering] = React.useState(false);

  // Product CRUD Form States
  const [editingProduct, setEditingProduct] = React.useState<ProductDetail | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [productForm, setProductForm] = React.useState({
    name: "",
    description: "",
    price: 0,
    category: "Electronics",
    stock: 10,
    discount: 0,
    featured: false,
    imageUrl: "",
  });

  // Verify Admin Authentication
  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Please login to access the admin panel.");
        router.push("/login");
      } else if (user.role !== "admin") {
        toast.error("Access denied. Admin permissions required.");
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  // Fetches
  const fetchStats = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      if (res.data && res.data.stats) {
        setStats(res.data.stats);
      }
    } catch {
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/orders?admin=true");
      if (res.data && res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch {
      toast.error("Failed to load user orders database.");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/products");
      if (res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } catch {
      toast.error("Failed to load products list.");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await axios.get("/api/users");
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch {
      toast.error("Failed to load user database lists.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  React.useEffect(() => {
    if (user && user.role === "admin") {
      fetchStats();
      fetchOrders();
      fetchProducts();
      fetchUsers();
    }
  }, [user, fetchStats, fetchOrders, fetchProducts, fetchUsers]);

  // Deliver handler
  const handleConfirmDeliver = async () => {
    if (!deliverTarget) return;
    setDelivering(true);
    try {
      await axios.put(`/api/orders/${deliverTarget._id}/deliver`);
      toast.success("Order marked as Delivered successfully.");
      setDeliverTarget(null);
      // Refresh statistics and data
      fetchStats();
      fetchOrders();
    } catch {
      toast.error("Failed to update delivery status.");
    } finally {
      setDelivering(false);
    }
  };

  // Block User handler
  const handleToggleBlockUser = async (targetUser: UserDetail) => {
    try {
      await axios.put("/api/users", {
        userId: targetUser._id,
        blocked: !targetUser.blocked,
      });
      toast.success(`User successfully ${targetUser.blocked ? "unblocked" : "blocked"}.`);
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update user block status.");
    }
  };

  // Product Add / Update handler
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        images: productForm.imageUrl ? [productForm.imageUrl] : ["https://lh3.googleusercontent.com/aida-public/AB6AXuBG72ByqQqFaNO-0JN9q3JrwnT6ekzSNDm8OHx-o9zMU3b3jzE288O66SLff4ltW3RdE77_yHRs_cQFLDbnJmToGAyYpKmqM5-Ut4_sjc1hC6MIzdj8zpBfqEVwqpO6nREgKh9FIN2L7c0JWnYOCzwuWrqeUkey7KRgWZb6QmVhEsbUEzivzb18gnoWKCaCwUNm4fXaFZgjPFGE0gqhf0B4jh53Q6VB1HY2K-rgsSdBlw-UzPPvOJ72B9_9KBbJLdRFBQ"],
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
        toast.success("Product details revised successfully.");
      } else {
        await axios.post("/api/products", payload);
        toast.success("Product created successfully.");
      }

      setIsProductFormOpen(false);
      setEditingProduct(null);
      // Reset Form
      setProductForm({
        name: "",
        description: "",
        price: 0,
        category: "Electronics",
        stock: 10,
        discount: 0,
        featured: false,
        imageUrl: "",
      });
      fetchProducts();
      fetchStats();
    } catch {
      toast.error("Failed to submit product details.");
    }
  };

  // Trigger edit product
  const triggerEditProduct = (prod: ProductDetail) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      stock: prod.stock,
      discount: prod.discount,
      featured: prod.featured,
      imageUrl: prod.images[0] || "",
    });
    setIsProductFormOpen(true);
  };

  // Product Delete handler
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${productId}`);
      toast.success("Product deleted successfully.");
      fetchProducts();
      fetchStats();
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Header />
        <div className="container mx-auto px-6 py-20 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Header />

      <main className="container mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-secondary dark:text-white mb-2">
              Admin Control Panel
            </h1>
            <p className="text-sm text-slate-400">Welcome, Administrator! Manage sales statistics, orders flow, and inventory.</p>
          </div>
        </div>

        {/* Tab Controllers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 focus:outline-none transition border-b-2 cursor-pointer ${
              activeTab === "overview" ? "border-primary text-primary font-bold" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 focus:outline-none transition border-b-2 cursor-pointer ${
              activeTab === "orders" ? "border-primary text-primary font-bold" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Order Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 focus:outline-none transition border-b-2 cursor-pointer ${
              activeTab === "products" ? "border-primary text-primary font-bold" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Product Management ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 focus:outline-none transition border-b-2 cursor-pointer ${
              activeTab === "users" ? "border-primary text-primary font-bold" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            User Management ({users.length})
          </button>
        </div>

        {/* Dynamic Panels */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {loadingStats ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <span className="text-xs uppercase font-extrabold text-slate-400">Total Products</span>
                  <p className="text-4xl font-black text-secondary dark:text-white mt-2">{stats.totalProducts}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <span className="text-xs uppercase font-extrabold text-slate-400">Registered Users</span>
                  <p className="text-4xl font-black text-secondary dark:text-white mt-2">{stats.totalUsers}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <span className="text-xs uppercase font-extrabold text-slate-400">Total Sales Orders</span>
                  <p className="text-4xl font-black text-primary mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <span className="text-xs uppercase font-extrabold text-slate-400 text-amber-500">Pending Orders</span>
                  <p className="text-4xl font-black text-amber-500 mt-2">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <span className="text-xs uppercase font-extrabold text-slate-400 text-green-500">Delivered Orders</span>
                  <p className="text-4xl font-black text-green-500 mt-2">{stats.deliveredOrders}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm text-left">
            <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6">User Orders Records</h3>
            {loadingOrders ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-slate-400 text-sm">No sales records registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 rounded-l-xl">Order Date</th>
                      <th className="px-6 py-3">Customer Name</th>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Contact</th>
                      <th className="px-6 py-3">Address</th>
                      <th className="px-6 py-3">Qty</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-bold">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-secondary dark:text-white whitespace-nowrap">{ord.customerName}</td>
                        <td className="px-6 py-4 text-xs font-semibold">{ord.product ? ord.product.name : "N/A"}</td>
                        <td className="px-6 py-4 text-xs">{ord.phone}</td>
                        <td className="px-6 py-4 text-xs">{ord.address}, {ord.thana}, {ord.district}</td>
                        <td className="px-6 py-4 font-bold text-secondary dark:text-white">{ord.quantity}</td>
                        <td className="px-6 py-4 font-black text-secondary dark:text-white">৳{ord.totalPrice.toFixed(0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                            ord.deliveryStatus === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30" : "bg-green-100 text-green-700 dark:bg-green-900/30"
                          }`}>
                            {ord.deliveryStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ord.deliveryStatus === "pending" && (
                            <button
                              onClick={() => setDeliverTarget(ord)}
                              className="px-3 py-1.5 bg-primary text-white font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition cursor-pointer"
                            >
                              Deliver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6 text-left">
            {/* Header with add button */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div>
                <h3 className="font-extrabold text-lg text-secondary dark:text-white">Product Inventory</h3>
                <p className="text-xs text-slate-400">Configure catalog prices, discounts, categories and descriptions.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductFormOpen(true);
                }}
                className="px-6 py-3 bg-primary text-white font-bold text-xs rounded-xl hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                Add Product
              </button>
            </div>

            {/* Inventory table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm">
              {loadingProducts ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-slate-400 text-sm">No items in the catalog.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-6 py-3 rounded-l-xl">Item</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Stock</th>
                        <th className="px-6 py-3">Discount</th>
                        <th className="px-6 py-3">Featured</th>
                        <th className="px-6 py-3 rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {products.map((prod) => (
                        <tr key={prod._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                          <td className="px-6 py-4 font-bold text-secondary dark:text-white max-w-[200px] truncate">{prod.name}</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-400">{prod.category}</td>
                          <td className="px-6 py-4 font-bold text-secondary dark:text-white">৳{prod.price}</td>
                          <td className="px-6 py-4 font-bold text-secondary dark:text-white">{prod.stock}</td>
                          <td className="px-6 py-4 text-slate-400">{prod.discount}%</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                              prod.featured ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                            }`}>
                              {prod.featured ? "Featured" : "Standard"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-3 text-xs">
                            <button
                              onClick={() => triggerEditProduct(prod)}
                              className="text-primary hover:underline font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="text-red-500 hover:underline font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Product Add / Edit Modal Form */}
            {isProductFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 max-w-lg w-full text-left shadow-2xl mx-4">
                  <h3 className="text-xl font-black text-secondary dark:text-white mb-6">
                    {editingProduct ? "Edit Product Catalog" : "Add New Product"}
                  </h3>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white cursor-pointer"
                        >
                          <option>Electronics</option>
                          <option>Gadgets</option>
                          <option>Accessories</option>
                          <option>Smart Home</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                      <textarea
                        required
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white resize-none"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Price (৳)</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Stock</label>
                        <input
                          type="number"
                          required
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Discount (%)</label>
                        <input
                          type="number"
                          value={productForm.discount}
                          onChange={(e) => setProductForm({ ...productForm, discount: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Image URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={productForm.imageUrl}
                        onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="featured" className="text-xs font-bold text-slate-500 cursor-pointer select-none">
                        Promote to Featured Product Section
                      </label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => {
                          setIsProductFormOpen(false);
                          setEditingProduct(null);
                        }}
                        className="w-1/2 py-3 bg-slate-100 border-none text-secondary"
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit" className="w-1/2 py-3">
                        Save
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm text-left">
            <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6">User Database Directories</h3>
            {loadingUsers ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-slate-400 text-sm">No registered user directories.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 rounded-l-xl">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Phone</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Join Date</th>
                      <th className="px-6 py-3 rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                        <td className="px-6 py-4 font-bold text-secondary dark:text-white whitespace-nowrap">{u.name}</td>
                        <td className="px-6 py-4 text-xs font-semibold">{u.email}</td>
                        <td className="px-6 py-4 text-xs">{u.phone || "N/A"}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                            u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-400"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-3 text-xs">
                          <button
                            onClick={() => handleToggleBlockUser(u)}
                            disabled={u._id === user._id}
                            className={`font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                              u.blocked ? "text-green-500 hover:underline" : "text-amber-500 hover:underline"
                            }`}
                          >
                            {u.blocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Deliver Confirmation Dialog */}
      {deliverTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 max-w-sm w-full text-center shadow-2xl mx-4">
            <h3 className="text-xl font-black text-secondary dark:text-white mb-2">Mark as Delivered?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to mark this order as Delivered? This will change the order status.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                onClick={() => setDeliverTarget(null)}
                className="w-1/2 py-3 bg-slate-100 border-none text-secondary"
                disabled={delivering}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDeliver}
                className="w-1/2 py-3 bg-primary text-white"
                disabled={delivering}
              >
                {delivering ? "Updating..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
