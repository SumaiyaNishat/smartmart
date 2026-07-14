"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Check dark mode status in localstorage
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
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Find the products section and trigger search
      const productsSection = document.getElementById("our-products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
      // Emit search event
      const event = new CustomEvent("smartmart-search", { detail: searchQuery });
      window.dispatchEvent(event);
    }
  };

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-12">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
            data-purpose="brand-logo"
            aria-label="SmartMart Home"
          >
            <span className="text-primary">Smart</span>
            <span className="text-secondary dark:text-white">Mart</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-secondary dark:text-slate-200" aria-label="Main Navigation">
            <Link href="/" className="hover:text-primary transition duration-200 rounded">
              {t("home")}
            </Link>
            <a href="#our-products" className="hover:text-primary transition duration-200 rounded">
              {t("products")}
            </a>
          </nav>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center space-x-6">
          {/* Search Trigger and Input */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white w-48 md:w-64 transition-all duration-300"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 text-slate-400 hover:text-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-secondary dark:text-slate-200 hover:text-primary transition focus:outline-none p-2 rounded-lg"
                aria-label="Open search bar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "en" ? "bn" : "en")}
            className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-secondary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            aria-label={`Switch language to ${language === "en" ? "Bangla" : "English"}`}
          >
            {language === "en" ? "বাং" : "EN"}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-secondary dark:text-slate-200 hover:text-primary transition focus:outline-none p-2 rounded-lg"
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? (
              // Sun Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            ) : (
              // Moon Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            )}
          </button>

          {/* Shopping Cart Icon Link */}
          <Link
            href="/cart"
            className="relative text-secondary dark:text-slate-200 hover:text-primary transition p-2 rounded-lg"
            aria-label="View shopping cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Profile / Auth Operations */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2 text-sm font-semibold text-secondary dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full p-1"
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-float-subtle">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
                  >
                    {t("dashboard")}
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-primary hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-left"
                    >
                      {t("adminPanel")}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-sm font-bold text-secondary dark:text-slate-200 hover:text-primary transition">
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold bg-primary text-white px-5 py-2 rounded-xl shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {t("register")}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger menu */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-secondary dark:text-slate-200 hover:text-primary focus:outline-none p-2 rounded-lg"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-8 py-6 flex flex-col space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-4 text-left">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-secondary dark:text-slate-100 hover:text-primary transition"
            >
              {t("home")}
            </Link>
            <a
              href="#our-products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-bold text-secondary dark:text-slate-100 hover:text-primary transition"
            >
              {t("products")}
            </a>
          </nav>

          <hr className="border-slate-200/50 dark:border-slate-800/50" />

          {user ? (
            <div className="flex flex-col space-y-3 text-left">
              <p className="text-sm font-bold text-slate-400">Logged in as: {user.name}</p>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-secondary dark:text-slate-100 hover:text-primary transition"
              >
                {t("dashboard")}
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-primary transition"
                >
                  {t("adminPanel")}
                </Link>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="text-lg font-bold text-red-500 hover:underline text-left"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-secondary dark:text-slate-100 hover:text-primary transition text-center"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center text-lg font-bold bg-primary text-white py-3 rounded-xl shadow-md hover:opacity-90 transition duration-300"
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
