/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Mail,
  Lock,
  Eye,
  EyeOff,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

function LoginContent() {
  const { login, user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [submitting, setSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);

  const redirectUrl = searchParams.get("redirect") || "/";

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        const target = (redirectUrl.startsWith("/admin") || redirectUrl.startsWith("/dashboard")) ? redirectUrl : "/dashboard";
        window.location.href = target;
      } else {
        const target = (redirectUrl.startsWith("/admin") || redirectUrl.startsWith("/dashboard")) ? "/" : redirectUrl;
        window.location.href = target;
      }
    }
  }, [user, loading, redirectUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await login(data.email, data.password);
    } catch {
      // Error handled in auth context toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.success("Redirecting to Google authentication...");
  };

  const handleForgotPassword = () => {
    toast.success("Password reset instructions sent if email exists.");
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
            {/* <div className=" bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25 mb-4 group-hover:scale-105 transition-transform">

            </div> */}

            <Link href="/" className="flex justify-center">
              <Image
                src="/images/logo.jpg"
                alt="SmartMart Logo"
                width={180}
                height={60}
                priority
                className="h-25 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("welcomeBack")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed font-medium">
              {t("loginSubtitle")}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left" noValidate>

            {/* Email Field */}
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
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-slate-200 dark:border-slate-800 focus:border-primary"
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("passwordLabel")} <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-extrabold text-primary hover:underline cursor-pointer"
                >
                  {t("forgotPassword")}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={submitting}
                  placeholder={t("passwordPlaceholder")}
                  {...register("password")}
                  className={`w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.password
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-slate-200 dark:border-slate-800 focus:border-primary"
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
              {errors.password && (
                <p className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary/50 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-300 select-none cursor-pointer">
                {t("rememberMe")}
              </label>
            </div>

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
                  <span>{t("submittingSignIn")}</span>
                </>
              ) : (
                <>
                  <span>{t("signInBtn")}</span>
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

          {/* Social Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
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

          {/* Registration Link Switch */}
          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            {t("dontHaveAccount")}{" "}
            <Link href="/register" className="text-primary font-black hover:underline ml-1">
              {t("signUpBtn")}
            </Link>
          </div>

          {/* Footer Security Badge */}
          {/* <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold">
            <LockKeyhole size={13} className="text-emerald-500" />
            <span>256-Bit SSL Encrypted & Secure</span>
          </div> */}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
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
      <LoginContent />
    </React.Suspense>
  );
}
