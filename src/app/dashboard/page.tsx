"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    images: string[];
    price: number;
  } | null;
  quantity: number;
  totalPrice: number;
  deliveryStatus: "pending" | "delivered";
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = React.useState<OrderDetail[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(true);

  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to access your dashboard.");
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchOrders = React.useCallback(async () => {
    try {
      const response = await axios.get("/api/orders");
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch {
      toast.error("Failed to load your orders history.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  if (authLoading || !user) {
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

  const pendingOrders = orders.filter((o) => o.deliveryStatus === "pending");
  const deliveredOrders = orders.filter((o) => o.deliveryStatus === "delivered");

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Header />

      <main className="container mx-auto px-6 py-12 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-secondary dark:text-white mb-2">
              Customer Dashboard
            </h1>
            <p className="text-sm text-slate-400">Welcome back, {user.name}! Manage your profile and check order statuses.</p>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Total Orders */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm text-left">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Total Orders</span>
            <p className="text-4xl font-black text-secondary dark:text-white mt-2">{orders.length}</p>
          </div>

          {/* Card 2: Pending Orders */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm text-left">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Pending Processing</span>
            <p className="text-4xl font-black text-amber-500 mt-2">{pendingOrders.length}</p>
          </div>

          {/* Card 3: Delivered Orders */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm text-left">
            <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Delivered Packages</span>
            <p className="text-4xl font-black text-green-500 mt-2">{deliveredOrders.length}</p>
          </div>
        </div>

        {/* Orders History list */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm text-left">
          <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6">
            My Orders History
          </h3>

          {ordersLoading ? (
            <div className="py-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm mb-4">You haven&apos;t placed any orders yet.</p>
              <Link href="/">
                <Button variant="primary">Browse and Order Products</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-l-xl">Order Date</th>
                    <th scope="col" className="px-6 py-3">Product Name</th>
                    <th scope="col" className="px-6 py-3">Address</th>
                    <th scope="col" className="px-6 py-3">Quantity</th>
                    <th scope="col" className="px-6 py-3">Total Price</th>
                    <th scope="col" className="px-6 py-3 rounded-r-xl">Delivery Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order._id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-secondary dark:text-white">
                        {order.product ? order.product.name : "Product Unavailable"}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {order.address}, {order.thana}, {order.district}
                      </td>
                      <td className="px-6 py-4 font-bold text-secondary dark:text-white">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 font-black text-secondary dark:text-white">
                        ৳{order.totalPrice.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                            order.deliveryStatus === "pending"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {order.deliveryStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
