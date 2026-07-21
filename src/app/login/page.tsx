"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

function LoginContent() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = React.useState(false);

  const redirectUrl = searchParams.get("redirect") || "/";

  React.useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        const target = (redirectUrl.startsWith("/admin") || redirectUrl.startsWith("/dashboard")) ? redirectUrl : "/dashboard";
        router.push(target);
      } else {
        const target = (redirectUrl.startsWith("/admin") || redirectUrl.startsWith("/dashboard")) ? "/" : redirectUrl;
        router.push(target);
      }
    }
  }, [user, loading, router, redirectUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setSubmitting(true);
    const success = await login(data.email, data.password);
    setSubmitting(false);
    if (success) {
      router.push(redirectUrl);
    }
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

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Header />

      <main className="container mx-auto px-6 py-16 flex-grow flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-sm max-w-md w-full text-left">
          <h2 className="text-2xl font-black text-secondary dark:text-white mb-2">Welcome Back</h2>
          <p className="text-xs text-slate-400 mb-6">Login to your account to track your orders and shop premium items.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Password</label>
              <input
                type="password"
                placeholder="******"
                {...register("password")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              variant="secondary"
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-center justify-center font-bold text-sm uppercase cursor-pointer"
            >
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col min-h-screen bg-bg-light">
        <Header />
        <div className="container mx-auto px-6 py-20 flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  );
}
