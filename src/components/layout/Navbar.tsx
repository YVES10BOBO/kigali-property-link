"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
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

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg" 
        : "bg-white shadow-md"
    }`}>
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Kigali<span className="text-secondary">PropertiesLink</span>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 list-none">
            <li>
              <Link
                href="/"
                aria-current={isActive("/") ? "page" : undefined}
                className={`font-medium transition-colors relative ${
                  isActive("/")
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-all"
                    : "text-dark hover:text-primary"
                }`}
              >
                {t.nav.home}
              </Link>
            </li>
            <li>
              <Link
                href="/properties"
                aria-current={isActive("/properties") ? "page" : undefined}
                className={`font-medium transition-colors relative ${
                  isActive("/properties")
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-all"
                    : "text-dark hover:text-primary"
                }`}
              >
                {t.nav.properties}
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                aria-current={isActive("/services") ? "page" : undefined}
                className={`font-medium transition-colors relative ${
                  isActive("/services")
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-all"
                    : "text-dark hover:text-primary"
                }`}
              >
                {t.nav.services}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                aria-current={isActive("/about") ? "page" : undefined}
                className={`font-medium transition-colors relative ${
                  isActive("/about")
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-all"
                    : "text-dark hover:text-primary"
                }`}
              >
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={`font-medium transition-colors relative ${
                  isActive("/contact")
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:transition-all"
                    : "text-dark hover:text-primary"
                }`}
              >
                {t.nav.contact}
              </Link>
            </li>
          </ul>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
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
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-transform transform hover:-translate-y-0.5 shadow-lg hover:shadow-2xl text-sm flex items-center gap-2"
            >
              <i className="fas fa-plus mr-2"></i>
              <span className="hidden sm:inline">List Your Property</span>
              <span className="sm:hidden">Add Property</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-dark hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-slideDown">
            <ul className="flex flex-col gap-4">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    isActive("/") ? "text-primary" : "text-dark hover:text-primary"
                  }`}
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link 
                  href="/properties" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    isActive("/properties") ? "text-primary" : "text-dark hover:text-primary"
                  }`}
                >
                  {t.nav.properties}
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    isActive("/services") ? "text-primary" : "text-dark hover:text-primary"
                  }`}
                >
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    isActive("/about") ? "text-primary" : "text-dark hover:text-primary"
                  }`}
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    isActive("/contact") ? "text-primary" : "text-dark hover:text-primary"
                  }`}
                >
                  {t.nav.contact}
                </Link>
              </li>
              
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
