/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

const dictionary = {
  en: {
    logo: "SmartMart",
    tagline: "Everything You Need, Delivered Fast.",
    home: "Home",
    products: "Products",
    cart: "Cart",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    searchPlaceholder: "Search products...",
    searchBtn: "Search",
    heroTitle: "The ultimate product with pleasure",
    heroDesc: "Let your product do the magic care for you. Change the quality of your personality by changing your appearance. Everything reflects your character and we're taking care of it.",
    shopNow: "Shop Now",
    explore: "Explore Products",
    statProducts: "1000+ Products",
    statCustomers: "5000+ Happy Customers",
    statDelivery: "Free Delivery",
    statSupport: "24/7 Support",
    productsHeading: "Featured Products",
    buyNow: "Buy Now",
    addToCart: "Add to Cart",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    whatsappTooltip: "Need Help?",
  },
  bn: {
    logo: "স্মার্টমার্ট",
    tagline: "আপনার যা প্রয়োজন, দ্রুত পৌঁছে যাবে।",
    home: "হোম",
    products: "পণ্যসমূহ",
    cart: "কার্ট",
    login: "লগইন",
    register: "রেজিস্টার",
    logout: "লগআউট",
    dashboard: "ড্যাশবোর্ড",
    adminPanel: "অ্যাডমিন প্যানেল",
    searchPlaceholder: "পণ্য অনুসন্ধান করুন...",
    searchBtn: "খুঁজুন",
    heroTitle: "আনন্দের সাথে সেরা পণ্যসমূহ",
    heroDesc: "আপনার পণ্যকে আপনার জন্য জাদুকরী যত্ন নিতে দিন। আপনার চেহারা পরিবর্তন করে আপনার ব্যক্তিত্বের গুণমান পরিবর্তন করুন। সবকিছু আপনার চরিত্রকে প্রতিফলিত করে এবং আমরা এর যত্ন নিচ্ছি।",
    shopNow: "কিনুন",
    explore: "পণ্যসমূহ দেখুন",
    statProducts: "১০০০+ পণ্য",
    statCustomers: "৫০০০+ সুখী ক্রেতা",
    statDelivery: "ফ্রি ডেলিভারি",
    statSupport: "২৪/৭ সাপোর্ট",
    productsHeading: "বিশেষ পণ্যসমূহ",
    buyNow: "এখনই কিনুন",
    addToCart: "কার্টে যোগ করুন",
    inStock: "স্টকে আছে",
    outOfStock: "স্টকে নেই",
    whatsappTooltip: "সাহায্য লাগবে?",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = React.useState<Language>("en");

  React.useEffect(() => {
    const storedLang = localStorage.getItem("smartmart-lang") as Language;
    if (storedLang === "en" || storedLang === "bn") {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("smartmart-lang", lang);
  };

  const t = (key: string): string => {
    const langDict = dictionary[language];
    return (langDict as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div lang={language} className={language === "bn" ? "font-sans" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
