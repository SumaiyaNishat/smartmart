"use client";

import * as React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
