"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(11, "Phone number must be at least 11 digits").max(14, "Phone number too long"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  thana: z.string().min(2, "Thana is required"),
  district: z.string().min(2, "District (Jela) is required"),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartItems, grandTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to access checkout.");
      router.push("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data: CheckoutInput) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      // Loop and place order for each item in the cart
      const promises = cartItems.map((item) => {
        const discountedPrice = item.product.price * (1 - item.product.discount / 100);
        const itemTotal = discountedPrice * item.quantity;

        return axios.post("/api/orders", {
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          thana: data.thana,
          district: data.district,
          productId: item.product._id,
          quantity: item.quantity,
          totalPrice: itemTotal,
        });
      });

      await Promise.all(promises);

      toast.success("Order confirmed successfully!");
      clearCart();
      setShowSuccessModal(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.error || "Failed to confirm order.");
      } else {
        toast.error("Failed to place your order. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Header />

      <main className="container mx-auto px-6 py-12 flex-grow max-w-4xl">
        <h1 className="text-3xl font-extrabold text-secondary dark:text-white mb-8 text-left">
          Checkout Shipping Form
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details column */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm text-left">
            <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6">
              Your Items
            </h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
              {cartItems.map((item) => {
                const discountedPrice = item.product.price * (1 - item.product.discount / 100);
                return (
                  <div key={item.product._id} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-700/50 pb-3">
                    <div className="max-w-[180px]">
                      <p className="font-bold text-secondary dark:text-white truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-400">Qty: {item.quantity} &times; ৳{discountedPrice.toFixed(0)}</p>
                    </div>
                    <span className="font-extrabold text-secondary dark:text-white">৳{(discountedPrice * item.quantity).toFixed(0)}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{grandTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-primary font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-secondary dark:text-white pt-2">
                <span>Grand Total</span>
                <span className="text-lg text-primary font-black">৳{grandTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm text-left">
            <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6">
              Shipping & Delivery Information
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Customer Name</label>
                <input
                  type="text"
                  {...register("customerName")}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                />
                {errors.customerName && (
                  <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 017XXXXXXXX"
                  {...register("phone")}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Full Address</label>
                <textarea
                  placeholder="House, Road, Area..."
                  rows={2}
                  {...register("address")}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white resize-none"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Thana & District Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Thana</label>
                  <input
                    type="text"
                    {...register("thana")}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                  />
                  {errors.thana && (
                    <p className="text-xs text-red-500 mt-1">{errors.thana.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">District (Jela)</label>
                  <input
                    type="text"
                    {...register("district")}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                  />
                  {errors.district && (
                    <p className="text-xs text-red-500 mt-1">{errors.district.message}</p>
                  )}
                </div>
              </div>

              {/* Read Only Total Price */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl flex justify-between items-center text-sm font-bold text-slate-500 border border-slate-100 dark:border-slate-800">
                <span>Grand Total (FREE Delivery)</span>
                <span className="text-lg text-secondary dark:text-white font-extrabold">৳{grandTotal.toFixed(0)}</span>
              </div>

              {/* Confirm Order Button */}
              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
                className="w-full py-4 text-center justify-center font-bold text-sm uppercase cursor-pointer"
              >
                {submitting ? "Processing..." : "Confirm Order"}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 max-w-md w-full text-center shadow-2xl mx-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-secondary dark:text-white mb-2">Order Confirmed!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Thank you for shopping at SmartMart. Your order has been registered and is now pending processing.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/dashboard");
              }}
              className="w-full py-3"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
