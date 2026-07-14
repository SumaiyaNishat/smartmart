"use client";

import * as React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand & About */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-white focus:outline-none">
            <span className="text-primary">Smart</span>
            <span>Mart</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            {t("tagline")} Change the quality of your personality by changing your appearance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition">
                {t("home")}
              </Link>
            </li>
            <li>
              <a href="#our-products" className="hover:text-white transition">
                {t("products")}
              </a>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition">
                {t("cart")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white transition">
                Customer Support
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Newsletter</h4>
          <p className="text-sm mb-4">Subscribe to receive the latest updates and featured offers.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="px-4 py-2 bg-slate-800 text-white rounded-l-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm w-full border border-slate-700"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white font-bold rounded-r-xl text-sm hover:opacity-90 transition cursor-pointer"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <hr className="border-slate-800 my-10 container mx-auto px-6" />

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>&copy; {currentYear} SmartMart. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition" aria-label="Facebook Link">Facebook</a>
          <a href="#" className="hover:text-white transition" aria-label="Twitter Link">Twitter</a>
          <a href="#" className="hover:text-white transition" aria-label="Instagram Link">Instagram</a>
        </div>
      </div>
    </footer>
  );
};
