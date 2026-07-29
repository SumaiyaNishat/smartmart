/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ImageUploader } from "@/components/ui/ImageUploader";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  FolderOpen,
  Boxes,
  ShoppingCart,
  Users,
  UserCheck,
  Star,
  Ticket,
  BarChart3,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  SlidersHorizontal,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Shield,
  CreditCard,
  Truck,
  Activity,
  UserPlus,
  RefreshCw,
  X
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";

// TypeScript Interfaces
interface OrderDetail {
  _id: string;
  customerName: string;
  phone: string;
  optionalPhone?: string;
  address: string;
  thana: string;
  district: string;
  orderNote?: string;
  isGuest?: boolean;
  product: {
    _id: string;
    name: string;
    images?: string[];
    price: number;
  } | null;
  user?: string | {
    _id: string;
    name: string;
    email: string;
  } | null;
  quantity: number;
  totalPrice: number;
  deliveryStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  descriptionEn?: string;
  descriptionBn?: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  discount: number;
  featured: boolean;
  rating?: number;
  displayOrder?: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  category: string;
  stock: number;
  discount: number;
  featured: boolean;
  displayOrder: number;
  images: string[];
}

const initialProductFormState: ProductFormData = {
  name: "",
  description: "",
  descriptionEn: "",
  descriptionBn: "",
  price: 0,
  category: "Electronics",
  stock: 10,
  discount: 0,
  featured: false,
  displayOrder: 0,
  images: [],
};

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

