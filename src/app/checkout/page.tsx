"use client";

import * as React from "react";
import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-bg-light dark:bg-slate-950 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
