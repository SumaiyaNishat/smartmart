/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
  X
} from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(11, "Phone number must be at least 11 digits").max(14, "Phone number too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  agreeTerms: z.boolean().refine((val) => val === true, "You must agree to the Terms & Conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

function RegisterContent() {
  const { register: registerUser, user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [submitting, setSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeTerms: true,
    }
  });

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  // Password Strength Calculator
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[a-zA-Z]/.test(pass) && /[^a-zA-Z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = calculateStrength(passwordValue);

  const getStrengthLabel = (score: number) => {
    if (score <= 1) return t("strengthWeak");
    if (score <= 3) return t("strengthFair");
    return t("strengthStrong");
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return "bg-red-500";
    if (score <= 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const onSubmit = async (data: RegisterInput) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const success = await registerUser(data.name, data.email, data.password, data.phone);
      if (success) {
        toast.success("Account created successfully! Please sign in.");
        router.push("/login");
      }
    } catch {
      // Error handled in auth context toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = () => {
    toast.success("Redirecting to Google authentication...");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <Header />
        <div className="container mx-auto px-6 py-20 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
      {/* Soft Distraction-Free Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-20 flex-grow flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[460px] mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-700"
        >
          {/* Centered Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25 mb-4 group-hover:scale-105 transition-transform">
              <Sparkles size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("createAccountTitle")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed font-medium">
              {t("registerSubtitle")}
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t("fullNameLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  disabled={submitting}
                  placeholder={t("fullNamePlaceholder")}
                  {...register("name")}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.name ? "border-red-500 focus:ring-red-500/50" : "border-slate-200 dark:border-slate-800 focus:border-primary"
                    }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t("emailLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  disabled={submitting}
                  placeholder={t("emailPlaceholder")}
                  {...register("email")}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? "border-red-500 focus:ring-red-500/50" : "border-slate-200 dark:border-slate-800 focus:border-primary"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t("phoneLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  disabled={submitting}
                  placeholder={t("phonePlaceholder")}
                  {...register("phone")}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.phone ? "border-red-500 focus:ring-red-500/50" : "border-slate-200 dark:border-slate-800 focus:border-primary"
                    }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t("passwordLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={submitting}
                  placeholder={t("passwordPlaceholder")}
                  {...register("password")}
                  className={`w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.password ? "border-red-500 focus:ring-red-500/50" : "border-slate-200 dark:border-slate-800 focus:border-primary"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">Strength</span>
                    <span className={strengthScore <= 1 ? "text-red-500" : strengthScore <= 3 ? "text-amber-500" : "text-emerald-500"}>
                      {getStrengthLabel(strengthScore)}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strengthScore >= 1 ? getStrengthColor(strengthScore) : "bg-slate-200"}`} style={{ width: "25%" }} />
                    <div className={`h-full transition-all duration-300 ${strengthScore >= 2 ? getStrengthColor(strengthScore) : "bg-slate-200"}`} style={{ width: "25%" }} />
                    <div className={`h-full transition-all duration-300 ${strengthScore >= 3 ? getStrengthColor(strengthScore) : "bg-slate-200"}`} style={{ width: "25%" }} />
                    <div className={`h-full transition-all duration-300 ${strengthScore >= 4 ? getStrengthColor(strengthScore) : "bg-slate-200"}`} style={{ width: "25%" }} />
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t("confirmPasswordLabel")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={submitting}
                  placeholder={t("confirmPasswordPlaceholder")}
                  {...register("confirmPassword")}
                  className={`w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.confirmPassword ? "border-red-500 focus:ring-red-500/50" : "border-slate-200 dark:border-slate-800 focus:border-primary"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Match Live Status Indicator */}
              {confirmPasswordValue && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold">
                  {passwordValue === confirmPasswordValue ? (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <Check size={14} /> {t("passwordsMatch")}
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <X size={14} /> {t("passwordsDoNotMatch")}
                    </span>
                  )}
                </div>
              )}

              {errors.confirmPassword && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="agreeTerms"
                type="checkbox"
                {...register("agreeTerms")}
                className="mt-0.5 w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary/50 cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-300 select-none cursor-pointer leading-tight">
                {t("agreeTerms")}
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-[11px] font-bold text-red-500 mt-0.5">{errors.agreeTerms.message}</p>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{t("submittingSignUp")}</span>
                </>
              ) : (
                <>
                  <span>{t("signUpBtn")}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t("orContinueWith")}
            </span>
          </div>

          {/* Social Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t("continueWithGoogle")}</span>
          </button>

          {/* Login Link Switch */}
          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-primary font-black hover:underline ml-1">
              {t("signInBtn")}
            </Link>
          </div>


        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
          <Header />
          <div className="container mx-auto px-6 py-20 flex-grow flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
          <Footer />
        </div>
      }
    >
      <RegisterContent />
    </React.Suspense>
  );
}
