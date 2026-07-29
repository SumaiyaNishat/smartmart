"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Building,
  Truck,
  ShieldCheck,
  Lock,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Package,
  RotateCcw,
} from "lucide-react";

const mockProducts = [
  {
    _id: "65c1f0f29c426639bca0b001",
    name: "প্লাগ ইন কুরাআন",
    nameEn: "Plug In Quran Speaker",
    description: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    descriptionEn: "Experience premium sound quality with active hybrid noise cancelling engineering.",
    price: 4990,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784617606/066f9458-7f79-4470-8b93-26c83d58d9ec_jebfam.jpg",
    ],
    category: "Gadgets",
    categoryEn: "Gadgets",
    categoryBn: "গ্যাজেটস",
    stock: 12,
    discount: 10,
    featured: true,
    rating: 4.8,
  },
  {
    _id: "65c1f0f29c426639bca0b002",
    name: "Turbo Fan",
    nameEn: "Turbo Fan",
    description: "Track your health metrics, dynamic workouts, heart rate, and sleep analytics.",
    descriptionEn: "Track your health metrics, dynamic workouts, heart rate, and sleep analytics.",
    price: 3490,
    images: [
      "https://res.cloudinary.com/dv0ayrve0/image/upload/v1784626040/3f2b4b89-c533-4f89-9e36-414eddf5d070_uuloyy.jpg",
    ],
    category: "Electronics",
    categoryEn: "Electronics",
    categoryBn: "ইলেকট্রনিক্স",
    stock: 8,
    discount: 0,
    featured: true,
    rating: 4.6,
  },
];

type CheckoutInput = {
  customerName: string;
  phone: string;
  address: string;
  thana: string;
  district: string;
};

