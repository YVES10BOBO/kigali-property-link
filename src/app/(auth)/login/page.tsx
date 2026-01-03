"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      if (data.user) {
        // Ensure user profile exists in public.users table
        try {
          const profileResponse = await fetch("/api/users/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "User",
            }),
          });

          if (!profileResponse.ok) {
            console.error("Failed to create/update user profile");
            // Still allow login, profile can be created later
          }
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
          // Still allow login
        }

        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (oauthError) {
        setError(oauthError.message || 'Google sign-in failed');
        setLoading(false);
      }
      // Supabase will redirect to the configured callback
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary inline-block">
            Kigali<span className="text-secondary">PropertiesLink</span>
          </Link>
          <p className="text-gray-600 mt-2">Admin Dashboard Login</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-dark mb-4">Sign In</h1>

          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 border border-gray-200 rounded-lg hover:shadow-sm transition">
              <Image src="/images/icons/google.svg" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex-1 h-px bg-gray-200"></span>
              <span>Or</span>
              <span className="flex-1 h-px bg-gray-200"></span>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-dark">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-dark">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign Up
              </Link>
            </p>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Website
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">
            <i className="fas fa-info-circle mr-2"></i>
            First time? Create your account using the Sign Up link above.
          </p>
          <p className="mt-2 text-xs">
            Or create your account via Supabase Dashboard → Authentication → Users → Add user
          </p>
        </div>
      </div>
    </div>
  );
}
