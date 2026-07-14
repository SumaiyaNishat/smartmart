"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface FeatureItem {
  icon: React.ReactNode;
  label: string;
}

interface TrustBadgeItem {
  icon: React.ReactNode;
  label: string;
}

export const Hero: React.FC = () => {
  const features: FeatureItem[] = [
    {
      label: "৩০ পারা কোরআন",
      icon: (
        <svg className="w-6 h-6 text-[#0D3B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: "৫০ টি হাদিস",
      icon: (
        <svg className="w-6 h-6 text-[#0D3B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1m-6 10l4 4m0 0l4-4m-4 4V11"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: "রুকইয়া শরীফ",
      icon: (
        <svg className="w-6 h-6 text-[#0D3B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: "নামাজ শিক্ষা",
      icon: (
        <svg className="w-6 h-6 text-[#0D3B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: "শিশুদের জন্য",
      icon: (
        <svg className="w-6 h-6 text-[#0D3B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: "জিকির ও অন্যান্য",
      icon: (
        <svg className="w-6 h-6 text-[#0D3B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  const trustBadges: TrustBadgeItem[] = [
    {
      label: "৭ দিনের\nরিটার্ন নীতি",
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "সারা দেশে\nক্যাশ অন ডেলিভারি",
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "১০০% অরিজিনাল\nপ্রোডাক্ট",
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      label: "নিরাপদ\nপেমেন্ট",
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  const handleOrderRedirect = () => {
    // Scroll down to the products list to make a purchase
    const productsSection = document.getElementById("our-products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full max-w-[430px] lg:max-w-none bg-gradient-to-b from-[#E6F3FF] to-white dark:from-slate-900 dark:to-slate-800 rounded-3xl overflow-hidden shadow-xl lg:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-10 flex flex-col lg:flex-row items-center justify-between mb-16 mx-auto">
      
      {/* Background Arch Decor */}
      <div className="absolute top-[10%] right-0 w-[60%] opacity-20 pointer-events-none -z-10 mosque-arch">
        <Image
          alt="Background Arch decoration"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbJaUIu25S7F0Yat4MPV0wvwOuP-sBcqMwFzfE_H3KYGqLVKE2wATYmJGiMezfLvU2MWh3hXwDg5FKqfjTmMcRzG2zIOOrVgfe4q1jipC48_DNRyPBscmY6pybMHrF4GKZUTDoRytumRLALAiA-L9yhogxDreAP0gluVZYU58Zbv-eMg8rcWK5m8HddPUPKZA4fv5eNqGxU38fJXyEveOe3pU2tqMwGUyE9ov0GtmfPDMsFAwz_FeBLPZB4QOSxIfhuA"
          width={400}
          height={300}
          priority
        />
      </div>

      {/* Left Content Block */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-[#0066CC] text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full mb-6 select-none"
        >
          আল্লাহর বাণী, হাদিস ও দোয়া সাথে রাখুন সবসময়
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[#0D3B66] dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight"
        >
          ডিজিটাল কোরআন <br /> স্পিকার
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#4A5568] dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-[85%] lg:max-w-lg mb-8"
        >
          ৩০ পারা কোরআন, ৫০ টি হাদিস, রুকইয়া, নামাজ শিক্ষা, শিশুশিক্ষা এবং আরো অনেক কিছু এক ডিভাইসে।
        </motion.p>

        {/* Feature Icons Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-y-6 gap-x-2 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60 dark:border-slate-700/60 w-full mb-8"
          data-purpose="features-grid"
        >
          {features.map((feat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-8 h-8 mb-1.5 flex items-center justify-center group-hover:scale-110 transition duration-200">
                {feat.icon}
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                {feat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Product Display Block */}
      <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0 flex flex-col items-center">
        {/* Main Product display segment */}
        <div className="relative w-full h-[300px] md:h-[350px] flex justify-center items-end" data-purpose="product-visual">
          
          {/* Pricing Badge Overlay */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="absolute top-[30%] right-[10%] bg-white dark:bg-slate-800 rounded-full shadow-lg w-24 h-24 flex flex-col justify-center items-center z-20 border border-slate-100 dark:border-slate-700 price-badge select-none"
            data-purpose="pricing"
          >
            <span className="text-[8px] md:text-[9px] text-slate-500 font-bold leading-none mb-1">विशेष মূল্য</span>
            <span className="text-[#0D3B66] dark:text-white text-base md:text-lg font-black">৳ ১,৩৯০</span>
            <span className="text-xs text-slate-400 line-through">৳ ১,৭৯০</span>
          </motion.div>

          {/* Podium Base */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 z-0 podium">
            <div className="bg-white dark:bg-slate-700 rounded-full h-12 w-full transform scale-y-[0.4] shadow-md border border-slate-100/20" />
          </div>

          {/* Main Product Image */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 w-full flex justify-center items-end pb-8"
          >
            <Image
              alt="Digital Quran Speaker"
              className="w-full max-w-[280px] md:max-w-[320px] h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgL18tyUhLARyw-RiE1MlERlLNJbNo7eVWEM5PNIuHe724LkI9MhmxyhJv6WFTVOg2y5BbK2XgpHhW56XwdgceZBFBiAntyQsiMNQd0cLIzjfhoL67O2crsb97dtMuA0SDvx4Ydj73RgwwQVI2AA0VJG20eTyy-woU5uw9V9YN6w548fH9PT5svsBHmMhNiya1vF3VSAe-7b9RWK8UI_6uTUgFr7n0FzwqZUEp_kKoWGgAvZXhCByhw6GwDDK0EB3OUQ"
              width={320}
              height={320}
              priority
            />
          </motion.div>

          {/* Green Leaves Background Decors with float animations */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute -left-4 bottom-0 w-24 h-24 rotate-45 opacity-60 z-30 pointer-events-none leaf-decoration"
          >
            <svg fill="#4ADE80" viewBox="0 0 200 200" className="w-full h-full">
              <path d="M40 180c0-60 60-100 120-100m-120 100c60 0 100-60 100-120" fill="none" stroke="#22C55E" strokeWidth="4" />
            </svg>
          </motion.div>

          <motion.div
            animate={{ y: [4, -4, 4], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -right-6 -bottom-4 w-32 h-32 -rotate-12 opacity-80 z-30 pointer-events-none leaf-decoration"
          >
            <svg fill="#22C55E" viewBox="0 0 200 200" className="w-full h-full">
              <path d="M20 180c20-80 100-140 160-140m-160 140c80-20 140-100 140-160" fill="none" stroke="#15803D" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        {/* CTA Actions Section */}
        <div className="w-full flex flex-col gap-3 mt-6">
          {/* Order Now Button */}
          <button
            onClick={handleOrderRedirect}
            className="w-full bg-[#0066CC] hover:bg-[#0052A3] active:scale-[0.98] transition-all text-white py-3 rounded-lg flex items-center justify-center gap-3 font-semibold text-lg shadow-lg cursor-pointer"
            data-purpose="cta-primary"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            অর্ডার করুন এখনই
          </button>

          {/* How to Use Button */}
          <button
            className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-lg flex items-center justify-center gap-3 font-medium transition-all active:scale-[0.98] cursor-pointer"
            data-purpose="cta-secondary"
          >
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            কিভাবে ব্যবহার করবেন
          </button>
        </div>

        {/* Trust Badges */}
        <div className="w-full mt-6 grid grid-cols-4 gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-blue-50 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-1">
                {badge.icon}
              </div>
              <span className="text-[8px] md:text-[9px] text-slate-500 dark:text-slate-400 font-bold whitespace-pre-line leading-snug">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