export default function CheckoutContent() {
  const { cartItems, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const { t, formatPrice, getLocalizedProduct } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode");
  const productId = searchParams.get("product");
  const quantityParam = searchParams.get("quantity");

  const isBuyNow = mode === "buyNow" && !!productId;

  const [buyNowProduct, setBuyNowProduct] = React.useState<any | null>(null);
  const [buyNowQuantity, setBuyNowQuantity] = React.useState<number>(1);
  const [buyNowLoading, setBuyNowLoading] = React.useState<boolean>(isBuyNow);
  const [submitting, setSubmitting] = React.useState(false);
  const [createdOrderIds, setCreatedOrderIds] = React.useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  // Dynamic i18n validation schema
  const checkoutSchema = React.useMemo(
    () =>
      z.object({
        customerName: z.string().min(2, t("valName")),
        phone: z
          .string()
          .regex(/^01[3-9]\d{8}$/, t("valPhone")),
        address: z.string().min(5, t("valAddress")),
        thana: z.string().min(2, t("valThana")),
        district: z.string().min(2, t("valDistrict")),
      }),
    [t]
  );

  // Fetch product data for Buy Now flow with dedicated loading state
  React.useEffect(() => {
    if (isBuyNow && productId) {
      setBuyNowLoading(true);
      const qty = quantityParam ? parseInt(quantityParam, 10) : 1;
      setBuyNowQuantity(isNaN(qty) || qty < 1 ? 1 : qty);

      const requestUrl = `/api/products/${productId}`;

      axios
        .get(requestUrl)
        .then((res) => {
          if (res.data?.product) {
            setBuyNowProduct(res.data.product);
          } else {
            const fallback = mockProducts.find((p) => p._id === productId);
            if (fallback) {
              setBuyNowProduct(fallback);
            } else {
              setBuyNowProduct(null);
              toast.error(t("productNotFound"));
            }
          }
        })
        .catch((err) => {
          console.error("Buy Now product fetch error:", err);
          const fallback = mockProducts.find((p) => p._id === productId);
          if (fallback) {
            setBuyNowProduct(fallback);
          } else {
            setBuyNowProduct(null);
            toast.error(t("productNotFound"));
          }
        })
        .finally(() => {
          setBuyNowLoading(false);
        });
    } else {
      setBuyNowLoading(false);
    }
  }, [isBuyNow, productId, quantityParam, t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.name || "",
      phone: user?.phone || "",
      address: "",
      thana: "",
      district: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      reset((prev) => ({
        ...prev,
        customerName: user.name || prev.customerName,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user, reset]);

  // Quantity control helper for Buy Now flow
  const handleBuyNowQtyChange = (delta: number) => {
    if (!buyNowProduct) return;
    const maxStock = buyNowProduct.stock > 0 ? buyNowProduct.stock : 99;
    setBuyNowQuantity((prev) => Math.min(Math.max(1, prev + delta), maxStock));
  };

  const handleBuyNowQtyInput = (val: string) => {
    if (!buyNowProduct) return;
    const num = parseInt(val, 10);
    const maxStock = buyNowProduct.stock > 0 ? buyNowProduct.stock : 99;
    if (isNaN(num) || num < 1) {
      setBuyNowQuantity(1);
    } else if (num > maxStock) {
      setBuyNowQuantity(maxStock);
      toast.error(t("inStockQuantity", { count: maxStock }));
    } else {
      setBuyNowQuantity(num);
    }
  };

  const onSubmit = async (data: CheckoutInput) => {
    const itemsToOrder = isBuyNow
      ? buyNowProduct
        ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
        : []
      : cartItems;

    if (itemsToOrder.length === 0) {
      toast.error(t("valNoProductSelected"));
      return;
    }

    setSubmitting(true);
    try {
      const orderIds: string[] = [];

      for (const item of itemsToOrder) {
        const discountedPrice = item.product.price * (1 - item.product.discount / 100);
        const itemTotal = discountedPrice * item.quantity;

        const response = await axios.post("/api/orders", {
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          thana: data.thana,
          district: data.district,
          productId: item.product._id,
          quantity: item.quantity,
          deliveryCharge: 0,
          totalPrice: itemTotal,
        });

        if (response.data?.order?._id) {
          orderIds.push(response.data.order._id);
        }
      }

      toast.success(t("orderSuccessTitle"));
      setCreatedOrderIds(orderIds);
      if (!isBuyNow) {
        clearCart();
      }
      setShowSuccessModal(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(t("valOrderFailed"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const itemsToOrder = isBuyNow
    ? buyNowProduct
      ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
      : []
    : cartItems;

  // Real-time calculated price metrics
  const calculatedMetrics = React.useMemo(() => {
    let rawSubtotal = 0;
    let totalDiscountSavings = 0;
    let finalPayable = 0;

    itemsToOrder.forEach((item) => {
      const originalItemTotal = item.product.price * item.quantity;
      const discountedUnitPrice = item.product.price * (1 - item.product.discount / 100);
      const discountedItemTotal = discountedUnitPrice * item.quantity;

      rawSubtotal += originalItemTotal;
      totalDiscountSavings += originalItemTotal - discountedItemTotal;
      finalPayable += discountedItemTotal;
    });

    return {
      rawSubtotal,
      totalDiscountSavings,
      finalPayable,
    };
  }, [itemsToOrder]);

  const showEmptyState = isBuyNow ? !buyNowProduct : cartItems.length === 0;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 2 && document.referrer) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/20">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-grow max-w-6xl">
        <AnimatePresence mode="wait">
          {buyNowLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CheckoutSkeleton />
            </motion.div>
          ) : showEmptyState && !showSuccessModal ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center max-w-md mx-auto my-12 shadow-2xl"
            >
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <ShoppingBag size={40} className="text-primary animate-bounce" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                {isBuyNow ? t("productNotFound") : t("cartEmptyTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                {isBuyNow ? t("productNotFoundDesc") : t("cartEmptyDescription")}
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/")}
                className="w-full py-4 text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 rounded-xl cursor-pointer"
              >
                {t("continueShopping")}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Header Badge & Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full transition cursor-pointer"
                    >
                      <ArrowRight size={12} className="rotate-180" />
                      <span>{t("backToPrevious")}</span>
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full">
                      <Lock size={12} />
                      <span>{t("secureCheckout")}</span>
                    </div>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t("orderConfirmation")}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t("enterDeliveryInfo")}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{t("cashOnDelivery")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>{t("fastDelivery")}</span>
                  </div>
                </div>
              </div>

              {/* Main Integrated Form wrapping Grid */}
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column - Redesigned Customer Details Form */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none text-left space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                      <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <span>{t("yourInfoAddress")}</span>
                      </h3>
                      <span className="text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-900/50">
                        {t("cashOnDelivery")}
                      </span>
                    </div>

                    <div className="space-y-5">
                      {/* Customer Name */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <User size={14} className="text-slate-400" />
                          <span>{t("customerNameLabel")}</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={t("customerNamePlaceholder")}
                            {...register("customerName")}
                            className={`w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-950 border ${errors.customerName
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                              } rounded-xl focus:outline-none focus:ring-4 text-sm text-slate-900 dark:text-white font-medium transition-all`}
                          />
                        </div>
                        {errors.customerName ? (
                          <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.customerName.message}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            {t("customerNameHelper")}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <Phone size={14} className="text-slate-400" />
                          <span>{t("phoneLabel")}</span>
                        </label>
                        <input
                          type="text"
                          placeholder={t("phonePlaceholder")}
                          {...register("phone")}
                          className={`w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-950 border ${errors.phone
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                            } rounded-xl focus:outline-none focus:ring-4 text-sm text-slate-900 dark:text-white font-medium transition-all`}
                        />
                        {errors.phone ? (
                          <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.phone.message}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            {t("phoneHelper")}
                          </p>
                        )}
                      </div>

                      {/* District & Upazila Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <Building size={14} className="text-slate-400" />
                            <span>{t("districtLabel")}</span>
                          </label>
                          <input
                            type="text"
                            placeholder={t("districtPlaceholder")}
                            {...register("district")}
                            className={`w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-950 border ${errors.district
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                              } rounded-xl focus:outline-none focus:ring-4 text-sm text-slate-900 dark:text-white font-medium transition-all`}
                          />
                          {errors.district && (
                            <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.district.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                            <MapPin size={14} className="text-slate-400" />
                            <span>{t("thanaLabel")}</span>
                          </label>
                          <input
                            type="text"
                            placeholder={t("thanaPlaceholder")}
                            {...register("thana")}
                            className={`w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-950 border ${errors.thana
                              ? "border-red-500 focus:ring-red-500/20"
                              : "border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                              } rounded-xl focus:outline-none focus:ring-4 text-sm text-slate-900 dark:text-white font-medium transition-all`}
                          />
                          {errors.thana && (
                            <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                              <AlertCircle size={12} />
                              {errors.thana.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400" />
                          <span>{t("addressLabel")}</span>
                        </label>
                        <textarea
                          placeholder={t("addressPlaceholder")}
                          rows={3}
                          {...register("address")}
                          className={`w-full px-4 py-3.5 bg-slate-50/80 dark:bg-slate-950 border ${errors.address
                            ? "border-red-500 focus:ring-red-500/20"
                            : "border-slate-200 dark:border-slate-800 focus:border-primary focus:ring-primary/20"
                            } rounded-xl focus:outline-none focus:ring-4 text-sm text-slate-900 dark:text-white font-medium resize-none transition-all`}
                        />
                        {errors.address ? (
                          <p className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1">
                            <AlertCircle size={12} />
                            {errors.address.message}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                            {t("addressHelper")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Redesigned Sticky Order Summary Card with Integrated Submit Button & Trust Indicators */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none text-left sticky top-24 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                      <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        <span>{t("productInfo")}</span>
                      </h3>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-900/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t("inStock")}
                      </span>
                    </div>

                    {/* Product List / Items with Enlarged Image & Clear Badges */}
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800">
                      {itemsToOrder.map((item) => {
                        const localized = getLocalizedProduct(item.product);
                        const originalUnitPrice = item.product.price;
                        const discountedUnitPrice = originalUnitPrice * (1 - item.product.discount / 100);
                        const hasDiscount = item.product.discount > 0;
                        const maxStock = item.product.stock > 0 ? item.product.stock : 99;

                        return (
                          <div key={item.product._id} className="pt-4 first:pt-0 space-y-4">
                            <div className="flex gap-4 items-start">
                              {/* Larger Image Box */}
                              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-sm">
                                <SafeImage
                                  src={item.product.images?.[0]}
                                  alt={localized.name || item.product.name}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <div className="flex-grow min-w-0 space-y-1">
                                <p className="font-black text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2">
                                  {localized.name || item.product.name}
                                </p>
                                {localized.category && (
                                  <span className="inline-block text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    {localized.category}
                                  </span>
                                )}
                                <div className="flex items-center gap-2 pt-0.5">
                                  <span className="text-base font-black text-primary">
                                    {formatPrice(discountedUnitPrice)}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-xs text-slate-400 line-through">
                                      {formatPrice(originalUnitPrice)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Improved Quantity Selector */}
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-300 dark:border-slate-800">
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 pl-2">
                                {t("quantity")}:
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={item.quantity <= 1}
                                  onClick={() => {
                                    if (isBuyNow) {
                                      handleBuyNowQtyChange(-1);
                                    } else {
                                      updateQuantity(item.product._id, Math.max(1, item.quantity - 1));
                                    }
                                  }}
                                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-xs active:scale-95"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>

                                <input
                                  type="number"
                                  min={1}
                                  max={maxStock}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    if (isBuyNow) {
                                      handleBuyNowQtyInput(e.target.value);
                                    } else {
                                      const num = parseInt(e.target.value, 10);
                                      if (!isNaN(num) && num >= 1) {
                                        updateQuantity(item.product._id, Math.min(num, maxStock));
                                      }
                                    }
                                  }}
                                  className="w-12 text-center bg-transparent text-sm font-black text-slate-900 dark:text-white focus:outline-none"
                                />

                                <button
                                  type="button"
                                  disabled={item.quantity >= maxStock}
                                  onClick={() => {
                                    if (isBuyNow) {
                                      handleBuyNowQtyChange(1);
                                    } else {
                                      updateQuantity(item.product._id, item.quantity + 1);
                                    }
                                  }}
                                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer shadow-xs active:scale-95"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <div className="flex justify-between">
                        <span>{t("originalSubtotal")}</span>
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {formatPrice(calculatedMetrics.rawSubtotal)}
                        </span>
                      </div>

                      {calculatedMetrics.totalDiscountSavings > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Sparkles size={12} />
                            {t("discountSavings")}
                          </span>
                          <span>-{formatPrice(calculatedMetrics.totalDiscountSavings)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span>{t("shipping")}</span>
                        <span className="text-xs font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                          {t("freeDelivery")}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span>{t("totalPayable")}</span>
                        <span className="text-2xl text-primary font-black">
                          {formatPrice(calculatedMetrics.finalPayable)}
                        </span>
                      </div>
                    </div>

                    {/* Primary "Place Order" Button Moved to Order Summary Card */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary w-full py-4 text-center justify-center font-black text-base cursor-pointer shadow-xl shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all rounded-2xl flex items-center gap-2"
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t("processingOrder")}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <ShoppingBag size={18} />
                            <span>{t("placeOrder")}</span>
                            <ArrowRight size={16} />
                          </span>
                        )}
                      </Button>
                    </div>

                    {/* Premium Trust Indicators Grid directly below the Place Order Button */}
                    {/* <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{t("trustSecureCheckout")}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{t("trustCashOnDelivery")}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{t("trustFastDelivery")}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl">
                        <RotateCcw className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>{t("trustEasyReturns")}</span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Sticky Mobile Place Order Bar */}
      {!buyNowLoading && !showEmptyState && !showSuccessModal && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                {t("grandTotal")}
              </span>
              <span className="text-xl font-black text-primary">
                {formatPrice(calculatedMetrics.finalPayable)}
              </span>
            </div>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              className="btn btn-primary py-3.5 px-6 font-black text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/30"
            >
              {submitting ? (
                <span>{t("processingOrder")}</span>
              ) : (
                <>
                  <span>{t("placeOrder")}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md animate-fadeIn p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full text-center shadow-2xl space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={48} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {t("orderSuccessTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                {t("orderSuccessDesc")}
              </p>
            </div>

            {createdOrderIds.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  {t("orderNumber")}
                </span>
                <p className="font-mono text-sm font-bold text-primary dark:text-orange-400 break-all">
                  {createdOrderIds.join(", ")}
                </p>
              </div>
            )}

            <Button
              variant="primary"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="w-full py-3.5 text-sm font-bold shadow-md cursor-pointer rounded-xl"
            >
              {t("continueShopping")}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

{/* Premium Shimmer Skeleton Loader Component */ }
function CheckoutSkeleton() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse mb-3" />
          <div className="h-8 w-56 sm:w-72 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-64 sm:w-80 bg-slate-100 dark:bg-slate-800/60 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Grid Skeleton matching exact Checkout layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Form Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="h-6 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800/60 rounded-full animate-pulse" />
            </div>

            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              </div>

              {/* Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
                </div>
                <div>
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* District & Thana Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
                </div>
                <div>
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                <div className="h-20 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Skeleton */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="h-6 w-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full animate-pulse" />
            </div>

            {/* Product item row */}
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl flex-shrink-0 animate-pulse" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
                </div>
                <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded animate-pulse flex-shrink-0" />
              </div>

              {/* Quantity selector skeleton */}
              <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
                <div className="h-4 w-20 bg-emerald-200/60 dark:bg-emerald-950/60 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-7 w-28 bg-primary/25 dark:bg-primary/40 rounded animate-pulse" />
              </div>
            </div>

            {/* Place order button skeleton */}
            <div className="pt-2">
              <div className="h-14 w-full bg-primary/25 dark:bg-primary/35 rounded-2xl animate-pulse" />
            </div>

            {/* Trust indicators skeleton */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
