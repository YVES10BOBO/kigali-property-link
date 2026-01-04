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

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-lg" 
        : "bg-white shadow-md"
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary flex-shrink-0">
            Kigali<span className="text-secondary">PropertiesLink</span>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-8 list-none">
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
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher - Hidden on very small screens */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            
            {/* User Actions - Hidden on mobile, shown on tablet+ */}
            {!loading && (
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <Link
                    href="/client"
                    className="text-dark font-medium hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-user-circle text-lg"></i>
                    <span className="hidden lg:inline">{t.nav.myAccount}</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-dark font-medium hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-sign-in-alt text-lg"></i>
                    <span className="hidden lg:inline">{t.nav.login}</span>
                  </Link>
                )}
              </div>
            )}
            
            {/* List Property Button - Responsive sizing */}
            <Link
              href="/owner/dashboard"
              className="bg-gradient-to-r from-secondary to-secondary-dark text-white px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:from-secondary-dark hover:to-secondary transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
            >
              <i className="fas fa-plus text-xs sm:text-sm"></i>
              <span className="hidden sm:inline">List Your Property</span>
              <span className="sm:hidden">List</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-dark hover:text-primary hover:bg-gray-100 rounded-lg transition-all active:scale-95"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Full Screen Overlay Style */}
        <div 
          className={`lg:hidden fixed inset-0 top-[73px] bg-white z-40 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="h-full overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="container-custom py-6">
              {/* Mobile Navigation Links */}
              <ul className="space-y-2 mb-6">
                <li>
                  <Link 
                    href="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold transition-all ${
                      isActive("/") 
                        ? "bg-primary text-white shadow-md" 
                        : "text-dark hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    <i className="fas fa-home text-lg w-6 text-center"></i>
                    <span>{t.nav.home}</span>
                    {isActive("/") && <i className="fas fa-check ml-auto"></i>}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/properties" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold transition-all ${
                      isActive("/properties") 
                        ? "bg-primary text-white shadow-md" 
                        : "text-dark hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    <i className="fas fa-building text-lg w-6 text-center"></i>
                    <span>{t.nav.properties}</span>
                    {isActive("/properties") && <i className="fas fa-check ml-auto"></i>}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/services" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold transition-all ${
                      isActive("/services") 
                        ? "bg-primary text-white shadow-md" 
                        : "text-dark hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    <i className="fas fa-concierge-bell text-lg w-6 text-center"></i>
                    <span>{t.nav.services}</span>
                    {isActive("/services") && <i className="fas fa-check ml-auto"></i>}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold transition-all ${
                      isActive("/about") 
                        ? "bg-primary text-white shadow-md" 
                        : "text-dark hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    <i className="fas fa-info-circle text-lg w-6 text-center"></i>
                    <span>{t.nav.about}</span>
                    {isActive("/about") && <i className="fas fa-check ml-auto"></i>}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold transition-all ${
                      isActive("/contact") 
                        ? "bg-primary text-white shadow-md" 
                        : "text-dark hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    <i className="fas fa-envelope text-lg w-6 text-center"></i>
                    <span>{t.nav.contact}</span>
                    {isActive("/contact") && <i className="fas fa-check ml-auto"></i>}
                  </Link>
                </li>
              </ul>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Mobile User Actions */}
              <div className="space-y-2">
                {!loading && (
                  <>
                    {user ? (
                      <Link
                        href="/client"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold text-dark hover:bg-gray-100 hover:text-primary transition-all"
                      >
                        <i className="fas fa-user-circle text-lg w-6 text-center"></i>
                        <span>{t.nav.myAccount}</span>
                        <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold text-dark hover:bg-gray-100 hover:text-primary transition-all"
                      >
                        <i className="fas fa-sign-in-alt text-lg w-6 text-center"></i>
                        <span>{t.nav.login}</span>
                        <i className="fas fa-chevron-right ml-auto text-gray-400"></i>
                      </Link>
                    )}
                  </>
                )}
                
                {/* Language Switcher in Mobile Menu */}
                <div className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-globe text-lg w-6 text-center text-gray-600"></i>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>

              {/* Mobile CTA Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/owner/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-secondary to-secondary-dark text-white px-4 py-3.5 rounded-lg font-semibold hover:from-secondary-dark hover:to-secondary transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  <i className="fas fa-plus"></i>
                  <span>List Your Property</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop Overlay */}
        {mobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30 top-[73px]"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
