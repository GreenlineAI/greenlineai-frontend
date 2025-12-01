"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Mail, ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
              Check your email
            </h1>
            <p className="text-slate-600 text-center mb-8">
              We've sent a password reset link to <strong>{email}</strong>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                <li>Open your email inbox</li>
                <li>Click the password reset link</li>
                <li>Enter your new password</li>
                <li>Sign in with your new password</li>
              </ol>
            </div>

            <Link
              href="/login"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            <p className="mt-6 text-center text-sm text-slate-600">
              Didn't receive the email?{" "}
              <button
                onClick={() => setSuccess(false)}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

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

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Reset your password
          </h1>
          <p className="text-slate-600 mb-8">
            Enter your email address and we'll send you a link to reset your password.
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

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="flex justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Lock className="h-10 w-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Secure Account Recovery
          </h2>
          <p className="text-primary-100 text-lg">
            We'll send you a secure link to reset your password and regain access to your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
