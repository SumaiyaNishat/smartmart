/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, IProduct } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Zap,
  Lock,
  CreditCard,
  Share2,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Eye,
  Sparkles,
  ThumbsUp,
  Award
} from "lucide-react";

// Mock Fallbacks for missing IDs
const mockProducts: IProduct[] = [
  {
    _id: "65c1f0f29c426639bca0b001",
    name: "প্লাগ ইন কুরআন",
    description: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    descriptionEn: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    descriptionBn: "অ্যাক্টিভ হাইব্রিড নয়েজ ক্যানসেলিং প্রযুক্তির মাধ্যমে প্রিমিয়াম সাউন্ড কোয়ালিটির অভিজ্ঞতা নিন।",
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
    description: "High power multi-speed portable turbo cooling fan with rechargeable battery.",
    descriptionEn: "High power multi-speed portable turbo cooling fan with rechargeable battery.",
    descriptionBn: "রিচার্জেবল ব্যাটারিসহ হাই-পাওয়ার মাল্টি-স্পিড পোর্টেবল টার্বো কুলিং ফ্যান।",
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
    descriptionEn: "Supercharged M-series processors with 16GB RAM for optimal coding throughput.",
    descriptionBn: "অপটিমাল কোডিং ও পারফরম্যান্সের জন্য ১৬ জিবি র‍্যাম এবং এম-সিরিজ প্রসেসর।",
    price: 89000,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
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
    descriptionEn: "Intelligent speaker with premium acoustic output and integrated smart home control.",
    descriptionBn: "প্রিমিয়াম একোস্টিক আউটপুট এবং সমন্বিত স্মার্ট হোম কন্ট্রোলসহ ইন্টেলিজেন্ট স্পিকার।",
    price: 2490,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
    ],
    category: "Smart Home",
    stock: 0,
    discount: 0,
    featured: false,
    rating: 4.3,
  },
];

