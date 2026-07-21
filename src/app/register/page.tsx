"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number must be at least 11 digits").max(14, "Phone number too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

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
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    const success = await registerUser(data.name, data.email, data.password, data.phone);
    setSubmitting(false);
    if (success) {
      router.push("/login");
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
          <h2 className="text-2xl font-black text-secondary dark:text-white mb-2">Create Account</h2>
          <p className="text-xs text-slate-400 mb-6">Register a new account to manage and track your orders.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

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

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Phone Number</label>
              <input
                type="text"
                placeholder="017XXXXXXXX"
                {...register("phone")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                {...register("password")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-slate-900 dark:text-white"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              variant="secondary"
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-center justify-center font-bold text-sm uppercase cursor-pointer"
            >
              {submitting ? "Creating account..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
