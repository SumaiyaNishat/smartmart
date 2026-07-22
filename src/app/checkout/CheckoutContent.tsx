"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "react-hot-toast";
import { CheckCircle2, ShoppingBag } from "lucide-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "আপনার পুরো নাম লিখুন (কমপক্ষে ২ অক্ষর)"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)"),
  optionalPhone: z.string().optional(),
  address: z.string().min(5, "বাসা নং, রোড নং, এলাকা সম্বলিত সম্পূর্ণ ঠিকানা লিখুন"),
  thana: z.string().min(2, "উপজেলা বা থানা লিখুন"),
  district: z.string().min(2, "জেলার নাম লিখুন"),
  orderNote: z.string().optional(),
});

const mockProducts = [
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

type CheckoutInput = z.infer<typeof checkoutSchema>;

export default function CheckoutContent() {
  const { cartItems, grandTotal, clearCart } = useCart();
  const { user } = useAuth();
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

  React.useEffect(() => {
    if (isBuyNow && productId) {
      setBuyNowLoading(true);
      const qty = quantityParam ? parseInt(quantityParam, 10) : 1;
      setBuyNowQuantity(isNaN(qty) ? 1 : qty);

      const requestUrl = `/api/products/${productId}`;
      console.log("Mode:", mode);
      console.log("Product ID:", productId);
      console.log("Quantity:", quantityParam);
      console.log("Request URL:", requestUrl);

      axios.get(requestUrl)
        .then((res) => {
          if (res.data?.product) {
            setBuyNowProduct(res.data.product);
          } else {
            const fallback = mockProducts.find((p) => p._id === productId);
            if (fallback) {
              setBuyNowProduct(fallback);
            } else {
              toast.error("পণ্যটি খুঁজে পাওয়া যায়নি");
            }
          }
        })
        .catch((err) => {
          if (axios.isAxiosError(err)) {
            console.error("Buy Now product fetch error status:", err.response?.status);
            console.error("Buy Now product fetch error data:", err.response?.data);
            console.error("Buy Now product fetch error config URL:", err.config?.url);
          } else {
            console.error("Buy Now product fetch error:", err);
          }
          const fallback = mockProducts.find((p) => p._id === productId);
          if (fallback) {
            setBuyNowProduct(fallback);
          } else {
            toast.error("পণ্য লোড করতে সমস্যা হয়েছে");
          }
        })
        .finally(() => {
          setBuyNowLoading(false);
        });
    }
  }, [isBuyNow, productId, quantityParam]);

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
      optionalPhone: "",
      address: "",
      thana: "",
      district: "",
      orderNote: "",
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

  const onSubmit = async (data: CheckoutInput) => {
    const itemsToOrder = isBuyNow
      ? (buyNowProduct ? [{ product: buyNowProduct, quantity: buyNowQuantity }] : [])
      : cartItems;

    if (itemsToOrder.length === 0) {
      toast.error("কোনো পণ্য নির্বাচন করা হয়নি।");
      return;
    }

    setSubmitting(true);
    try {
      const orderIds: string[] = [];

      // Place order for each item
      for (const item of itemsToOrder) {
        const discountedPrice = item.product.price * (1 - item.product.discount / 100);
        const itemTotal = discountedPrice * item.quantity;

        const response = await axios.post("/api/orders", {
          customerName: data.customerName,
          phone: data.phone,
          optionalPhone: data.optionalPhone || "",
          address: data.address,
          thana: data.thana,
          district: data.district,
          orderNote: data.orderNote || "",
          productId: item.product._id,
          quantity: item.quantity,
          deliveryCharge: 0,
          totalPrice: itemTotal,
        });

        if (response.data?.order?._id) {
          orderIds.push(response.data.order._id);
        }
      }

      toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
      setCreatedOrderIds(orderIds);
      if (!isBuyNow) {
        clearCart();
      }
      setShowSuccessModal(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const itemsToOrder = isBuyNow
    ? (buyNowProduct ? [{ product: buyNowProduct, quantity: buyNowQuantity }] : [])
    : cartItems;

  const buyNowPrice = buyNowProduct ? buyNowProduct.price * (1 - buyNowProduct.discount / 100) : 0;
  const buyNowTotal = buyNowPrice * buyNowQuantity;
  const totalAmount = isBuyNow ? buyNowTotal : grandTotal;
  const showEmptyState = isBuyNow ? !buyNowProduct : cartItems.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-bg-light dark:bg-slate-950">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-grow max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary dark:text-white">
              চেকআউট
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              অর্ডারটি সম্পন্ন করতে আপনার ডেলিভারি তথ্য প্রদান করুন
            </p>
          </div>
        </div>

        {showEmptyState && !showSuccessModal ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
              {isBuyNow ? "পণ্যটি পাওয়া যায়নি" : "আপনার কার্ট খালি"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {isBuyNow ? "অনুগ্রহ করে পণ্য নির্বাচন করুন।" : "চেকআউট করতে আপনার কার্টে কোনো পণ্য যোগ করেননি।"}
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push("/")}
              className="px-8 py-3"
            >
              কেনাকাটা চালিয়ে যান
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 shadow-sm text-left">
                <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <span>আপনার তথ্য</span>
                  <span className="text-xs text-orange-500 font-normal">(ক্যাশ অন ডেলিভারি)</span>
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      নাম *
                    </label>
                    <input
                      type="text"
                      placeholder="আপনার নাম লিখুন"
                      {...register("customerName")}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.customerName.message}</p>
                    )}
                  </div>

                  {/* Phone & Optional Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        মোবাইল নম্বর *
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: 017XXXXXXXX"
                        {...register("phone")}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        বিকল্প মোবাইল (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        placeholder="অন্য কোনো মোবাইল নম্বর"
                        {...register("optionalPhone")}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                      />
                    </div> */}
                  </div>

                  {/* District & Upazila Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        जिला *
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: ঢাকা, চট্টগ্রাম"
                        {...register("district")}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                      />
                      {errors.district && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.district.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        উপজেলা / থানা *
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: ধানমন্ডি, গুলশান, সাভার"
                        {...register("thana")}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                      />
                      {errors.thana && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.thana.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      সম্পূর্ণ ঠিকানা *
                    </label>
                    <textarea
                      placeholder="বাসা নং, রোড নং, এলাকা বা গ্রাম..."
                      rows={2}
                      {...register("address")}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white resize-none"
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.address.message}</p>
                    )}
                  </div>

                  {/* Order Note */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      অর্ডার নোট (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="ডেলিভারি সংক্রান্ত বিশেষ কোনো বার্তা থাকলে লিখুন"
                      {...register("orderNote")}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      variant="secondary"
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 text-center justify-center font-bold text-base cursor-pointer shadow-lg hover:opacity-95 transition"
                    >
                      {submitting ? "অর্ডার প্রক্রিয়াধীন..." : "অর্ডার নিশ্চিত করুন"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Product Summary Column */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 shadow-sm text-left sticky top-24">
                <h3 className="font-extrabold text-lg text-secondary dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
                  পণ্যের তথ্য
                </h3>

                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 mb-6 divide-y divide-slate-100 dark:divide-slate-800">
                  {itemsToOrder.map((item) => {
                    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
                    const itemTotal = discountedPrice * item.quantity;

                    return (
                      <div key={item.product._id} className="pt-3 first:pt-0 flex items-center gap-3">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex-shrink-0 relative">
                          <SafeImage
                            src={item.product.images?.[0]}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </p>
                          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span>পরিমাণ: <strong className="text-slate-800 dark:text-slate-200">{item.quantity}</strong></span>
                            <span>একক মূল্য: ৳{discountedPrice.toFixed(0)}</span>
                          </div>
                        </div>
                        <div className="text-right font-black text-sm text-slate-900 dark:text-white flex-shrink-0">
                          ৳{itemTotal.toFixed(0)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex justify-between">
                    <span>মোট মূল্য (সাবটোটাল)</span>
                    <span className="font-bold text-slate-900 dark:text-white">৳{totalAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="text-emerald-500 font-bold">ফ্রি (Free Delivery)</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>সর্বমোট</span>
                    <span className="text-xl text-primary font-black">৳{totalAmount.toFixed(0)}</span>
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-3.5 text-center text-xs text-amber-800 dark:text-amber-300">
                  ⚡ ক্যাশ অন ডেলিভারি: পণ্য হাতে পেয়ে মুল্য পরিশোধ করুন।
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Bangla Order Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-fadeIn p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 max-w-md w-full text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={48} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                অর্ডার সফল হয়েছে
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                ধন্যবাদ। খুব দ্রুত আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবে।
              </p>
            </div>

            {createdOrderIds.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">অর্ডার নম্বর</span>
                <p className="font-mono text-sm font-bold text-primary dark:text-orange-400 break-all">
                  {createdOrderIds.join(", ")}
                </p>
              </div>
            )}

            <Button
              variant="secondary"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="w-full py-3.5 text-sm font-bold shadow-md cursor-pointer"
            >
              কেনাকাটা চালিয়ে যান
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
