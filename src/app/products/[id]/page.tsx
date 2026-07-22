/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useCart, IProduct } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [product, setProduct] = React.useState<IProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [zoomStyle, setZoomStyle] = React.useState<React.CSSProperties>({ display: "none" });

  // Fallback mock items
  const mockProducts: IProduct[] = [
    {
      _id: "65c1f0f29c426639bca0b001",
      name: "প্লাগ ইন কুরাআন",
      description: "Experience premium sound quality with active hybrid noise cancelling engineering.",
      price: 4990,
      images: [
        "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
      ],
      category: "Gadgets",
      stock: 12,
      discount: 10,
      featured: true,
      rating: 4.8,
    },
    {
      _id: "65c1f0f29c426639bca0b002",
      name: "Turbo Fan",
      description: "Track your health metrics, dynamic workouts, heart rate, and sleep analytics.",
      price: 3490,
      images: [
        "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784626040/3f2b4b89-c533-4f89-9e36-414eddf5d070_uuloyy.jpg"
      ],
      category: "Electronics",
      stock: 8,
      discount: 0,
      featured: true,
      rating: 4.6,
    },
    {
      _id: "65c1f0f29c426639bca0b003",
      name: "UltraThin Developer Laptop 15",
      description: "Supercharged M-series processors with 16GB RAM for optimal coding throughput.",
      price: 89000,
      images: [
      ],
      category: "Electronics",
      stock: 4,
      discount: 5,
      featured: true,
      rating: 4.9,
    },
    {
      _id: "65c1f0f29c426639bca0b004",
      name: "Smart Speaker Voice Hub",
      description: "Intelligent speaker with premium acoustic output and integrated smart home control.",
      price: 2490,
      images: [

      ],
      category: "Smart Home",
      stock: 0,
      discount: 0,
      featured: false,
      rating: 4.3,
    },
  ];

  const fetchProduct = React.useCallback(async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      if (response.data && response.data.product) {
        setProduct(response.data.product);
      } else {
        const fallback = mockProducts.find((p) => p._id === id);
        setProduct(fallback || null);
      }
    } catch {
      const fallback = mockProducts.find((p) => p._id === id);
      setProduct(fallback || null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  React.useEffect(() => {
    if (product && searchParams.get("buy") === "true") {
      router.push(`/checkout?mode=buyNow&product=${product._id}&quantity=1`);
    }
  }, [product, searchParams, router]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${product?.images[activeImageIndex]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleBuyNow = () => {
    if (!product) return;
    router.push(`/checkout?mode=buyNow&product=${product._id}&quantity=${quantity}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Header />
        <div className="container mx-auto px-6 py-20 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Header />
        <div className="container mx-auto px-6 py-20 flex-grow text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link href="/" className="text-primary hover:underline">
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const inStock = product.stock > 0;

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Header />

      <main className="container mx-auto px-6 py-12 flex-grow">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Image Gallery Column */}
          <div className="flex flex-col space-y-4">
            {/* Main Image with Zoom Lens */}
            <div
              className="relative w-full h-[350px] md:h-[450px] bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <SafeImage
                alt={product.name}
                src={product.images[activeImageIndex]}
                fill
                className="object-contain p-6"
                priority
              />
              <div
                className="absolute inset-0 pointer-events-none border border-slate-200/20 rounded-2xl bg-no-repeat"
                style={zoomStyle}
              />
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 cursor-pointer ${activeImageIndex === idx ? "border-primary" : "border-transparent"
                      }`}
                  >
                    <SafeImage alt={`${product.name} thumbnail ${idx}`} src={img} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="flex flex-col justify-between text-left">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary mb-2 block">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-secondary dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"
                        }`}
                      stroke="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-500">({product.rating} customer rating)</span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-3xl font-black text-secondary dark:text-white">
                  ৳{discountedPrice.toFixed(0)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through">
                    ৳{product.price}
                  </span>
                )}
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full ${inStock
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                >
                  {inStock ? `${t("inStock")} (${product.stock})` : t("outOfStock")}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Specifications Block */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-6 mb-8">
                <h4 className="font-bold text-sm text-secondary dark:text-white mb-3">Product Details & Specifications</h4>
                <table className="w-full text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <tbody>
                    <tr className="border-b border-slate-50 dark:border-slate-800 py-2 block">
                      <td className="w-40 font-semibold text-slate-400">Category</td>
                      <td>{product.category}</td>
                    </tr>
                    <tr className="border-b border-slate-50 dark:border-slate-800 py-2 block">
                      <td className="w-40 font-semibold text-slate-400">Warranty</td>
                      <td>1-Year Manufacturer Warranty</td>
                    </tr>
                    <tr className="py-2 block">
                      <td className="w-40 font-semibold text-slate-400">Shipping</td>
                      <td className="text-primary font-bold">FREE Delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions Block */}
            {inStock && (
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-slate-400">Quantity:</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 px-3 py-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-slate-400 hover:text-primary px-2 font-bold focus:outline-none"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-secondary dark:text-white select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="text-slate-400 hover:text-primary px-2 font-bold focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Confirm Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => addToCart(product, quantity)}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-700 border-none text-secondary dark:text-slate-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                    <span>{t("addToCart")}</span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleBuyNow}
                    className="w-full sm:w-auto px-12 py-4 bg-primary text-white hover:scale-105 transition"
                  >
                    {t("buyNow")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
