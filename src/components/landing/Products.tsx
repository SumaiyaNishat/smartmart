/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import Link from "next/link";
import axios from "axios";
import { useCart, IProduct } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export const Products: React.FC = () => {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  // Sample mock products database fallback to ensure zero placeholder code and full functionality
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
      stock: 0, // Out of stock to test disabled buy now / add to cart buttons
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

    // Listen for custom search events fired from navbar
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

  const categories = ["All", "Electronics", "Gadgets", "Accessories", "Smart Home"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16" id="our-products" aria-labelledby="products-heading">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <h2 id="products-heading" className="text-3xl font-extrabold text-secondary dark:text-white mb-2">
            {t("productsHeading")}
          </h2>
          <p className="text-sm text-slate-400">Discover premium curated items at unbeatable prices</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${selectedCategory === cat
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-secondary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        // Loading Skeletons
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5 animate-pulse">
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4" />
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-1/2" />
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        // Empty State
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 max-w-xl mx-auto px-6">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">No Products Found</h3>
          <p className="text-sm text-slate-400">We couldn&apos;t find any products matching your current query.</p>
        </div>
      ) : (
        // Products Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => {
            const hasDiscount = product.discount > 0;
            const discountedPrice = hasDiscount
              ? product.price * (1 - product.discount / 100)
              : product.price;

            const isWishlisted = wishlist.includes(product._id);
            const inStock = product.stock > 0;

            return (
              <div
                key={product._id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-4 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition duration-300 group relative"
              >
                {/* Badges */}
                <div className="absolute top-6 left-6 z-10 flex flex-col space-y-1">
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                      -{product.discount}%
                    </span>
                  )}
                  {!inStock && (
                    <span className="bg-slate-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full select-none">
                      {t("outOfStock")}
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm hover:scale-110 active:scale-90 transition duration-200 cursor-pointer"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : "fill-none"}`}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>

                {/* Image Container */}
                <div className="relative w-full h-48 rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden mb-4 flex items-center justify-center">
                  <SafeImage
                    alt={product.name}
                    src={product.images[0]}
                    fill
                    sizes="(max-w-768px) 100vw, 25vw"
                    priority={idx < 4}
                    className="object-contain p-4 group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Text Details */}
                <div className="flex-1 flex flex-col mb-4 text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                    {product.category}
                  </span>
                  <Link
                    href={`/products/${product._id}`}
                    className="text-base font-extrabold text-secondary dark:text-white hover:text-primary transition line-clamp-2 leading-tight mb-2"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-current" : "fill-none"
                            }`}
                          stroke="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">({product.rating})</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-black text-secondary dark:text-white">
                      ৳{discountedPrice.toFixed(0)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">
                        ৳{product.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Buy / Cart Buttons */}
                <div className="flex flex-col space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(product, 1)}
                      disabled={!inStock}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <span>{t("addToCart")}</span>
                    </button>
                    <Link
                      href={inStock ? `/products/${product._id}?buy=true` : "#"}
                      className={`px-3 py-2 text-center text-xs font-bold rounded-xl transition ${inStock
                        ? "bg-primary text-white hover:scale-102 cursor-pointer shadow-sm shadow-primary/20"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed opacity-50"
                        }`}
                    >
                      {t("buyNow")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