// Premium Skeleton Loader
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 flex-grow">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200/60 dark:border-slate-800 shadow-sm">
          {/* Gallery Column (5 cols = ~45%) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="w-full aspect-[4/3] sm:aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="flex space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Details Column (7 cols = ~55%) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-24 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="h-14 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;

  const { addToCart } = useCart();
  const { language, t, formatPrice, formatNumber, getLocalizedProduct } = useLanguage();

  const [product, setProduct] = React.useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<IProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = React.useState<IProduct[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isAddedToCart, setIsAddedToCart] = React.useState(false);
  const [zoomStyle, setZoomStyle] = React.useState<React.CSSProperties>({ display: "none" });

  // Fetch Primary Product
  const fetchProduct = React.useCallback(async () => {
    setLoading(true);
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

  // Fetch Related Products & Load Recently Viewed
  const fetchRelatedAndRecent = React.useCallback(async (currentProd: IProduct) => {
    try {
      const response = await axios.get("/api/products");
      if (response.data && Array.isArray(response.data.products)) {
        const allProds: IProduct[] = response.data.products;
        // Filter Related by Category
        const related = allProds
          .filter((p) => p._id !== currentProd._id && p.category === currentProd.category)
          .slice(0, 4);

        setRelatedProducts(related.length > 0 ? related : allProds.filter((p) => p._id !== currentProd._id).slice(0, 4));

        // Manage Recently Viewed in LocalStorage
        try {
          const rawRecent = localStorage.getItem("smartmart_recently_viewed");
          let recentList: IProduct[] = rawRecent ? JSON.parse(rawRecent) : [];
          // Deduplicate and insert current product at top
          recentList = recentList.filter((p) => p._id !== currentProd._id);
          recentList.unshift(currentProd);
          recentList = recentList.slice(0, 4);
          localStorage.setItem("smartmart_recently_viewed", JSON.stringify(recentList));
          // Filter out current product for the display shelf
          setRecentlyViewed(recentList.filter((p) => p._id !== currentProd._id));
        } catch (e) {
          console.error("Failed to read/write recently viewed items:", e);
        }
      }
    } catch {
      setRelatedProducts(mockProducts.filter((p) => p._id !== currentProd._id));
    }
  }, []);

  React.useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  React.useEffect(() => {
    if (product) {
      fetchRelatedAndRecent(product);
    }
  }, [product, fetchRelatedAndRecent]);

  // Auto Buy Now redirect query parameter trigger
  React.useEffect(() => {
    if (product && searchParams.get("buy") === "true") {
      router.replace(`/checkout?mode=buyNow&product=${product._id}&quantity=1`);
    }
  }, [product, searchParams, router]);

  // Lens Zoom Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    const currentImg = product?.images?.[activeImageIndex] || "/placeholder.png";

    setZoomStyle({
      display: "block",
      backgroundImage: `url(${currentImg})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "220%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setIsAddedToCart(true);
      toast.success(t("itemAddedToast"));
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push(`/checkout?mode=buyNow&product=${product._id}&quantity=${quantity}`);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t("linkCopied"));
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="container mx-auto px-6 py-24 flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white dark:bg-slate-900 rounded-3xl p-10 max-w-md border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              {t("productNotFound")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {t("productNotFoundDesc")}
            </p>
            <Link href="/">
              <Button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                {t("backToProducts")}
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const localized = getLocalizedProduct(product);
  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.png"];
  const currentMainImage = images[activeImageIndex] || images[0];

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const inStock = product.stock > 0;
  const isLowStock = inStock && product.stock <= 5;
  const skuString = `SM-${product._id.slice(-6).toUpperCase()}`;

  // Customer Reviews Data Structure
  const mockReviews = [
    {
      id: 1,
      name: language === "bn" ? "আরিফুল ইসলাম" : "Ariful Islam",
      rating: 5,
      date: "2 days ago",
      comment: language === "bn"
        ? "অসাধারণ সাউন্ড কোয়ালিটি এবং খুব দ্রুত ডেলিভারি পেয়েছি। ১০০% অরিজিনাল প্রোডাক্ট।"
        : "Exceptional sound quality and ultra-fast delivery. 100% genuine product!",
      verified: true
    },
    {
      id: 2,
      name: language === "bn" ? "সাবরিনা রহমান" : "Sabrina Rahman",
      rating: 5,
      date: "1 week ago",
      comment: language === "bn"
        ? "প্যাকেজিং অনেক ভালো ছিল। ক্যাশ অন ডেলিভারিতে চেক করে মূল্য পরিশোধ করেছি।"
        : "Great packaging. Paid after verifying product via Cash on Delivery.",
      verified: true
    },
    {
      id: 3,
      name: language === "bn" ? "তানভীর হোসেন" : "Tanvir Hossain",
      rating: 4,
      date: "2 weeks ago",
      comment: language === "bn"
        ? "দাম অনুযায়ী পণ্যটি খুবই চমৎকার। বিল্ড কোয়ালিটি বেশ শক্তপোক্ত।"
        : "Great value for money. Build quality feels sturdy and premium.",
      verified: true
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-grow">
        {/* Breadcrumb Navigation Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1 font-medium">
            {t("home")}
          </Link>
          <span>/</span>
          <Link href="/#our-products" className="hover:text-primary transition-colors font-medium">
            {t("products")}
          </Link>
          <span>/</span>
          <span className="text-primary dark:text-primary-300 font-bold truncate max-w-[200px] sm:max-w-none">
            {localized.name}
          </span>
        </nav>

        {/* Product Hero Layout (45% Gallery / 55% Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300">

          {/* LEFT COLUMN: Premium Gallery (45% = 5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Main Interactive Zoom Lens Box */}
            <div
              className="group/mainImg relative w-full aspect-[4/3] sm:aspect-square bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-900/60 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-center cursor-crosshair select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => setIsLightboxOpen(true)}
            >
              {/* Badge Overlays */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                {hasDiscount && (
                  <span className="bg-red-500 text-white backdrop-blur-md text-[11px] font-black tracking-wider px-3 py-1 rounded-full shadow-md">
                    -{formatNumber(product.discount)}% {t("off")}
                  </span>
                )}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold backdrop-blur-md border ${!inStock
                    ? "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    : isLowStock
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${!inStock ? "bg-slate-400" : isLowStock ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse"
                      }`}
                  />
                  <span>{!inStock ? t("outOfStock") : isLowStock ? t("onlyLeft", { count: product.stock }) : t("inStock")}</span>
                </div>
              </div>

              {/* Top Right Action Overlay (Share, Wishlist & Expand) */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWishlisted(!isWishlisted);
                    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                  }}
                  className={`p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-sm backdrop-blur-md hover:scale-110 active:scale-95 transition cursor-pointer ${isWishlisted ? "text-red-500" : "text-slate-600 dark:text-slate-300 hover:text-red-500"
                    }`}
                  title="Wishlist"
                >
                  <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-2.5 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-primary rounded-full shadow-sm backdrop-blur-md hover:scale-110 active:scale-95 transition cursor-pointer"
                  title={t("shareProduct")}
                >
                  <Share2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="p-2.5 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-primary rounded-full shadow-sm backdrop-blur-md hover:scale-110 active:scale-95 transition cursor-pointer"
                  title={t("zoomHint")}
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* Main Image View */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMainImage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <SafeImage
                    alt={localized.name}
                    src={currentMainImage}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                    className="object-cover group-hover/mainImg:scale-105 transition-transform duration-300 ease-out"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Hover Lens Magnifier Layer */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl bg-no-repeat z-10 opacity-0 group-hover/mainImg:opacity-100 transition-opacity duration-200"
                style={zoomStyle}
              />

              {/* Click to Zoom Hint Overlay */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-slate-950/70 text-white backdrop-blur-md text-[10px] font-bold rounded-full pointer-events-none opacity-0 group-hover/mainImg:opacity-100 transition-opacity">
                {t("zoomHint")}
              </div>
            </div>

            {/* Thumbnail Selectors Strip */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((imgUrl, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-200 border-2 ${isActive
                        ? "border-primary shadow-lg ring-2 ring-primary/20 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-100"
                        }`}
                    >
                      <SafeImage alt={`${localized.name} thumbnail ${idx + 1}`} src={imgUrl} fill className="object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Info & Actions (55% = 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between text-left space-y-6">
            <div>
              {/* Category Pill & Brand Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {localized.category}
                </span>

                <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  <span>{t("brandLabel")}: <strong className="text-slate-700 dark:text-slate-300">{t("officialBrand")}</strong></span>
                  <span>•</span>
                  <span>{t("skuLabel")}: <strong className="text-slate-700 dark:text-slate-300">{skuString}</strong></span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                {localized.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center space-x-3 mb-6 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/60 w-fit">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 dark:fill-slate-700 text-slate-300 dark:text-slate-700"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {formatNumber((product.rating || 5).toFixed(1))}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  ({formatNumber(124)} {t("reviews")})
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                  ✓ {t("verifiedPurchase")}
                </span>
              </div>

              {/* Price & Savings Display */}
              <div className="flex flex-wrap items-baseline gap-4 mb-6 p-4 bg-slate-50/70 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                  {formatPrice(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through font-semibold">
                    {formatPrice(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-extrabold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2.5 py-1 rounded-lg">
                    Save {formatPrice(product.price - discountedPrice)}
                  </span>
                )}
              </div>

              {/* Responsive Typography Description */}
              <div className="mb-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  {t("productInfo")}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  {localized.description}
                </p>
              </div>


            </div>

            {/* Actions Block: Quantity & Order Buttons */}
            {inStock ? (
              <div className="space-y-6 pt-2">
                {/* Quantity Control Row */}
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    {t("quantity")}:
                  </span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-sm font-extrabold text-slate-900 dark:text-white select-none">
                      {formatNumber(quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Confirm Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Buy Now Button (Primary Gradient) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    className="flex-1 py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag size={18} />
                    <span>{t("buyNow")}</span>
                  </motion.button>

                  {/* Add to Cart Button (Secondary Outline/Glass) */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={`flex-1 py-4 px-6 font-extrabold text-sm rounded-2xl border flex items-center justify-center space-x-2 transition-all cursor-pointer ${isAddedToCart
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                  >
                    {isAddedToCart ? <CheckCircle2 size={18} /> : <ShoppingCart size={18} />}
                    <span>{isAddedToCart ? t("added") : t("addToCart")}</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-center space-y-1">
                <h4 className="font-extrabold text-sm">{t("outOfStockTitle")}</h4>
                <p className="text-xs text-red-500 dark:text-red-400">{t("outOfStockDesc")}</p>
              </div>
            )}

            {/* Trust Badges Footer Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center">
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50/50 dark:bg-slate-850/40 border border-blue-300">
                  <Lock size={16} className="text-primary mb-1" />
                  <span>{t("trustSecureCheckout")}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50/50 dark:bg-slate-850/40 border border-blue-300">
                  <Truck size={16} className="text-blue-500 mb-1" />
                  <span>{t("trustFastDelivery")}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50/50 dark:bg-slate-850/40 border border-blue-300">
                  <CreditCard size={16} className="text-emerald-500 mb-1" />
                  <span>{t("trustCashOnDelivery")}</span>
                </div>

              </div>
            </div>
          </div>
        </div>




        {/* RELATED PRODUCTS SHELF */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 md:mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("relatedProducts")}
              </h2>
              <Link href="/#our-products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProd) => {
                const relLocalized = getLocalizedProduct(relProd);
                return (
                  <motion.div
                    key={relProd._id}
                    whileHover={{ y: -4 }}
                    className="group bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between text-left"
                  >
                    <Link href={`/products/${relProd._id}`} className="block relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                      <SafeImage alt={relLocalized.name} src={relProd.images?.[0] || "/placeholder.png"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                    <div>
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">{relLocalized.category}</span>
                      <Link href={`/products/${relProd._id}`}>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate hover:text-primary transition mt-1">
                          {relLocalized.name}
                        </h4>
                      </Link>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {relLocalized.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{formatPrice(relProd.price)}</span>
                      <Link href={`/products/${relProd._id}`} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition">
                        View
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* RECENTLY VIEWED SHELF */}
        {recentlyViewed.length > 0 && (
          <section className="mt-12 md:mt-16 mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              {t("recentlyViewed")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyViewed.map((recProd) => {
                const recLocalized = getLocalizedProduct(recProd);
                return (
                  <motion.div
                    key={recProd._id}
                    whileHover={{ y: -4 }}
                    className="group bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between text-left"
                  >
                    <Link href={`/products/${recProd._id}`} className="block relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                      <SafeImage alt={recLocalized.name} src={recProd.images?.[0] || "/placeholder.png"} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                    <div>
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">{recLocalized.category}</span>
                      <Link href={`/products/${recProd._id}`}>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate hover:text-primary transition mt-1">
                          {recLocalized.name}
                        </h4>
                      </Link>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{formatPrice(recProd.price)}</span>
                      <Link href={`/products/${recProd._id}`} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition">
                        View
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition cursor-pointer z-10"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {/* Previous Image Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition cursor-pointer z-10"
                aria-label="Previous Image"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage alt={localized.name} src={currentMainImage} fill className="object-contain" priority />
            </motion.div>

            {/* Next Image Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition cursor-pointer z-10"
                aria-label="Next Image"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY MOBILE BUY NOW BAR */}
      {inStock && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block leading-none">Total</span>
            <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              {formatPrice(discountedPrice * quantity)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              <ShoppingCart size={18} />
            </button>

            <button
              onClick={handleBuyNow}
              className="px-6 py-3 bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>{t("buyNow")}</span>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <React.Suspense fallback={<ProductSkeleton />}>
      <ProductDetailsContent />
    </React.Suspense>
  );
}
