"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Get redirect URL from query parameters
    const redirect = searchParams.get("redirect");
    if (redirect) {
      // avoid synchronous setState in effect
      setTimeout(() => setRedirectUrl(redirect), 0);
    }
  }, [searchParams]);

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
          }
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }

        // Redirect to the specified URL or default to dashboard
        const redirectTo = redirectUrl || "/dashboard";
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
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
    <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
      <div className="max-w-6xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
            {/* Left Side - Image with Overlay */}
            <div className="relative hidden lg:block">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800')",
                }}
              >
                {/* Gradient Overlay - Matching Homepage */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/80 to-dark/80"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">
                  <Link href="/" className="text-3xl font-bold mb-8 animate-fade-in">
                    Bridge<span className="text-secondary">Properties</span>
                  </Link>
                  
                  <div className="space-y-6 animate-fade-in-delay">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      Welcome Back!
                    </h2>
                    
                    <p className="text-xl text-gray-100 leading-relaxed">
                      Sign in to access your dashboard and manage your property listings with ease.
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-4 mt-10 animate-fade-in-delay-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <i className="fas fa-shield-alt text-white text-lg"></i>
                      </div>
                      <span className="text-lg font-medium">Secure & Verified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <i className="fas fa-home text-white text-lg"></i>
                      </div>
                      <span className="text-lg font-medium">Manage Your Properties</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <i className="fas fa-chart-line text-white text-lg"></i>
                      </div>
                      <span className="text-lg font-medium">Track Your Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md">
                {/* Mobile Logo */}
                <div className="text-center mb-8 lg:hidden">
                  <Link href="/" className="text-3xl font-bold text-primary inline-block">
                    Bridge<span className="text-secondary">Properties</span>
                  </Link>
                </div>

                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-dark mb-2">Sign In</h1>
                  <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-down flex items-center gap-2">
                    <i className="fas fa-exclamation-circle"></i>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-2 text-dark text-sm">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400"></i>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-dark text-sm">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400"></i>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2" 
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Don&apos;t have an account?</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Create New Account
                    </Link>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-gray-800 text-sm inline-flex items-center transition-colors"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Back to Website
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
