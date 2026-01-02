"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

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
              {t.nav.home}
            </Link>
          </li>
          <li>
            <Link href="/properties" className="text-dark font-medium hover:text-primary transition-colors">
              {t.nav.properties}
            </Link>
          </li>
          <li>
            <Link href="/services" className="text-dark font-medium hover:text-primary transition-colors">
              {t.nav.services}
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-dark font-medium hover:text-primary transition-colors">
              {t.nav.blog}
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-dark font-medium hover:text-primary transition-colors">
              {t.nav.about}
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-dark font-medium hover:text-primary transition-colors">
              {t.nav.contact}
            </Link>
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <Link
                  href="/client"
                  className="text-dark font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-user-circle"></i>
                  <span className="hidden sm:inline">{t.nav.myAccount}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-dark font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span className="hidden sm:inline">{t.nav.login}</span>
                </Link>
              )}
            </>
          )}
          <Link
            href="/owner/dashboard"
            className="bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-secondary-dark transition-colors text-sm"
          >
            <i className="fas fa-plus mr-2"></i>
            List Property
          </Link>
          <Link
            href="/contact"
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            {t.nav.getInTouch}
          </Link>
        </div>
      </div>
    </nav>
  );
}
