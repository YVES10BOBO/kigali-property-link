"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to create account");
        setLoading(false);
        return;
      }

      if (data.user) {
        // Create user profile in public.users table
        try {
          const profileResponse = await fetch("/api/users/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
            }),
          });

          if (!profileResponse.ok) {
            console.error("Failed to create user profile");
            // Still show success, profile can be created later
          }
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
          // Still show success, profile can be created later
        }

        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (oauthError) {
        setError(oauthError.message || 'Google sign-up failed');
        setLoading(false);
      }
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <i className="fas fa-check-circle text-6xl text-green-500"></i>
            </div>
            <h1 className="text-2xl font-bold text-dark mb-4">Account Created!</h1>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Go to Login →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary inline-block">
            Kigali<span className="text-secondary">PropertiesLink</span>
          </Link>
          <p className="text-gray-600 mt-2">Create Admin Account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-dark mb-4">Sign Up</h1>

          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handleGoogleSignUp}
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="John Doe"
              />
            </div>

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
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-dark">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="Confirm your password"
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
                  Creating account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
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
            Note: Email confirmation may be required depending on your Supabase settings.
          </p>
        </div>
      </div>
    </div>
  );
}
