"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 flex items-center gap-2">
          <i className="fas fa-spinner fa-spin" />
          <span>Loading your account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold text-primary">
              Kigali<span className="text-secondary">PropertiesLink</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 font-medium">My Account</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-600 text-sm hidden md:block">
                <i className="fas fa-user-circle mr-2" />
                {user.email}
              </span>
            )}
            <Link
              href="/properties"
              className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 text-sm"
            >
              <i className="fas fa-home" />
              <span>Browse Properties</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
            >
              <i className="fas fa-sign-out-alt mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}