// Static/Mock Data
const initialCategories = [
  { name: "Electronics", desc: "Premium tech devices, accessories and systems.", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80", count: 12 },
  { name: "Gadgets", desc: "Innovative small components and smart tech accessories.", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", count: 8 },
  { name: "Accessories", desc: "Daily essentials and enhancement gears.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", count: 15 },
  { name: "Smart Home", desc: "Intelligent automation electronics for your comfort.", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&q=80", count: 6 }
];

const initialReviews = [
  { id: "1", user: "Tariqul Islam", rating: 5, comment: "Absolutely loved the fast delivery! The packaging was great.", product: "Wireless Bluetooth Earbuds", status: "Approved" },
  { id: "2", user: "Sadia Rahman", rating: 4, comment: "Good pricing, product build is solid. Fits perfectly.", product: "Ergonomic Smart Desk Lamp", status: "Approved" },
  { id: "3", user: "Rayhan Chowdhury", rating: 5, comment: "High quality premium gadget! Highly recommend SmartMart.", product: "Mechanical Gaming Keyboard", status: "Pending" },
  { id: "4", user: "Nusrat Jahan", rating: 3, comment: "Decent keyboard, but shipping took two extra days.", product: "Mechanical Gaming Keyboard", status: "Approved" }
];

const initialCoupons = [
  { code: "SMARTSTART20", discount: "20%", expiry: "2026-12-31", status: "Active" },
  { code: "EIDSPECIAL", discount: "৳500", expiry: "2026-09-30", status: "Active" },
  { code: "WELCOME100", discount: "৳100", expiry: "2026-05-20", status: "Expired" }
];

const salesData = [
  { name: "Jan", sales: 4200, revenue: 245000 },
  { name: "Feb", sales: 3100, revenue: 198000 },
  { name: "Mar", sales: 5400, revenue: 320000 },
  { name: "Apr", sales: 2900, revenue: 185000 },
  { name: "May", sales: 4900, revenue: 299000 },
  { name: "Jun", sales: 6390, revenue: 410000 },
  { name: "Jul", sales: 7490, revenue: 489000 },
];

const customerGrowthData = [
  { name: "Jan", customers: 180 },
  { name: "Feb", customers: 290 },
  { name: "Mar", customers: 410 },
  { name: "Apr", customers: 560 },
  { name: "May", customers: 720 },
  { name: "Jun", customers: 980 },
  { name: "Jul", customers: 1250 },
];

const categoryColors = ["#1E3A8A", "#F97316", "#FB923C", "#6366F1"];

export default function AdminDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Tab & Layout States
  const [activeTab, setActiveTab] = React.useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  // Search & Filters
  const [globalSearch, setGlobalSearch] = React.useState("");
  const [productCategoryFilter, setProductCategoryFilter] = React.useState("All");
  const [productViewMode, setProductViewMode] = React.useState<"grid" | "list">("grid");
  const [orderStatusFilter, setOrderStatusFilter] = React.useState("All");
  const [userRoleFilter, setUserRoleFilter] = React.useState("All");
  const [stockFilter, setStockFilter] = React.useState("All");

  // Dynamic Database States
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
  const [loadingData, setLoadingData] = React.useState(true);
  const [actionInProgress, setActionInProgress] = React.useState(false);
  const [uploadingImages, setUploadingImages] = React.useState(false);
  const [isReordering, setIsReordering] = React.useState(false);
  const isReorderingRef = React.useRef(false);

  // Modals & Detail States
  const [selectedOrder, setSelectedOrder] = React.useState<OrderDetail | null>(null);
  const [editingProduct, setEditingProduct] = React.useState<ProductDetail | null>(null);
  const [viewProductDetails, setViewProductDetails] = React.useState<ProductDetail | null>(null);
  const [inlineEditStockId, setInlineEditStockId] = React.useState<string | null>(null);
  const [inlineStockVal, setInlineStockVal] = React.useState<number>(0);

  // local states for categories, reviews, coupons
  const [categories, setCategories] = React.useState(initialCategories);
  const [reviews, setReviews] = React.useState(initialReviews);
  const [coupons, setCoupons] = React.useState(initialCoupons);

  // Creation forms
  const [newProductForm, setNewProductForm] = React.useState<ProductFormData>(initialProductFormState);

  const [newCouponForm, setNewCouponForm] = React.useState({
    code: "",
    discount: "",
    expiry: "",
    status: "Active"
  });

  const [newCategoryForm, setNewCategoryForm] = React.useState({
    name: "",
    desc: "",
    image: ""
  });

  const [notifications, setNotifications] = React.useState([
    { id: 1, text: "New Order placed by Abir Hasan for ৳12,500", time: "10 min ago", unread: true },
    { id: 2, text: "Super Admin updated Mechanical Gaming Keyboard details", time: "1 hour ago", unread: true },
    { id: 3, text: "Customer Support Chat ticket received from Sadia", time: "3 hours ago", unread: false },
    { id: 4, text: "Low stock alert: Wireless Earbuds down to 3 items", time: "1 day ago", unread: false }
  ]);

  // Settings forms
  const [storeSettings, setStoreSettings] = React.useState({
    storeName: "SmartMart Bangladesh",
    supportEmail: "support@smartmart.com",
    contactPhone: "+880 1712-345678",
    currency: "BDT",
    shippingCharge: 80,
    freeShippingThreshold: 2000,
    stripePublicKey: "pk_test_51Msz...",
    sslStoreId: "smartmart_merchant"
  });

  const [adminProfileForm, setAdminProfileForm] = React.useState({
    name: "",
    phone: "",
    address: "House 24, Road 12, Banani",
    thana: "Gulshan",
    district: "Dhaka",
    avatarUrl: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Recharts safety
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Dark mode check
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Verify Admin Authentication
  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error("Please login to access the admin dashboard.");
        router.push("/login");
      } else if (user.role !== "admin") {
        toast.error("Access denied. Admin role required.");
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  // Sync profile form once user loads
  React.useEffect(() => {
    if (user) {
      setAdminProfileForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Fetch Dashboard Stats & Dynamic Datasets
  const fetchAllData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get("/api/dashboard/stats"),
        axios.get("/api/orders?admin=true"),
        axios.get("/api/products"),
        axios.get("/api/users")
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (ordersRes.data?.orders) setOrders(ordersRes.data.orders);
      if (productsRes.data?.products) setProducts(productsRes.data.products);
      if (usersRes.data?.users) setUsers(usersRes.data.users);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard database lists.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  React.useEffect(() => {
    if (user && user.role === "admin") {
      fetchAllData();
    }
  }, [user, fetchAllData]);

  // Form Submissions & API handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const descEn = (newProductForm.descriptionEn || "").trim();
    const descBn = (newProductForm.descriptionBn || "").trim();
    const descBase = (newProductForm.description || "").trim();

    if (!descEn && !descBn && !descBase) {
      toast.error("Please provide at least an English or Bangla product description.");
      return;
    }

    const finalDescription = descEn || descBn || descBase;

    setActionInProgress(true);
    try {
      const payload = {
        name: newProductForm.name,
        description: finalDescription,
        descriptionEn: descEn || finalDescription,
        descriptionBn: descBn,
        price: Number(newProductForm.price),
        category: newProductForm.category,
        stock: Number(newProductForm.stock),
        discount: Number(newProductForm.discount),
        featured: newProductForm.featured,
        displayOrder: Number(newProductForm.displayOrder || 0),
        images: newProductForm.images
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
        toast.success("Product updated successfully.");
      } else {
        await axios.post("/api/products", payload);
        toast.success("New product created successfully.");
      }

      setEditingProduct(null);
      setNewProductForm(initialProductFormState);
      setActiveTab("products");
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product details.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleEditProductTrigger = (prod: ProductDetail) => {
    setEditingProduct(prod);
    setNewProductForm({
      name: prod.name,
      description: prod.description || "",
      descriptionEn: prod.descriptionEn || prod.description || "",
      descriptionBn: prod.descriptionBn || "",
      price: prod.price,
      category: prod.category,
      stock: prod.stock,
      discount: prod.discount,
      featured: prod.featured,
      displayOrder: prod.displayOrder ?? 0,
      images: prod.images || []
    });
    setActiveTab("add-product");
  };

  const handleReorderProducts = async (reorderedList: ProductDetail[]) => {
    // Prevent duplicate concurrent reorder API calls
    if (isReorderingRef.current) return;

    isReorderingRef.current = true;
    setIsReordering(true);

    const TOAST_ID = "reorder-product-toast";
    const previousProductsList = [...products];

    // Recalculate 1-indexed displayOrder sequentially without gaps or duplicates
    const updatedSubList = reorderedList.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));

    // Optimistically update local state for 60fps immediate feedback
    setProducts((prev) => {
      const map = new Map(updatedSubList.map((p) => [p._id, p]));
      return prev.map((p) => map.get(p._id) || p);
    });

    const payload = updatedSubList.map((p) => ({
      id: p._id,
      displayOrder: p.displayOrder,
    }));

    // Display single loading toast that updates in-place
    toast.loading("Saving product order...", { id: TOAST_ID });

    try {
      await axios.put("/api/products", { orders: payload });
      toast.success("Product order updated successfully.", { id: TOAST_ID });
    } catch (err) {
      console.error("Failed to save product order:", err);
      toast.error("Failed to update product order. Restored previous order.", { id: TOAST_ID });
      // Rollback to previous state on API failure
      setProducts(previousProductsList);
    } finally {
      isReorderingRef.current = false;
      setIsReordering(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product permanently?")) return;
    setActionInProgress(true);
    try {
      await axios.delete(`/api/products/${productId}`);
      toast.success("Product deleted successfully.");
      fetchAllData();
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleUpdateStockInline = async (productId: string) => {
    setActionInProgress(true);
    try {
      const prod = products.find((p) => p._id === productId);
      if (prod) {
        await axios.put(`/api/products/${productId}`, {
          stock: inlineStockVal
        });
        toast.success("Stock level updated successfully.");
        setInlineEditStockId(null);
        fetchAllData();
      }
    } catch {
      toast.error("Failed to update stock level.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleConfirmDeliver = async (orderId: string) => {
    setActionInProgress(true);
    try {
      await axios.put(`/api/orders/${orderId}/deliver`);
      toast.success("Order marked as Delivered successfully.");
      if (selectedOrder) setSelectedOrder(null);
      fetchAllData();
    } catch {
      toast.error("Failed to update delivery status.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setActionInProgress(true);
    try {
      await axios.put(`/api/orders/${orderId}`, { deliveryStatus: status });
      toast.success(`Order status updated to ${status}.`);
      if (selectedOrder) {
        setSelectedOrder((prev) => prev ? { ...prev, deliveryStatus: status as any } : null);
      }
      fetchAllData();
    } catch {
      toast.error("Failed to update order status.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order permanently?")) return;
    setActionInProgress(true);
    try {
      await axios.delete(`/api/orders/${orderId}`);
      toast.success("Order deleted successfully.");
      if (selectedOrder) setSelectedOrder(null);
      fetchAllData();
    } catch {
      toast.error("Failed to delete order.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleToggleBlockUser = async (targetUser: UserDetail) => {
    setActionInProgress(true);
    try {
      await axios.put("/api/users", {
        userId: targetUser._id,
        blocked: !targetUser.blocked
      });
      toast.success(`User successfully ${targetUser.blocked ? "unblocked" : "blocked"}.`);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update user block status.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleChangeUserRole = async (targetUser: UserDetail, newRole: "customer" | "admin") => {
    setActionInProgress(true);
    try {
      await axios.put("/api/users", {
        userId: targetUser._id,
        role: newRole
      });
      toast.success(`User role updated to ${newRole}.`);
      fetchAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update user role.");
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user account permanently?")) return;
    setActionInProgress(true);
    try {
      await axios.delete(`/api/users?userId=${userId}`);
      toast.success("User account deleted successfully.");
      fetchAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete user.");
    } finally {
      setActionInProgress(false);
    }
  };

  // Mock coupon handler
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code || !newCouponForm.discount || !newCouponForm.expiry) {
      toast.error("Please fill in all coupon fields.");
      return;
    }
    const exists = coupons.find(c => c.code.toUpperCase() === newCouponForm.code.toUpperCase());
    if (exists) {
      toast.error("Coupon code already exists.");
      return;
    }
    setCoupons([
      ...coupons,
      {
        code: newCouponForm.code.toUpperCase(),
        discount: newCouponForm.discount,
        expiry: newCouponForm.expiry,
        status: "Active"
      }
    ]);
    setNewCouponForm({ code: "", discount: "", expiry: "", status: "Active" });
    toast.success("Promo coupon created successfully!");
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(coupons.filter((c) => c.code !== code));
    toast.success("Coupon removed successfully.");
  };

  // Mock category handler
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryForm.name || !newCategoryForm.desc) {
      toast.error("Please fill in all category fields.");
      return;
    }
    setCategories([
      ...categories,
      {
        name: newCategoryForm.name,
        desc: newCategoryForm.desc,
        image: newCategoryForm.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        count: 0
      }
    ]);
    setNewCategoryForm({ name: "", desc: "", image: "" });
    toast.success("Product category registered successfully!");
  };

  // Review status
  const handleReviewAction = (id: string, action: "Approve" | "Delete") => {
    if (action === "Delete") {
      setReviews(reviews.filter((r) => r.id !== id));
      toast.success("Review deleted successfully.");
    } else {
      setReviews(reviews.map((r) => r.id === id ? { ...r, status: "Approved" } : r));
      toast.success("Review approved successfully.");
    }
  };

  // Profile save
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfileForm.newPassword) {
      if (adminProfileForm.newPassword !== adminProfileForm.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }
    toast.success("Administrative profile details updated successfully!");
    setAdminProfileForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  // Settings save
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Store configurations updated successfully!");
  };

  // UI Export mock spinner
  const handleExportReport = (reportType: string) => {
    toast.loading(`Preparing ${reportType} CSV export...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${reportType} CSV downloaded successfully!`);
    }, 1500);
  };

  // Derived Values
  const getOrderNumber = React.useCallback((orderId: string) => {
    const index = orders.findIndex((o) => o._id === orderId);
    if (index === -1) return "";
    const chronologicalRank = orders.length - index;
    return `#${1000 + chronologicalRank}`;
  }, [orders]);

  const customers = users.filter((u) => u.role === "customer");
  const totalSpendForUser = (userId: string) => {
    return orders
      .filter((o) => {
        if (!o.user) return false;
        if (typeof o.user === "string") return o.user === userId;
        return o.user._id === userId;
      })
      .reduce((sum, o) => sum + o.totalPrice, 0);
  };
  const ordersCountForUser = (userId: string) => {
    return orders.filter((o) => {
      if (!o.user) return false;
      if (typeof o.user === "string") return o.user === userId;
      return o.user._id === userId;
    }).length;
  };

  const totalRevenueVal = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Filter dynamic datasets based on Global Search and filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === "All" || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.customerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
      (o.product && o.product.name.toLowerCase().includes(globalSearch.toLowerCase())) ||
      o._id.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === "All" || o.deliveryStatus === orderStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
      u.phone.includes(globalSearch);
    const matchesRole = userRoleFilter === "All" || u.role === userRoleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const filteredInventory = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesStock = stockFilter === "All" ||
      (stockFilter === "Out" && p.stock === 0) ||
      (stockFilter === "Low" && p.stock > 0 && p.stock <= 5) ||
      (stockFilter === "InStock" && p.stock > 5);
    return matchesSearch && matchesStock;
  });

  const filteredCustomers = customers.map((c) => ({
    ...c,
    ordersCount: ordersCountForUser(c._id),
    totalSpend: totalSpendForUser(c._id)
  })).filter((c) => {
    return c.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(globalSearch.toLowerCase());
  });

  // Sidebar Menu Items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "products", label: "Products", icon: <ShoppingBag size={18} /> },
    { id: "add-product", label: "Add Product", icon: <PlusCircle size={18} /> },
    { id: "categories", label: "Categories", icon: <FolderOpen size={18} /> },
    { id: "inventory", label: "Inventory", icon: <Boxes size={18} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { id: "customers", label: "Customers", icon: <UserCheck size={18} /> },
    { id: "users", label: "Users", icon: <Users size={18} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={18} /> },
    { id: "coupons", label: "Coupons", icon: <Ticket size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "reports", label: "Reports", icon: <FileText size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> }
  ];

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary h-12 w-12" />
          <p className="text-slate-400 text-sm">Authenticating admin panel credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex transition-colors duration-300">

      {/* 1. SIDEBAR FOR DESKTOP */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 relative ${sidebarCollapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary/20">
              S
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
                SmartMart <span className="text-xs text-orange-500 font-bold">Admin</span>
              </span>
            )}
          </div>
        </div>

        {/* Collapsible sidebar toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-10 -right-3 w-6 h-6 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center shadow-sm cursor-pointer z-15 transition"
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow p-4 overflow-y-auto space-y-1 scrollbar-none">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "add-product") {
                  setEditingProduct(null);
                  setNewProductForm(initialProductFormState);
                }
                setActiveTab(item.id);
                setGlobalSearch(""); // Reset search on tab change
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-left cursor-pointer ${activeTab === item.id
                ? "bg-primary text-white font-bold shadow-md shadow-primary/25"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <div className="flex-shrink-0 transition-transform group-hover:scale-105">{item.icon}</div>
              {!sidebarCollapsed && <span className="text-sm truncate font-medium">{item.label}</span>}
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-all cursor-pointer mt-8"
          >
            <div className="flex-shrink-0"><LogOut size={18} /></div>
            {!sidebarCollapsed && <span className="text-sm font-bold">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center text-white font-black text-lg">
                    S
                  </div>
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white">SmartMart Panel</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-grow overflow-y-auto space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "add-product") {
                        setEditingProduct(null);
                        setNewProductForm(initialProductFormState);
                      }
                      setActiveTab(item.id);
                      setGlobalSearch("");
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${activeTab === item.id
                      ? "bg-primary text-white font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}

                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-all cursor-pointer mt-8"
                >
                  <div className="flex-shrink-0"><LogOut size={18} /></div>
                  <span className="text-sm font-bold">Logout</span>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* STICKY TOP NAVBAR */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold capitalize text-slate-800 dark:text-white hidden sm:block">
              {activeTab === "add-product" ? (editingProduct ? "Edit Product" : "Add Product") : activeTab}
            </h1>
          </div>

          {/* Search bar inside header */}
          <div className="relative max-w-md w-48 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-3">
            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition cursor-pointer"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 transition relative cursor-pointer"
              >
                <Bell size={18} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 bg-orange-500 w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-float-subtle text-left">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">Admin Activity Alerts</h4>
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                        className="text-[10px] text-primary hover:underline font-bold"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-750">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col gap-1 transition ${notif.unread ? "bg-primary/5 dark:bg-primary/10" : ""
                            }`}
                        >
                          <p className="text-slate-700 dark:text-slate-200 leading-normal">{notif.text}</p>
                          <span className="text-[9px] text-slate-400 font-medium">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none rounded-full p-1 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-float-subtle text-left">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate capitalize">{user.role} Account</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveTab("profile");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition"
                    >
                      Admin Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveTab("settings");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition"
                    >
                      Store Settings
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT WRAPPER */}
        <main className="flex-grow p-6 overflow-y-auto">
          {loadingData ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-primary h-10 w-10" />
              <p className="text-slate-400 text-sm">Fetching store records database...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* Welcome banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary to-indigo-800 text-white rounded-3xl shadow-sm text-left relative overflow-hidden">
                    <div className="z-10">
                      <h2 className="text-2xl font-black mb-1">Welcome Back, {user.name} 👋</h2>
                      <p className="text-xs text-slate-200 max-w-xl">
                        Here is a summary of SmartMart store operational metrics for today, {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
                      </p>
                    </div>
                    {/* Floating absolute shape backgrounds */}
                    <div className="absolute right-[-10%] top-[-50%] w-72 h-72 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute right-[10%] bottom-[-80%] w-60 h-60 bg-orange-500/10 rounded-full blur-xl" />
                  </div>

                  {/* KPI Cards section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        title: "Total Revenue",
                        val: `৳${totalRevenueVal.toLocaleString()}`,
                        icon: <TrendingUp className="text-emerald-500" />,
                        trend: "+14.2%",
                        isUp: true,
                        bg: "border-l-emerald-500"
                      },
                      {
                        title: "Total Orders",
                        val: orders.length,
                        icon: <ShoppingCart className="text-indigo-500" />,
                        trend: "+12.1%",
                        isUp: true,
                        bg: "border-l-indigo-500"
                      },
                      {
                        title: "Total Products",
                        val: products.length,
                        icon: <Boxes className="text-amber-500" />,
                        trend: "New Items Added",
                        isUp: true,
                        bg: "border-l-amber-500"
                      },
                      {
                        title: "Total Customers",
                        val: customers.length,
                        icon: <UserCheck className="text-purple-500" />,
                        trend: "+3.2%",
                        isUp: true,
                        bg: "border-l-purple-500"
                      }

                    ].map((kpi, idx) => (
                      <div
                        key={idx}
                        className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border-l-4 border-slate-200 dark:border-slate-800 ${kpi.bg} shadow-sm hover:scale-[1.02] hover:shadow-md transition-all duration-300 text-left`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                          <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl">{kpi.icon}</div>
                        </div>
                        <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{kpi.val}</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold">
                          {kpi.isUp ? (
                            <TrendingUp className="text-emerald-500 h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="text-orange-500 h-3.5 w-3.5" />
                          )}
                          <span className={kpi.isUp ? "text-emerald-500" : "text-orange-500"}>{kpi.trend}</span>
                          <span className="text-slate-400">from last week</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analytics charts utilizing recharts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales overview AreaChart */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm text-left lg:col-span-2">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-extrabold text-base text-slate-950 dark:text-slate-100">Monthly Sales Overview</h3>
                          <p className="text-xs text-slate-400">Shows order checkout volumes.</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-lg border border-primary/20">English</span>
                        </div>
                      </div>
                      <div className="h-72 w-full">
                        {mounted && (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                              <YAxis stroke="#94a3b8" fontSize={10} />
                              <ChartTooltip />
                              <Area type="monotone" dataKey="sales" stroke="#1E3A8A" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Category split PieChart */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm text-left">
                      <div className="mb-6">
                        <h3 className="font-extrabold text-base text-slate-950 dark:text-slate-100">Category Distribution</h3>
                        <p className="text-xs text-slate-400">Inventory levels per product category.</p>
                      </div>
                      <div className="h-64 w-full flex items-center justify-center">
                        {mounted && (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categories.map((c, i) => ({
                                  name: c.name,
                                  value: products.filter(p => p.category === c.name).length || 1
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {categories.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                                ))}
                              </Pie>
                              <ChartTooltip />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" fontSize={10} />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic charts row 2 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Line Chart */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm text-left">
                      <h3 className="font-extrabold text-base text-slate-950 dark:text-slate-100 mb-6">Revenue Trend (BDT)</h3>
                      <div className="h-64">
                        {mounted && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                              <YAxis stroke="#94a3b8" fontSize={10} />
                              <ChartTooltip />
                              <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Customer growth line chart */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm text-left">
                      <h3 className="font-extrabold text-base text-slate-950 dark:text-slate-100 mb-6">Customer Growth Trend</h3>
                      <div className="h-64">
                        {mounted && (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                              <YAxis stroke="#94a3b8" fontSize={10} />
                              <ChartTooltip />
                              <Area type="monotone" dataKey="customers" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorCustomers)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders section */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Recent Activity Orders</h3>
                        <p className="text-xs text-slate-400">Overview of recent customer transaction logs.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs text-primary dark:text-orange-400 font-bold hover:underline flex items-center gap-1.5 self-start sm:self-center"
                      >
                        Manage All Orders <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 font-black tracking-wider">
                          <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Product Purchased</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Total Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                          {orders.slice(0, 5).map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                              <td className="px-6 py-4 text-xs font-mono truncate max-w-[120px] text-slate-400">
                                {order._id}
                              </td>
                              <td className="px-6 py-4 text-slate-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">{order.customerName}</span>
                                  {(order.isGuest || !order.user) && (
                                    <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                                      Guest Order
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {order.product ? order.product.name : "Unknown Product"}
                              </td>
                              <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                                ৳{order.totalPrice.toFixed(0)}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${order.deliveryStatus === "pending"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    }`}
                                >
                                  {order.deliveryStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1 text-slate-400 hover:text-primary transition cursor-pointer"
                                >
                                  <Eye size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Inventory & Customers lists row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Low Stock & Best Sellers */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm text-left">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4">Inventory Quick Alerts</h3>
                      <div className="space-y-4">
                        <div className="border border-red-200 dark:border-red-950/40 bg-red-50/30 dark:bg-red-950/10 p-4 rounded-2xl">
                          <h4 className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
                            <XCircle size={14} /> Out of Stock / Low Stock Alert ({lowStockCount})
                          </h4>
                          <div className="max-h-32 overflow-y-auto space-y-2">
                            {products.filter(p => p.stock <= 5).map(prod => (
                              <div key={prod._id} className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{prod.name}</span>
                                <span className={`font-black ${prod.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                                  {prod.stock === 0 ? "Out of Stock" : `${prod.stock} left`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recently Registered Products</h4>
                          <div className="space-y-2.5">
                            {products.slice(0, 3).map((prod) => (
                              <div key={prod._id} className="flex items-center gap-3 p-2 rounded-xl border border-slate-50 dark:border-slate-800">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                  {prod.images?.[0] && (
                                    <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h5 className="font-bold text-xs truncate text-slate-900 dark:text-white">{prod.name}</h5>
                                  <span className="text-[10px] text-slate-400">{prod.category}</span>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="font-black text-xs">৳{prod.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Customers */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm text-left">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4">Active Shoppers</h3>
                      <div className="space-y-3">
                        {customers.slice(0, 4).map((cust) => {
                          const spend = totalSpendForUser(cust._id);
                          return (
                            <div key={cust._id} className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                                  {cust.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{cust.name}</h4>
                                  <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{cust.email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-xs text-slate-900 dark:text-white">৳{spend.toLocaleString()}</p>
                                <span className="text-[9px] text-slate-400">{ordersCountForUser(cust._id)} Purchases</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline & Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Timeline */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm text-left lg:col-span-2">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-6">Operations Timeline</h3>
                      <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-6">
                        {[
                          { title: "New Order Dispatched", desc: "Warehouse dispatched package order #SM7753", time: "25 min ago", icon: <ShoppingCart size={10} className="text-emerald-500" />, circleBg: "bg-emerald-500/10 border-emerald-500" },
                          { title: "Catalog Update", desc: "Super Admin updated prices for smart desk lamp", time: "1.5 hours ago", icon: <SlidersHorizontal size={10} className="text-indigo-500" />, circleBg: "bg-indigo-500/10 border-indigo-500" },
                          { title: "New User Registration", desc: "Customer Farhan Ahmed registered an account", time: "3 hours ago", icon: <UserPlus size={10} className="text-blue-500" />, circleBg: "bg-blue-500/10 border-blue-500" },
                          { title: "System Database Synced", desc: "Automatic MongoDB schema sync completed successfully", time: "6 hours ago", icon: <RefreshCw size={10} className="text-amber-500" />, circleBg: "bg-amber-500/10 border-amber-500" }
                        ].map((act, index) => (
                          <div key={index} className="relative pl-6">
                            <span className={`absolute left-[-7px] top-1 w-3 h-3 rounded-full border-2 ${act.circleBg} flex items-center justify-center bg-white dark:bg-slate-900`}>
                              {/* dot */}
                            </span>
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <h4 className="font-bold text-xs text-slate-950 dark:text-slate-100">{act.title}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">{act.desc}</p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-semibold flex-shrink-0">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 shadow-sm text-left">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-4">Quick Operations</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "add-product", label: "Add Product", icon: <PlusCircle size={18} />, color: "bg-primary/10 text-primary border-primary/20" },
                          { id: "orders", label: "Orders Dispatch", icon: <ShoppingCart size={18} />, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
                          { id: "inventory", label: "Inventory Stock", icon: <Boxes size={18} />, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
                          { id: "users", label: "Manage Roles", icon: <Users size={18} />, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
                          { id: "analytics", label: "Reports & Stats", icon: <BarChart3 size={18} />, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
                          { id: "coupons", label: "Promo Codes", icon: <Ticket size={18} />, color: "bg-pink-500/10 text-pink-500 border-pink-500/20" }
                        ].map((act) => (
                          <button
                            key={act.id}
                            onClick={() => setActiveTab(act.id)}
                            className={`p-4 border rounded-2xl ${act.color} text-center flex flex-col items-center justify-center gap-2 hover:scale-[1.03] transition-all cursor-pointer`}
                          >
                            {act.icon}
                            <span className="text-[10px] font-bold">{act.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: PRODUCTS MODULE */}
              {activeTab === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Store Catalog</h3>
                        {isReordering && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full animate-pulse">
                            <Loader2 size={12} className="animate-spin text-primary" />
                            <span>Saving order...</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">Total registered products: {products.length}</p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {/* Grid/List togglers */}
                      <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 rounded-xl flex gap-0.5">
                        <button
                          onClick={() => setProductViewMode("grid")}
                          className={`p-1.5 rounded-lg cursor-pointer transition ${productViewMode === "grid" ? "bg-primary text-white" : "text-slate-400"}`}
                        >
                          <Grid size={14} />
                        </button>
                        <button
                          onClick={() => setProductViewMode("list")}
                          className={`p-1.5 rounded-lg cursor-pointer transition ${productViewMode === "list" ? "bg-primary text-white" : "text-slate-400"}`}
                        >
                          <List size={14} />
                        </button>
                      </div>

                      {/* Category filters */}
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
                      >
                        <option value="All">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setNewProductForm(initialProductFormState);
                          setActiveTab("add-product");
                        }}
                        className="px-3.5 py-1.5 text-xs bg-primary hover:opacity-95 text-white font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                      >
                        <PlusCircle size={14} /> Add Product
                      </button>
                    </div>
                  </div>

                  {productViewMode === "grid" ? (
                    <Reorder.Group
                      axis="y"
                      values={filteredProducts}
                      onReorder={handleReorderProducts}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      {filteredProducts.map((prod, idx) => (
                        <Reorder.Item
                          key={prod._id}
                          value={prod}
                          whileDrag={{
                            scale: 1.03,
                            boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
                            opacity: 0.9,
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col text-left group cursor-grab active:cursor-grabbing select-none"
                        >
                          <div className="h-44 bg-slate-100 dark:bg-slate-800 relative">
                            <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-slate-950/80 text-white backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-xl shadow cursor-grab active:cursor-grabbing">
                              <GripVertical size={13} className="text-slate-300" />
                              <span>Order #{prod.displayOrder ?? idx + 1}</span>
                            </div>
                            {prod.images?.[0] ? (
                              <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover pointer-events-none" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                            )}
                            {prod.featured && (
                              <span className="absolute bottom-3 left-3 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow">Featured</span>
                            )}
                            {prod.discount > 0 && (
                              <span className="absolute top-3 right-3 bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow">-{prod.discount}% Off</span>
                            )}
                          </div>
                          <div className="p-4 flex-grow flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{prod.category}</span>
                              <h4 className="font-extrabold text-sm text-slate-950 dark:text-white truncate mt-0.5">{prod.name}</h4>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-normal">{prod.descriptionEn || prod.descriptionBn || prod.description}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div>
                                <p className="text-base font-black text-slate-950 dark:text-white">৳{prod.price}</p>
                                <span className={`text-[10px] font-bold ${prod.stock <= 5 ? "text-orange-500" : "text-emerald-500"}`}>
                                  {prod.stock === 0 ? "Out of Stock" : `${prod.stock} in stock`}
                                </span>
                              </div>

                              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setViewProductDetails(prod); }}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-lg transition cursor-pointer"
                                  title="View Details"
                                >
                                  <Eye size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleEditProductTrigger(prod); }}
                                  className="p-1.5 bg-primary/10 text-primary border border-primary/10 hover:bg-primary/25 rounded-lg transition cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteProduct(prod._id); }}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 rounded-lg transition cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={filteredProducts}
                      onReorder={handleReorderProducts}
                      className="space-y-3"
                    >
                      {filteredProducts.map((prod, idx) => (
                        <Reorder.Item
                          key={prod._id}
                          value={prod}
                          whileDrag={{
                            scale: 1.01,
                            boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                            opacity: 0.95,
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition duration-200 cursor-grab active:cursor-grabbing select-none group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-grab active:cursor-grabbing">
                              <GripVertical size={18} />
                            </div>
                            <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-300 flex-shrink-0">
                              #{prod.displayOrder ?? idx + 1}
                            </span>
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                              {prod.images?.[0] && <img src={prod.images[0]} alt="" className="w-full h-full object-cover pointer-events-none" />}
                            </div>
                            <div className="truncate text-left min-w-0">
                              <h4 className="font-extrabold text-sm text-slate-950 dark:text-white truncate">{prod.name}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{prod.category}</span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className={`text-[10px] font-bold ${prod.stock <= 5 ? "text-orange-500" : "text-emerald-500"}`}>
                                  {prod.stock === 0 ? "Out of Stock" : `${prod.stock} in stock`}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-sm font-black text-slate-950 dark:text-white">৳{prod.price}</p>
                              {prod.discount > 0 && (
                                <span className="text-[10px] font-bold text-orange-500">-{prod.discount}% Off</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setViewProductDetails(prod); }}
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl transition cursor-pointer"
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleEditProductTrigger(prod); }}
                                className="p-2 bg-primary/10 text-primary border border-primary/10 hover:bg-primary/25 rounded-xl transition cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleDeleteProduct(prod._id); }}
                                className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 rounded-xl transition cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </motion.div>
              )}

              {/* TAB 3: ADD/EDIT PRODUCT */}
              {activeTab === "add-product" && (
                <motion.div
                  key="add-product"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-left">
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-lg mb-2">
                      {editingProduct ? "Revise Catalog Product Details" : "Register New Store Product"}
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">Fill in information schema to populate the public site product grid.</p>

                    <form onSubmit={onSubmitProductForm} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Product Name *</label>
                          <input
                            type="text"
                            required
                            value={newProductForm.name}
                            onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                            placeholder="e.g. Mechanical Gaming Keyboard"
                          />
                        </div>

                        <div className="col-span-2 space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                              <span>English Description 🇺🇸</span>
                              <span className="text-slate-500 font-normal lowercase">(for English view)</span>
                            </label>
                            <textarea
                              value={newProductForm.descriptionEn}
                              onChange={(e) => setNewProductForm({ ...newProductForm, descriptionEn: e.target.value })}
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm h-24 transition-colors"
                              placeholder="Provide detailed specifications, features, warranty details in English..."
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between">
                              <span>Bangla Description 🇧🇩</span>
                              <span className="text-slate-500 font-normal lowercase">(বাংলা রূপান্তরের জন্য)</span>
                            </label>
                            <textarea
                              value={newProductForm.descriptionBn}
                              onChange={(e) => setNewProductForm({ ...newProductForm, descriptionBn: e.target.value })}
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm h-24 transition-colors"
                              placeholder="পণ্যের বিস্তারিত বিবরণ, ফিচার ও বৈশিষ্ট্য বাংলা ভাষায় লিখুন..."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category *</label>
                          <select
                            value={newProductForm.category}
                            onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                          >
                            {categories.map((c) => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Unit Price (৳ BDT) *</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={newProductForm.price || ""}
                            onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Stock Level Quantity *</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={newProductForm.stock || 0}
                            onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Promo Discount Percentage (%)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={newProductForm.discount || 0}
                            onChange={(e) => setNewProductForm({ ...newProductForm, discount: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Display Order (Sort Position)</label>
                          <input
                            type="number"
                            min={0}
                            value={newProductForm.displayOrder || 0}
                            onChange={(e) => setNewProductForm({ ...newProductForm, displayOrder: Number(e.target.value) })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                            placeholder="e.g. 1 (First), 2 (Second)..."
                          />
                        </div>

                        <div className="col-span-2">
                          <ImageUploader
                            images={newProductForm.images}
                            onChange={(images) => setNewProductForm({ ...newProductForm, images })}
                            productId={editingProduct?._id}
                            onUploadStateChange={setUploadingImages}
                          />
                        </div>

                        <div className="col-span-2 flex items-center gap-2 py-2">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={newProductForm.featured}
                            onChange={(e) => setNewProductForm({ ...newProductForm, featured: e.target.checked })}
                            className="w-4 h-4 text-primary bg-slate-100 rounded focus:ring-primary border-slate-250 cursor-pointer"
                          />
                          <label htmlFor="featured" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Promote Product as Featured on Landing Page</label>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setActiveTab("products");
                          }}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-slate-350 hover:bg-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionInProgress || uploadingImages}
                          className="px-5 py-2 bg-primary hover:opacity-95 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {(actionInProgress || uploadingImages) && <Loader2 size={12} className="animate-spin" />}
                          {uploadingImages ? "Uploading..." : editingProduct ? "Save Changes" : "Register Product"}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: CATEGORIES MODULE */}
              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Category form */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-fit">
                      <h3 className="font-extrabold text-slate-950 dark:text-white text-base mb-4">Register Catalog Category</h3>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category Name</label>
                          <input
                            type="text"
                            required
                            value={newCategoryForm.name}
                            onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                            placeholder="e.g. Smart Home"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                          <textarea
                            required
                            value={newCategoryForm.desc}
                            onChange={(e) => setNewCategoryForm({ ...newCategoryForm, desc: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs h-20"
                            placeholder="Category outline..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cover Image URL</label>
                          <input
                            type="url"
                            value={newCategoryForm.image}
                            onChange={(e) => setNewCategoryForm({ ...newCategoryForm, image: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                            placeholder="https://example.com/cover.jpg"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                        >
                          Register Category
                        </button>
                      </form>
                    </div>

                    {/* Category list */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {categories.map((cat) => (
                          <div
                            key={cat.name}
                            className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:scale-[1.01] transition"
                          >
                            <div className="h-32 bg-slate-100 dark:bg-slate-800 relative">
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <h4 className="absolute bottom-4 left-4 text-white font-black text-base">{cat.name}</h4>
                            </div>
                            <div className="p-4">
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{cat.desc}</p>
                              <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                                <span>Catalog items</span>
                                <span className="text-secondary font-black">{products.filter(p => p.category === cat.name).length} Products</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: INVENTORY MODULE */}
              {activeTab === "inventory" && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Warehouse Stock Tracker</h3>
                      <p className="text-xs text-slate-400">Total catalog inventory tracked in real-time.</p>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
                      >
                        <option value="All">All stock levels</option>
                        <option value="InStock">In Stock (&gt;5 items)</option>
                        <option value="Low">Low Stock (&le;5 items)</option>
                        <option value="Out">Out of stock (0 items)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold">
                        <tr>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock Level</th>
                          <th className="px-6 py-4">Stock Status</th>
                          <th className="px-6 py-4 text-center">Edit Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-850 dark:text-slate-200 font-medium">
                        {filteredInventory.map((prod) => (
                          <tr key={prod._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{prod.name}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-450">{prod.category}</td>
                            <td className="px-6 py-4 font-bold">৳{prod.price}</td>
                            <td className="px-6 py-4">
                              {inlineEditStockId === prod._id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={0}
                                    value={inlineStockVal}
                                    onChange={(e) => setInlineStockVal(Number(e.target.value))}
                                    className="w-16 px-2 py-1 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg focus:outline-none text-xs dark:text-white"
                                  />
                                  <button
                                    onClick={() => handleUpdateStockInline(prod._id)}
                                    className="px-2.5 py-1 bg-primary text-white font-bold text-[10px] rounded-lg hover:opacity-90 cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setInlineEditStockId(null)}
                                    className="p-1 text-slate-400 hover:text-slate-600"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <span className="font-bold">{prod.stock} units</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${prod.stock === 0 ? "bg-red-100 text-red-700 dark:bg-red-950/20" :
                                prod.stock <= 5 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/20" :
                                  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20"
                                }`}>
                                {prod.stock === 0 ? "Out of Stock" : prod.stock <= 5 ? "Low Stock" : "In Stock"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {inlineEditStockId !== prod._id && (
                                <button
                                  onClick={() => {
                                    setInlineEditStockId(prod._id);
                                    setInlineStockVal(prod.stock);
                                  }}
                                  className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-primary dark:text-orange-400 rounded-lg transition cursor-pointer"
                                >
                                  <Edit size={12} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: ORDERS MODULE */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Transactions Dispatch</h3>
                      <p className="text-xs text-slate-400">Manage payment clearances and delivery status tags.</p>
                    </div>

                    {/* Status Tabs */}
                    <div className="flex gap-2">
                      {["All", "Pending", "Delivered"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setOrderStatusFilter(status)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer border transition ${orderStatusFilter === status
                            ? "bg-primary text-white border-primary"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-500"
                            }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                   {/* Desktop view table */}
                  <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm">
                    <table className="w-full table-fixed text-sm text-left">
                      <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-4 w-[10%]">Order #</th>
                          <th className="px-4 py-4 w-[15%]">Customer</th>
                          <th className="px-4 py-4 w-[25%]">Product</th>
                          <th className="px-4 py-4 w-[25%]">Delivery Address</th>
                          <th className="px-4 py-4 w-[10%]">Total</th>
                          <th className="px-4 py-4 w-[10%]">Status</th>
                          <th className="px-4 py-4 w-[15%] text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-850 dark:text-slate-200 font-medium">
                        {filteredOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-slate-55/50 dark:hover:bg-slate-800/40 transition">
                            <td className="px-4 py-4 text-xs font-mono text-slate-400">
                              <span className="font-bold text-slate-900 dark:text-white" title={order._id}>{getOrderNumber(order._id)}</span>
                            </td>
                            <td className="px-4 py-4 text-xs">
                              <div className="truncate font-bold text-slate-900 dark:text-white" title={order.customerName}>
                                {order.customerName}
                              </div>
                              <span className="text-[10px] text-slate-400 font-normal">{order.phone}</span>
                            </td>
                            {/* Product column */}
                            <td className="px-4 py-4 text-xs">
                              <p className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]" title={order.product?.name || "Product Unavailable"}>
                                {order.product?.name || "Product Unavailable"}
                              </p>
                              <span className="text-[10px] text-slate-400 font-normal block mt-0.5">Qty: {order.quantity}</span>
                            </td>
                            {/* Address column */}
                            <td className="px-4 py-4 text-xs">
                              <div 
                                className="whitespace-normal break-words line-clamp-2 hover:text-primary cursor-pointer transition-colors duration-200" 
                                title={`${order.address}, ${order.thana}, ${order.district}`}
                                onClick={() => setSelectedOrder(order)}
                              >
                                {order.address}, {order.thana}, {order.district}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-black text-slate-900 dark:text-white">৳{order.totalPrice.toFixed(0)}</td>
                            <td className="px-4 py-4">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${order.deliveryStatus === "pending"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                }`}>
                                {order.deliveryStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-1.5 justify-center items-center">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-805 rounded-lg cursor-pointer transition duration-200"
                                  title="View Order Details"
                                >
                                  <Eye size={13} />
                                </button>
                                <select
                                  value={order.deliveryStatus}
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  className="text-[9px] font-bold px-1.5 py-1 bg-slate-55 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer text-slate-700 dark:text-slate-350 focus:outline-none"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteOrder(order._id)}
                                  className="p-1 text-red-500 hover:bg-red-55 dark:hover:bg-red-955/20 rounded-lg cursor-pointer transition duration-200"
                                  title="Delete Order"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View: Cards Layout */}
                  <div className="md:hidden space-y-4">
                    {filteredOrders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 text-xs text-left"
                      >
                        {/* Header: ID and Status */}
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 dark:text-white" title={order._id}>{getOrderNumber(order._id)}</span>
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${order.deliveryStatus === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            }`}>
                            {order.deliveryStatus}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                            <p className="text-slate-400">{order.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400">Total Price</p>
                            <p className="font-black text-sm text-slate-900 dark:text-white">৳{order.totalPrice.toFixed(0)}</p>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="bg-slate-55 dark:bg-slate-950 p-3 rounded-xl text-left">
                          <p className="font-bold text-slate-900 dark:text-white truncate" title={order.product?.name || "Product Unavailable"}>
                            {order.product?.name || "Product Unavailable"}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Qty: {order.quantity}</p>
                        </div>

                        {/* Delivery Address */}
                        <div>
                          <p className="text-slate-400 font-semibold mb-0.5">Address</p>
                          <p className="text-slate-600 dark:text-slate-350 line-clamp-2">{order.address}, {order.thana}, {order.district}</p>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 flex items-center justify-between gap-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> View
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="px-3 py-1.5 bg-red-55 dark:bg-red-955/20 hover:bg-red-100 text-red-500 font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>

                          <select
                            value={order.deliveryStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="text-xs font-bold px-2 py-1.5 bg-slate-55 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 7: CUSTOMERS MODULE */}
              {activeTab === "customers" && (
                <motion.div
                  key="customers"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Customers Registry</h3>
                    <p className="text-xs text-slate-400">Total registered shoppers: {customers.length}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold">
                        <tr>
                          <th className="px-6 py-4">Customer Info</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4">Join Date</th>
                          <th className="px-6 py-4">Orders Placed</th>
                          <th className="px-6 py-4 text-right">Total Revenue Spend</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-850 dark:text-slate-200 font-medium">
                        {filteredCustomers.map((cust) => (
                          <tr key={cust._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase">
                                {cust.name.slice(0, 2)}
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-slate-900 dark:text-white">{cust.name}</p>
                                <span className="text-[10px] text-slate-400 font-normal">{cust.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-450">{cust.phone || "No phone added"}</td>
                            <td className="px-6 py-4 text-xs text-slate-400">{new Date(cust.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-bold">{cust.ordersCount} Purchases</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">৳{cust.totalSpend.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${cust.blocked ? "bg-red-100 text-red-700 dark:bg-red-950/20" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20"
                                }`}>
                                {cust.blocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 8: USERS MODULE */}
              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Registered Users Database</h3>
                      <p className="text-xs text-slate-400">Total system accounts: {users.length}</p>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white"
                      >
                        <option value="All">All Roles</option>
                        <option value="Customer">Customers Only</option>
                        <option value="Admin">Admins Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Register Date</th>
                          <th className="px-6 py-4">Block Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-850 dark:text-slate-200 font-medium">
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase">
                                {u.name.slice(0, 2)}
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                                <span className="text-[10px] text-slate-400 font-normal">{u.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${u.role === "admin" ? "bg-primary/10 text-primary border border-primary/20" : "bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-350"
                                }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${u.blocked ? "bg-red-100 text-red-700 dark:bg-red-950/20" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20"
                                }`}>
                                {u.blocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 justify-center">
                                {/* Toggle blocked state */}
                                <button
                                  onClick={() => handleToggleBlockUser(u)}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${u.blocked ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                                    }`}
                                >
                                  {u.blocked ? "Unblock" : "Block"}
                                </button>

                                {/* Toggle role */}
                                <button
                                  onClick={() => handleChangeUserRole(u, u.role === "admin" ? "customer" : "admin")}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold transition cursor-pointer"
                                >
                                  Make {u.role === "admin" ? "Customer" : "Admin"}
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1 text-red-500 hover:opacity-80 transition cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 9: REVIEWS MODULE */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Shopper Feedbacks</h3>
                    <p className="text-xs text-slate-400">Manage and moderate client reviews displayed on products.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase">
                                {rev.user.slice(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-slate-950 dark:text-slate-100">{rev.user}</h4>
                                <span className="text-[9px] text-slate-400">on <span className="font-semibold">{rev.product}</span></span>
                              </div>
                            </div>

                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${rev.status === "Approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20" : "bg-amber-100 text-amber-700 dark:bg-amber-950/20"
                              }`}>
                              {rev.status}
                            </span>
                          </div>

                          <div className="flex gap-0.5 text-amber-400 my-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} stroke="currentColor" />
                            ))}
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{rev.comment}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex gap-2 justify-end">
                          {rev.status === "Pending" && (
                            <button
                              onClick={() => handleReviewAction(rev.id, "Approve")}
                              className="px-3 py-1 bg-emerald-500 hover:opacity-90 text-white font-bold text-[10px] rounded-lg cursor-pointer transition"
                            >
                              Approve Feedback
                            </button>
                          )}
                          <button
                            onClick={() => handleReviewAction(rev.id, "Delete")}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/25 text-red-500 font-bold text-[10px] rounded-lg cursor-pointer transition"
                          >
                            Delete Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 10: COUPONS MODULE */}
              {activeTab === "coupons" && (
                <motion.div
                  key="coupons"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create Coupon form */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm h-fit">
                      <h3 className="font-extrabold text-slate-950 dark:text-white text-base mb-4">Create Promo Coupon</h3>
                      <form onSubmit={handleCouponSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Coupon Promo Code</label>
                          <input
                            type="text"
                            required
                            value={newCouponForm.code}
                            onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                            placeholder="e.g. DISCOUNT50"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Discount Value</label>
                          <input
                            type="text"
                            required
                            value={newCouponForm.discount}
                            onChange={(e) => setNewCouponForm({ ...newCouponForm, discount: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                            placeholder="e.g. 15% or ৳200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Expiry Date</label>
                          <input
                            type="date"
                            required
                            value={newCouponForm.expiry}
                            onChange={(e) => setNewCouponForm({ ...newCouponForm, expiry: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                        >
                          Generate Promo Code
                        </button>
                      </form>
                    </div>

                    {/* Coupons list */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {coupons.map((c) => (
                          <div
                            key={c.code}
                            className="p-5 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl relative flex justify-between items-center group hover:border-primary/50 transition text-left"
                          >
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Coupon Code</span>
                              <h4 className="font-black text-base text-slate-900 dark:text-white mt-0.5">{c.code}</h4>
                              <p className="text-xs text-slate-450 mt-2">Value: <span className="font-bold text-secondary dark:text-white">{c.discount}</span></p>
                              <p className="text-[10px] text-slate-400 mt-1">Expires: {new Date(c.expiry).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${c.status === "Active"
                                ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900"
                                : "text-slate-400 bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800"
                                }`}>
                                {c.status}
                              </span>
                              <button
                                onClick={() => handleDeleteCoupon(c.code)}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 11: ANALYTICS MODULE */}
              {activeTab === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Store Analytics Dashboard</h3>
                    <p className="text-xs text-slate-400">Comprehensive overview of store conversion, traffic and financial operations.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: "Conversion Rate", val: "2.84%", desc: "+0.45% from yesterday", isUp: true },
                      { label: "Average Order Value", val: "৳3,450", desc: "+৳120 from last month", isUp: true },
                      { label: "Store Bounce Rate", val: "42.12%", desc: "-1.8% decrease", isUp: false }
                    ].map((metric, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                        <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">{metric.label}</span>
                        <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{metric.val}</h4>
                        <p className={`text-[10px] font-bold mt-2 ${metric.isUp ? "text-emerald-500" : "text-orange-500"}`}>{metric.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic recharts Line and Bar chart combo */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">Aggregate Order Trends (Units vs Value)</h3>
                    <div className="h-80">
                      {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <ChartTooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="sales" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Orders Count" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 12: REPORTS MODULE */}
              {activeTab === "reports" && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left animate-fadeIn"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Administrative Reports</h3>
                    <p className="text-xs text-slate-400">Download formatted sheets of transactions, users and inventory status.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: "Store Sales Ledger Report", desc: "Covers all completed checkout totals, tax, and delivery charges.", type: "Sales" },
                      { title: "Inventory Availability Ledger", desc: "Catalog list showing product stocks, category values, and cost values.", type: "Inventory" },
                      { title: "Customer Purchase Frequency Sheet", desc: "List of all shopper accounts with purchase counts and total spends.", type: "Customers" },
                      { title: "Dispatch and Delivery Report", desc: "Details of pending orders, shipped dates, and package delivery durations.", type: "Delivery" }
                    ].map((rep, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{rep.title}</h4>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{rep.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-4">File format: <span className="font-bold text-secondary">CSV / Excel Sheet</span></p>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => handleExportReport(rep.type)}
                            className="px-4 py-2 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Download size={12} /> Export Ledger Sheet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 13: STORE CONFIGURATION (SETTINGS) */}
              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left"
                >
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm">
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base">Store Configuration Dashboard</h3>
                    <p className="text-xs text-slate-400 font-medium">Control global pricing thresholds, developer payment modules and support emails.</p>
                  </div>

                  <form onSubmit={handleSettingsSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Settings size={16} className="text-primary" /> Store Settings
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Store Title</label>
                          <input
                            type="text"
                            value={storeSettings.storeName}
                            onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Support Contact Email</label>
                          <input
                            type="email"
                            value={storeSettings.supportEmail}
                            onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Support Phone</label>
                          <input
                            type="text"
                            value={storeSettings.contactPhone}
                            onChange={(e) => setStoreSettings({ ...storeSettings, contactPhone: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Gateways settings */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <CreditCard size={16} className="text-secondary" /> Payment Gateways
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Stripe Public API Key</label>
                          <input
                            type="text"
                            value={storeSettings.stripePublicKey}
                            onChange={(e) => setStoreSettings({ ...storeSettings, stripePublicKey: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">SSLCommerz Store Merchant ID</label>
                          <input
                            type="text"
                            value={storeSettings.sslStoreId}
                            onChange={(e) => setStoreSettings({ ...storeSettings, sslStoreId: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Charges */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Truck size={16} className="text-purple-500" /> Shipping & Delivery
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Delivery Fee (৳)</label>
                          <input
                            type="number"
                            value={storeSettings.shippingCharge}
                            onChange={(e) => setStoreSettings({ ...storeSettings, shippingCharge: Number(e.target.value) })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Free Shipping Min (৳)</label>
                          <input
                            type="number"
                            value={storeSettings.freeShippingThreshold}
                            onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Appearance Preferences */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <Sun size={16} className="text-orange-500" /> Interface Style
                      </h4>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Toggle Theme Model</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => { if (isDarkMode) toggleDarkMode(); }}
                            className={`px-4 py-2 text-xs font-bold rounded-xl border flex-grow cursor-pointer ${!isDarkMode ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500"
                              }`}
                          >
                            Light Mode
                          </button>
                          <button
                            type="button"
                            onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
                            className={`px-4 py-2 text-xs font-bold rounded-xl border flex-grow cursor-pointer ${isDarkMode ? "bg-primary text-white border-primary" : "border-slate-700 text-slate-400"
                              }`}
                          >
                            Dark Mode
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                      >
                        Save Configurations
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 14: ADMIN PROFILE */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="max-w-2xl mx-auto text-left"
                >
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-lg mb-2">Administrative Profile</h3>
                    <p className="text-xs text-slate-400 mb-6">Modify personal information, upload profile avatars and update password credentials.</p>

                    <form onSubmit={handleProfileSave} className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-950 dark:text-white">{user.name}</h4>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{user.role}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={adminProfileForm.name}
                            onChange={(e) => setAdminProfileForm({ ...adminProfileForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Support Phone</label>
                          <input
                            type="text"
                            value={adminProfileForm.phone}
                            onChange={(e) => setAdminProfileForm({ ...adminProfileForm, phone: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                            placeholder="+880 1XXXXXXXXX"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contact Address</label>
                          <input
                            type="text"
                            value={adminProfileForm.address}
                            onChange={(e) => setAdminProfileForm({ ...adminProfileForm, address: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                          />
                        </div>
                      </div>

                      <hr className="border-slate-100 dark:border-slate-800/80" />

                      <div className="space-y-4">
                        <h4 className="font-bold text-sm text-slate-950 dark:text-white">Credentials Change</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Current Password</label>
                            <input
                              type="password"
                              value={adminProfileForm.currentPassword}
                              onChange={(e) => setAdminProfileForm({ ...adminProfileForm, currentPassword: e.target.value })}
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                              placeholder="Required to confirm update"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
                            <input
                              type="password"
                              value={adminProfileForm.newPassword}
                              onChange={(e) => setAdminProfileForm({ ...adminProfileForm, newPassword: e.target.value })}
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                            <input
                              type="password"
                              value={adminProfileForm.confirmPassword}
                              onChange={(e) => setAdminProfileForm({ ...adminProfileForm, confirmPassword: e.target.value })}
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none dark:text-white text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                        >
                          Update Admin Profile
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </main>
      </div>

      {/* ========================================= MODALS ========================================= */}
      <AnimatePresence>

        {/* MODAL 1: VIEW ORDER DETAILS */}
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden text-left"
              >
                <div className="h-14 border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-950 dark:text-white">Order Details</h4>
                  <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-550 cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Order Number</span>
                      <p className="font-bold mt-0.5 text-slate-800 dark:text-white">{getOrderNumber(selectedOrder._id)}</p>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-2.5">Database ID</span>
                      <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 break-all">{selectedOrder._id}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</span>
                      <p className="font-bold mt-0.5 text-slate-800 dark:text-slate-200">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800/80" />

                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer Details</span>
                    <div className="mt-1 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.customerName}</p>
                        {(selectedOrder.isGuest || !selectedOrder.user) && (
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                            Guest Order
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500">Phone: {selectedOrder.phone} {selectedOrder.optionalPhone && `(Alt: ${selectedOrder.optionalPhone})`}</p>
                      <p className="text-slate-500">Address: {selectedOrder.address}, {selectedOrder.thana}, {selectedOrder.district}</p>
                      {selectedOrder.orderNote && (
                        <p className="text-orange-600 dark:text-orange-400 font-medium pt-1 border-t border-slate-200 dark:border-slate-800">
                          Note: {selectedOrder.orderNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Items Purchased</span>
                    <div className="mt-1 flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{selectedOrder.product ? selectedOrder.product.name : "Product Unavailable"}</p>
                        <span className="text-slate-400">{selectedOrder.quantity} units x ৳{(selectedOrder.product?.price || 0).toLocaleString()}</span>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">৳{selectedOrder.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Delivery Charge</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Free</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Paid Amount</span>
                    <span className="font-black text-base text-primary dark:text-orange-500">৳{selectedOrder.totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="h-16 border-t border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-slate-400 text-[10px] uppercase">Status:</span>
                      <select
                        value={selectedOrder.deliveryStatus}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs cursor-pointer font-bold text-slate-800 dark:text-slate-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleDeleteOrder(selectedOrder._id)}
                      className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>

                <div className="h-16 border-t border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Status:</span>
                    <span className={selectedOrder.deliveryStatus === "pending" ? "text-amber-500" : "text-emerald-500"}>
                      {selectedOrder.deliveryStatus}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-xs font-bold text-slate-600 dark:text-slate-350 rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                    {selectedOrder.deliveryStatus === "pending" && (
                      <button
                        onClick={() => handleConfirmDeliver(selectedOrder._id)}
                        disabled={actionInProgress}
                        className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer flex items-center gap-1"
                      >
                        {actionInProgress && <Loader2 size={10} className="animate-spin" />}
                        Deliver Package
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* MODAL 2: VIEW PRODUCT DETAILS */}
        {viewProductDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewProductDetails(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl w-full max-w-md overflow-hidden text-left"
              >
                <div className="h-48 bg-slate-100 dark:bg-slate-850 relative">
                  {viewProductDetails.images?.[0] && (
                    <img src={viewProductDetails.images[0]} alt="" className="w-full h-full object-cover" />
                  )}
                  <button onClick={() => setViewProductDetails(null)} className="absolute top-4 right-4 p-1.5 bg-black/40 backdrop-blur-md text-white rounded-lg cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{viewProductDetails.category}</span>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">{viewProductDetails.name}</h4>
                  </div>
                  <div className="space-y-3">
                    {viewProductDetails.descriptionEn && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">English Description 🇺🇸</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{viewProductDetails.descriptionEn}</p>
                      </div>
                    )}
                    {viewProductDetails.descriptionBn && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bangla Description 🇧🇩</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{viewProductDetails.descriptionBn}</p>
                      </div>
                    )}
                    {!viewProductDetails.descriptionEn && !viewProductDetails.descriptionBn && (
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">{viewProductDetails.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650 dark:text-slate-350">
                    <div>
                      <p>Price: <span className="font-black text-slate-900 dark:text-white">৳{viewProductDetails.price}</span></p>
                    </div>
                    <div>
                      <p>Stock: <span className="font-black text-slate-900 dark:text-white">{viewProductDetails.stock} units</span></p>
                    </div>
                    <div>
                      <p>Discount: <span className="font-black text-orange-500">{viewProductDetails.discount}% Off</span></p>
                    </div>
                    <div>
                      <p>Featured: <span className="font-black">{viewProductDetails.featured ? "Yes" : "No"}</span></p>
                    </div>
                  </div>
                </div>
                <div className="h-16 px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-900/60">
                  <button
                    onClick={() => {
                      setViewProductDetails(null);
                      handleEditProductTrigger(viewProductDetails);
                    }}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    Edit Product
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}

      </AnimatePresence>
    </div>
  );

  // Helper form handler wrapping onSubmit to prevent default
  function onSubmitProductForm(e: React.FormEvent) {
    e.preventDefault();
    handleProductSubmit(e);
  }
}
