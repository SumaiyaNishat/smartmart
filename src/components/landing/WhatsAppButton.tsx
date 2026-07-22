"use client";

import * as React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const WhatsAppButton: React.FC = () => {
  const { t } = useLanguage();
  const phoneNumber = "+8801614599275"; // Enterprise helpline number fallback
  const message = "Hello SmartMart, I need help with my order.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <span className="absolute right-14 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all duration-200 origin-right bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-md select-none">
        {t("whatsappTooltip")}
      </span>

      {/* Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-green-500 hover:bg-green-600 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition duration-300 relative focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.023-5.115-2.887-6.979C16.582 1.898 14.1 .87 11.99 .87c-5.44 0-9.866 4.422-9.87 9.866-.001 1.702.453 3.361 1.314 4.816L2.4 21.088l5.886-1.543-1.639.95z" />
        </svg>
      </a>
    </div>
  );
};
