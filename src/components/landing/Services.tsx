"use client";

import * as React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ServiceItem {
  titleKey: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

export const Services: React.FC = () => {
  const { t } = useLanguage();

  const services: ServiceItem[] = [
    {
      titleKey: "serviceElectronics",
      ariaLabel: "Browse our Electronic Products collection",
      icon: (
        <svg className="w-8 h-8 text-secondary dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      titleKey: "serviceInDemand",
      ariaLabel: "Browse our In-Demand Products collection",
      icon: (
        <svg className="w-8 h-8 text-secondary dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      titleKey: "serviceBestPrices",
      ariaLabel: "Learn about our Best Prices guarantee",
      icon: (
        <svg className="w-8 h-8 text-secondary dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      titleKey: "serviceWarranty",
      ariaLabel: "Find out more about our 1-Year Warranty",
      icon: (
        <svg className="w-8 h-8 text-secondary dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="pb-20" aria-labelledby="services-heading">
      <h3 id="services-heading" className="text-xl font-extrabold text-secondary dark:text-white mb-8">
        {t("ourServices")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {services.map((service, index) => (
          <button
            key={index}
            aria-label={service.ariaLabel}
            className="bg-ecomm-light-blue dark:bg-sky-900/40 p-6 rounded-2xl aspect-[4/3] flex flex-col justify-between items-start text-left group hover:bg-opacity-95 transition duration-300 transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-4 focus:ring-ecomm-light-blue/50 w-full"
            data-purpose="service-card"
          >
            <div className="p-1 rounded-lg group-hover:scale-110 transition duration-300">
              {service.icon}
            </div>
            <span className="text-secondary dark:text-slate-100 font-extrabold leading-tight whitespace-pre-line text-lg">
              {t(service.titleKey)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
