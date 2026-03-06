"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  avatar_url?: string | null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get current user and profile
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user profile
        try {
          const profileRes = await fetch("/api/users/profile");
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUserProfile(profileData.user);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    fetchUserData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const profileRes = await fetch("/api/users/profile");
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUserProfile(profileData.user);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { href: "/dashboard", label: t.dashboard.overview, icon: "fas fa-chart-line" },
    { href: "/dashboard/inquiries", label: t.dashboard.inquiries, icon: "fas fa-envelope", badge: true },
    { href: "/dashboard/properties", label: t.dashboard.properties, icon: "fas fa-home" },
    { href: "/dashboard/properties/approvals", label: "Property Approvals", icon: "fas fa-check-circle", badge: true },
    // { href: "/dashboard/properties/import", label: "Bulk Import", icon: "fas fa-upload" }, // Disabled for MVP
    { href: "/dashboard/commissions", label: t.dashboard.commissions, icon: "fas fa-money-bill-wave" },
    { href: "/dashboard/analytics", label: t.dashboard.analytics, icon: "fas fa-chart-bar" },
    { href: "/dashboard/testimonials", label: t.dashboard.testimonials, icon: "fas fa-comments" },
    { href: "/dashboard/users", label: "User Management", icon: "fas fa-users" },
    // { href: "/dashboard/blog", label: t.dashboard.blog, icon: "fas fa-blog" }, // Disabled for MVP
    // { href: "/dashboard/calendar", label: t.dashboard.calendar, icon: "fas fa-calendar" }, // Disabled for MVP
    { href: "/dashboard/profile", label: t.dashboard.profile, icon: "fas fa-user" },
  ];

  // Derive display values (fallback to auth metadata when profile row missing)
  const avatarUrl =
    userProfile?.avatar_url ??
    (user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url ??
    null;

  const displayName =
    userProfile?.name ??
    (user?.user_metadata as { name?: string } | undefined)?.name ??
    user?.email ??
    "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Kigali<span className="text-secondary">PropertiesLink</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-gray-600 text-sm hidden md:block">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                      <Image
                        src={avatarUrl}
                        alt={displayName || "Profile"}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <i className="fas fa-user text-gray-500 text-sm"></i>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{displayName}</span>
                    {userProfile?.role && (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-semibold uppercase w-fit">
                        {userProfile.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <Link
              href="/"
              className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
            >
              <i className="fas fa-external-link-alt"></i>
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <i className={`${item.icon} w-5`}></i>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
