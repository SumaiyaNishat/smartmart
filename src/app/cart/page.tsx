/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, grandTotal } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleCheckoutRedirect = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Header />

      <main className="container mx-auto px-6 py-12 flex-grow">
        <h1 className="text-3xl font-extrabold text-secondary dark:text-white mb-8 text-left">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl max-w-xl mx-auto px-6 shadow-sm">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">Your Cart is Empty</h3>
            <p className="text-sm text-slate-400 mb-6">Browse our homepage products and add some items to get started.</p>
            <Link href="/">
              <Button variant="primary">Shop Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const discountedPrice = item.product.price * (1 - item.product.discount / 100);
                return (
                  <div
                    key={item.product._id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 flex flex-col sm:flex-row items-center justify-between shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="flex items-center space-x-4 w-full sm:w-auto text-left">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                        <SafeImage alt={item.product.name} src={item.product.images[0]} fill className="object-contain p-2" />
                      </div>
                      
                      {/* Title & Desc */}
                      <div>
                        <h4 className="text-sm font-extrabold text-secondary dark:text-white line-clamp-2 max-w-xs leading-snug">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wide">
                          {item.product.category}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector & Price */}
                    <div className="flex items-center justify-between sm:justify-end space-x-8 w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-none pt-4 sm:pt-0">
                      {/* Quantity control */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="text-slate-400 hover:text-primary px-1.5 font-bold focus:outline-none"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-secondary dark:text-white select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="text-slate-400 hover:text-primary px-1.5 font-bold focus:outline-none"
                        >
                          +
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <p className="text-sm font-black text-secondary dark:text-white">
                          ৳{(discountedPrice * item.quantity).toFixed(0)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-slate-400">৳{discountedPrice.toFixed(0)} each</p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-slate-400 hover:text-red-500 transition p-2 rounded-lg cursor-pointer"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Column */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm h-fit text-left">
              <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                Order Summary
              </h3>

              <div className="space-y-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-secondary dark:text-white">৳{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-primary font-bold">FREE</span>
                </div>
                <hr className="border-slate-100 dark:border-slate-700" />
                <div className="flex justify-between text-base">
                  <span className="font-extrabold text-secondary dark:text-white">Grand Total</span>
                  <span className="font-black text-secondary dark:text-white">৳{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleCheckoutRedirect}
                className="w-full py-4 text-center justify-center font-bold"
              >
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-center">
                <Link href="/" className="text-xs text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
