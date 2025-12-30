"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-white fixed w-full top-0 z-50 shadow-md">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Kigali<span className="text-secondary">PropertiesLink</span>
        </Link>
        
        <ul className="hidden md:flex gap-8 list-none">
          <li>
            <Link href="/" className="text-dark font-medium hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/properties" className="text-dark font-medium hover:text-primary transition-colors">
              Properties
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-dark font-medium hover:text-primary transition-colors">
              Services
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-dark font-medium hover:text-primary transition-colors">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-dark font-medium hover:text-primary transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-dark font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <Link
                  href="/client"
                  className="text-dark font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-user-circle"></i>
                  <span className="hidden sm:inline">My Account</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-dark font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </>
          )}
          <Link
            href="/contact"
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </nav>
  );
}
