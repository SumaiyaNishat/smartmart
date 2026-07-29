/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import axios from "axios";
import { useCart, IProduct } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Heart, Star, Sparkles, Truck, Check, Eye } from "lucide-react";

export const Products: React.FC = () => {
  const { addToCart } = useCart();
  const { language, t, formatNumber, formatPrice, getLocalizedProduct } = useLanguage();

  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [wishlist, setWishlist] = React.useState<string[]>([]);
  const [addedItemMap, setAddedItemMap] = React.useState<Record<string, boolean>>({});

  // Sample mock products database fallback
  const mockProducts: IProduct[] = [
    {
      _id: "65c1f0f29c426639bca0b001",
      name: "প্লাগ ইন কুরাআন",
      description: "Experience premium sound quality with active hybrid noise cancelling engineering.",
      price: 4990,
      images: [
        "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg"
      ],
      category: "Electronics",
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
        "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784626040/3f2b4b89-c533-4f89-9e36-414eddf5d070_uuloyy.jpg",
      ],
      category: "Gadgets",
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
        "/placeholder.png",
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
        "/placeholder.png",
      ],
      category: "Smart Home",
      stock: 0,
      discount: 0,
      featured: false,
      rating: 4.3,
    },
  ];

  const fetchProducts = React.useCallback(async () => {
    try {
      const response = await axios.get("/api/products");
      if (response.data && response.data.products && response.data.products.length > 0) {
        setProducts(response.data.products);
      } else {
        setProducts(mockProducts);
      }
    } catch {
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    fetchProducts();

    const handleSearchEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchQuery(customEvent.detail || "");
    };

    window.addEventListener("smartmart-search", handleSearchEvent);
    return () => {
      window.removeEventListener("smartmart-search", handleSearchEvent);
    };
  }, [fetchProducts]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = (product: IProduct) => {
    addToCart(product, 1);
    setAddedItemMap((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const categories = [
    { key: "All", labelKey: "catAll" },
    { key: "Electronics", labelKey: "catElectronics" },
    { key: "Gadgets", labelKey: "catGadgets" },
    { key: "Accessories", labelKey: "catAccessories" },
    { key: "Smart Home", labelKey: "catSmartHome" },
  ];

  const filteredProducts = React.useMemo(() => {
    return products
      .filter((p) => {
        const localized = getLocalizedProduct(p);
        const matchesSearch =
          localized.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          localized.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          localized.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }, [products, searchQuery, selectedCategory, getLocalizedProduct]);

  return (
    <section className="py-16 md:py-24" id="our-products" aria-labelledby="products-heading">
      {/* Section Header & Industrial Category Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 id="products-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("productsHeading")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
            {t("productsSubheading")}
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-2xl">
          {categories.map((catObj) => {
            const isActive = selectedCategory === catObj.key;
            return (
              <button
                key={catObj.key}
                onClick={() => setSelectedCategory(catObj.key)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer select-none ${isActive
                  ? "text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-primary rounded-xl shadow-md shadow-primary/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{t(catObj.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        /* Shimmer Loading Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="shimmer-skeleton bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between h-[430px]"
            >
              <div>
                <div className="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mb-2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 mb-3" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-full mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3 mb-4" />
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Sleek Empty Search State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 max-w-xl mx-auto px-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">{t("noProductsFound")}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("noProductsDesc")}
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-6 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            {t("clearFilters")}
          </button>
        </motion.div>
      ) : (
        /* Fully Localized Industrial Product Grid */
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => {
              const localized = getLocalizedProduct(product);
              const hasDiscount = product.discount > 0;
              const discountedPrice = hasDiscount
                ? product.price * (1 - product.discount / 100)
                : product.price;

              const isWishlisted = wishlist.includes(product._id);
              const inStock = product.stock > 0;
              const isLowStock = inStock && product.stock <= 5;
              const isAdded = !!addedItemMap[product._id];

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -4 }}
                  key={product._id}
                  className="group relative flex flex-col justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out"
                >
                  <div>
                    {/* Image Area Link to Product Details */}
                    <Link
                      href={`/products/${product._id}`}
                      className="group/img relative block w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-slate-100/70 to-slate-100/30 dark:from-slate-800/70 dark:to-slate-900/40 overflow-hidden mb-4 border border-slate-100 dark:border-slate-800/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label={localized.name}
                    >
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                        {hasDiscount && (
                          <span className="bg-red-500/90 text-white backdrop-blur-md text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full shadow-sm select-none">
                            -{formatNumber(product.discount)}% {t("off")}
                          </span>
                        )}
                        {/* Stock Indicator Pill */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${!inStock
                            ? "bg-slate-500/10 dark:bg-slate-500/20 text-slate-500 border-slate-500/20"
                            : isLowStock
                              ? "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${!inStock
                              ? "bg-slate-400"
                              : isLowStock
                                ? "bg-amber-500 animate-pulse"
                                : "bg-emerald-500 animate-pulse"
                              }`}
                          />
                          <span>
                            {!inStock
                              ? t("outOfStock")
                              : isLowStock
                                ? t("onlyLeft", { count: product.stock })
                                : t("inStock")}
                          </span>
                        </div>
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        className="absolute top-3 right-3 z-30 p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-400 hover:text-red-500 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-300"
                            }`}
                        />
                      </button>

                      {/* Smooth Hover Overlay with View Details Badge */}
                      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center gap-2 text-white font-extrabold text-xs">
                        <Eye className="w-4 h-4 text-white" />
                        <span>{t("viewDetails")}</span>
                      </div>

                      {/* Main Image with Zoom Effect */}
                      <SafeImage
                        alt={localized.name}
                        src={product.images[0]}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={idx < 4}
                        className="object-cover group-hover/img:scale-105 transition-transform duration-300 ease-out"
                      />
                    </Link>

                    {/* Meta Details */}
                    <div className="flex flex-col text-left">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-black tracking-widest text-primary/80 dark:text-primary-300">
                          {localized.category}
                        </span>

                        {/* Star Rating Badge */}
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{formatNumber(product.rating.toFixed(1))}</span>
                        </div>
                      </div>

                      {/* Product Name Link */}
                      <Link
                        href={`/products/${product._id}`}
                        className="text-base font-extrabold text-slate-900 dark:text-white hover:text-primary dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-snug mb-1.5 cursor-pointer focus:outline-none focus:underline"
                      >
                        {localized.name}
                      </Link>

                      {/* Description */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {localized.description}
                      </p>

                      {/* Express Delivery Badge */}
                      {/* <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-4">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t("freeExpressDelivery")}</span>
                      </div> */}

                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                          {formatPrice(discountedPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through font-semibold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Industrial Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock}
                      className={`px-3 py-2.5 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${!inStock
                        ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                        : isAdded
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
                        }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{t("added")}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t("addToCart")}</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={inStock ? `/checkout?mode=buyNow&product=${product._id}&quantity=1` : "#"}
                      className={`px-3 py-2.5 text-center text-xs font-extrabold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 ${inStock
                        ? "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md shadow-primary/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60"
                        }`}
                    >
                      <span>{t("buyNow")}</span>
                      {inStock && <ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};
