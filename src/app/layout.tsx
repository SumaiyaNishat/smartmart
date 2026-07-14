import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SmartMart | Everything You Need, Delivered Fast.",
  description:
    "SmartMart is a modern full-stack e-commerce experience. Change the quality of your personality by changing your appearance. Everything reflects your character and we're taking care of it.",
  keywords: [
    "SmartMart",
    "E-commerce",
    "Electronics",
    "In-Demand Products",
    "Best Prices",
    "Warranty",
  ],
  authors: [{ name: "SmartMart Team" }],
  openGraph: {
    title: "SmartMart | Everything You Need, Delivered Fast.",
    description:
      "SmartMart is a modern full-stack e-commerce experience. Change the quality of your personality by changing your appearance. Everything reflects your character and we're taking care of it.",
    type: "website",
    locale: "en_US",
    url: "https://smartmart.example.com",
    siteName: "SmartMart",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartMart | Everything You Need, Delivered Fast.",
    description:
      "SmartMart is a modern full-stack e-commerce experience. Change the quality of your personality by changing your appearance. Everything reflects your character and we're taking care of it.",
  },
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${hindSiliguri.variable} h-full antialiased`}>
      <body className="bg-soft-gradient min-h-screen font-sans text-foreground overflow-x-hidden flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


