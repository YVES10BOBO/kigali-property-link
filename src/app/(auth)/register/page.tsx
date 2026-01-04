"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
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
          }
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
        <div className="max-w-6xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 min-h-[600px]">
            <div 
              className="relative hidden md:flex flex-col justify-between p-12 text-white"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/80 to-dark/80"></div>
              <div className="relative z-10">
                <Link href="/" className="inline-block mb-8">
                  <h1 className="text-3xl font-bold text-white">
                    Kigali<span className="text-secondary">PropertiesLink</span>
                  </h1>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center p-8 md:p-12">
              <div className="text-center w-full">
                <div className="mb-6 inline-block animate-bounce">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <i className="fas fa-check-circle text-5xl text-green-500"></i>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-dark mb-4">Account Created!</h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Your account has been created successfully. Redirecting to login...
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all hover:scale-105"
                >
                  Go to Login
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light px-4 py-12">
      <div className="max-w-6xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
            {/* Left Side - Image with Description */}
            <div className="relative hidden lg:block">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800')",
                }}
              >
                {/* Gradient Overlay - Matching Homepage Style */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary-dark/85 to-primary/90"></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">
                  <Link href="/" className="text-3xl font-bold mb-8 animate-fade-in">
                    Kigali<span className="text-primary">PropertiesLink</span>
                  </Link>
                  
                  <div className="space-y-6 animate-fade-in-delay">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                      Join Us Today!
                    </h2>
                    
                    <p className="text-xl text-gray-100 leading-relaxed">
                      Create your account and start listing your properties. Reach thousands of potential buyers and renters.
                    </p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-4 mt-10 animate-fade-in-delay-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <i className="fas fa-rocket text-white text-lg"></i>
                      </div>
                      <span className="text-lg font-medium">Quick & Easy Setup</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <i className="fas fa-users text-white text-lg"></i>
                      </div>
                      <span className="text-lg font-medium">Connect with Buyers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <i className="fas fa-chart-bar text-white text-lg"></i>
                      </div>
                      <span className="text-lg font-medium">Track Your Performance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <i className="fas fa-headset text-white text-lg"></i>
                      </div>
                      <span className="text-lg font-medium">24/7 Support Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md">
                {/* Mobile Logo */}
                <div className="text-center mb-8 lg:hidden">
                  <Link href="/" className="text-3xl font-bold text-primary inline-block">
                    Kigali<span className="text-secondary">PropertiesLink</span>
                  </Link>
                </div>

                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-dark mb-2">Create Account</h1>
                  <p className="text-gray-600">Sign up to start listing your properties</p>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slide-down flex items-center gap-2">
                    <i className="fas fa-exclamation-circle"></i>
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block font-semibold mb-2 text-dark text-sm">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-user text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

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
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">Minimum 6 characters required</p>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-dark text-sm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-lock text-gray-400"></i>
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox" 
                      id="terms"
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2" 
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:text-primary-dark font-medium transition-colors">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:text-primary-dark font-medium transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white py-3.5 rounded-lg font-semibold hover:from-secondary-dark hover:to-secondary transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Create Account
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
                      <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Sign In Instead
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
