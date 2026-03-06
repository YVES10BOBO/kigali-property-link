"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have the hash from email link
    const hash = searchParams.get("hash");
    if (!hash) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || "Failed to reset password");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?message=Password reset successfully");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo/bridgepropertieslogo_official.png"
                  alt="BridgeProperties"
                  width={220}
                  height={60}
                  className="h-12 w-auto mx-auto"
                />
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-dark mb-2 text-center">Reset Password</h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your new password below.
            </p>

            {success ? (
              <div className="space-y-4">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  <i className="fas fa-check-circle mr-2"></i>
                  Password reset successfully! Redirecting to login...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Resetting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key mr-2"></i>
                      Reset Password
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-primary hover:underline text-sm"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
