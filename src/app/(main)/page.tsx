"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PropertyCardFromDB } from "@/components/property/PropertyCard";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import { Property } from "@/types/property";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties?limit=6");
        if (response.ok) {
          const data = await response.json();
          setFeaturedProperties(data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  
  const [searchForm, setSearchForm] = useState({
    propertyType: "",
    location: "",
    purpose: "",
    priceRange: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (searchForm.propertyType) params.set("propertyType", searchForm.propertyType);
    if (searchForm.location) params.set("location", searchForm.location);
    if (searchForm.purpose) params.set("purpose", searchForm.purpose);
    if (searchForm.priceRange) params.set("priceRange", searchForm.priceRange);
    
    // Navigate to properties page with filters
    const queryString = params.toString();
    router.push(`/properties${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 bg-gradient-to-br from-primary/90 via-primary-dark/80 to-dark/80" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-dark/80 to-dark/80"></div>
        
        <div className="relative z-10 max-w-4xl animate-fadeIn">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 animate-slideDown">
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              <i className="fas fa-check-circle mr-2"></i>Verified Listings
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              <i className="fas fa-gift mr-2"></i>Free Listing
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              <i className="fas fa-headset mr-2"></i>24/7 Support
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-fadeIn delay-100">
            {t.home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto animate-fadeIn delay-200">
            {t.home.hero.subtitle}
          </p>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto animate-slideUp delay-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="font-semibold mb-2 text-sm text-dark flex items-center gap-2">
                  <i className="fas fa-home text-primary"></i>
                  Property Type
                </label>
                <select
                  value={searchForm.propertyType}
                  onChange={(e) => setSearchForm({ ...searchForm, propertyType: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none transition-colors hover:border-primary/50"
                >
                  <option value="">All Property Types</option>

                  <optgroup label="Residential">
                    <option value="apartment">Apartment</option>
                    <option value="studio">Studio</option>
                    <option value="condo">Condo</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="penthouse">Penthouse</option>
                  </optgroup>

                  <optgroup label="Commercial">
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                    <option value="showroom">Showroom</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="hotel">Hotel</option>
                    <option value="guest_house">Guest House</option>
                    <option value="commercial_building">Commercial Building</option>
                  </optgroup>

                  <optgroup label="Land">
                    <option value="land">Land / Plot</option>
                    <option value="farm">Farm</option>
                    <option value="industrial_land">Industrial Land</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="font-semibold mb-2 text-sm text-dark flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  Location
                </label>
                <select
                  value={searchForm.location}
                  onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none transition-colors hover:border-primary/50"
                >
                  <option value="">All Locations</option>
                  <option value="Kimihurura">Kimihurura</option>
                  <option value="Nyarutarama">Nyarutarama</option>
                  <option value="Kacyiru">Kacyiru</option>
                  <option value="Remera">Remera</option>
                  <option value="Kicukiro">Kicukiro</option>
                </select>
              </div>
              <div>
                <label className="font-semibold mb-2 text-sm text-dark flex items-center gap-2">
                  <i className="fas fa-tag text-primary"></i>
                  Purpose
                </label>
                <select
                  value={searchForm.purpose}
                  onChange={(e) => setSearchForm({ ...searchForm, purpose: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none transition-colors hover:border-primary/50"
                >
                  <option value="">Rent or Buy</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
              <div>
                <label className="font-semibold mb-2 text-sm text-dark flex items-center gap-2">
                  <i className="fas fa-dollar-sign text-primary"></i>
                  Price Range
                </label>
                <select
                  value={searchForm.priceRange}
                  onChange={(e) => setSearchForm({ ...searchForm, priceRange: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none transition-colors hover:border-primary/50"
                >
                  <option value="">Any Price</option>
                  <option value="300-500">$300 - $500</option>
                  <option value="500-800">$500 - $800</option>
                  <option value="800-1200">$800 - $1,200</option>
                  <option value="1200+">$1,200+</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-secondary text-white py-4 rounded-lg font-semibold text-lg hover:bg-secondary-dark transition-all hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <i className="fas fa-search"></i>
              {t.home.hero.searchButton}
            </button>
          </form>
          
          {/* Scroll Indicator */}
          <div className="mt-12 animate-bounce">
            <a href="#featured-properties" className="text-white/80 hover:text-white transition-colors flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Scroll to explore</span>
              <i className="fas fa-chevron-down text-2xl"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="featured-properties" className="bg-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">150+</h3>
              <p className="text-gray-600 font-medium">Properties Listed</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
              <p className="text-gray-600 font-medium">Happy Clients</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">15+</h3>
              <p className="text-gray-600 font-medium">Years Experience</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
              <p className="text-gray-600 font-medium">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark mb-2">{t.home.featured.title}</h2>
            <p className="text-gray-600">{t.home.featured.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3">
                <LoadingSpinner size="lg" text="Loading properties..." />
              </div>
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCardFromDB key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600">No properties available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              {t.home.featured.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <TestimonialsSection featured={true} limit={6} title="What Our Clients Say" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center">
              <i className="fas fa-shield-alt text-5xl text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-200">All listings are personally verified for quality and authenticity</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center">
              <i className="fas fa-eye text-5xl text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Free Viewing</h3>
              <p className="text-gray-200">Schedule free property viewings at your convenience</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center">
              <i className="fas fa-headset text-5xl text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-200">Our team is always available to assist you via WhatsApp</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center">
              <i className="fas fa-hand-holding-usd text-5xl text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-200">Competitive pricing with no hidden fees or charges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark mb-2">Book a Viewing</h2>
            <p className="text-gray-600">Interested in a property? Fill the form and we&apos;ll contact you</p>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-dark">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0788 XXX XXX"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-dark">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Property Interest</label>
                  <select className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none">
                    <option>Select Property</option>
                    <option>Greenland Plaza 2BR</option>
                    <option>Greenland Plaza 3BR</option>
                    <option>Phoenix Plaza 1BR</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-dark">Preferred Date</label>
                  <input
                    type="date"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Purpose</label>
                  <select className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none">
                    <option>Rent</option>
                    <option>Buy</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-dark">Message (Optional)</label>
                <textarea
                  placeholder="Any specific requirements or questions..."
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none resize-y"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <i className="fas fa-calendar-check"></i>
                Book Viewing
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
