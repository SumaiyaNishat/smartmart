"use client";

import * as React from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Products } from "@/components/landing/Products";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-6 flex-grow">
        <Hero />
        <Products />
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Floating accents shapes */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] border border-primary/5 rounded-full pointer-events-none -z-20" />
      <div className="fixed top-[40%] left-[-5%] w-4 h-4 bg-primary rounded-full blur-[2px] opacity-40 pointer-events-none" />
      <div className="fixed bottom-[20%] left-[20%] w-3 h-3 bg-accent rounded-full blur-[1px] opacity-40 pointer-events-none" />
    </div>
  );
}
