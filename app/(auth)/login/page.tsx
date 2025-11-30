"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">GreenLine AI</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600 mb-8">
            Sign in to access your lead generation dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Start free trial
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Scale Your Lead Generation
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            AI-powered outreach that books qualified meetings while you sleep.
            Join 50+ agencies using GreenLine AI.
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold">2M+</div>
              <div className="text-sm text-primary-200">Verified Leads</div>
            </div>
            <div>
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm text-primary-200">Contact Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10x</div>
              <div className="text-sm text-primary-200">Avg ROI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
