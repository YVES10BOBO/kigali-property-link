import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import StatsDisplay from "@/components/stats/StatsDisplay";
import Link from "next/link";
import Image from "next/image";
import {
  FaShieldAlt,
  FaHandshake,
  FaClock,
  FaDollarSign,
  FaHome,
  FaCalendarCheck,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "About Us - BridgeProperties",
  description:
    "Learn about BridgeProperties, your trusted real estate partner in Rwanda. We help you find your dream home or investment with professional service and expert guidance.",
  openGraph: {
    title: "About Us - BridgeProperties",
    description:
      "Learn about BridgeProperties, your trusted real estate partner in Rwanda.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container-custom py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-dark mb-4">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property in Kigali, Rwanda
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At BridgeProperties, we are dedicated to connecting people with their dream homes and investment opportunities in Rwanda. We specialize in showcasing premium, verified properties from trusted developers and owners, including flagship projects like Greenland Plaza.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to make property finding easy, transparent, and stress-free. We act as your trusted agent, helping you discover the perfect apartment, villa, or commercial space that meets your needs and budget.
              </p>
            </div>
            <StatsDisplay variant="about" showSupport={false} />
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-dark mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Verified Properties</h3>
              <p className="text-gray-600">
                All our listings are personally verified for authenticity and quality
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Our experienced team provides personalized assistance throughout your journey
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Available via WhatsApp, phone, or email whenever you need us
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDollarSign className="text-3xl text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Competitive pricing with no hidden fees or charges
              </p>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="mb-16 bg-light p-12 rounded-2xl">
          <h2 className="text-4xl font-bold text-dark mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <FaHome className="text-4xl text-primary mb-4" />
              <h3 className="text-2xl font-bold text-dark mb-3">Property Listings</h3>
              <p className="text-gray-700">
                Browse through our extensive collection of apartments, villas, and commercial spaces in prime locations across Kigali.
              </p>
            </div>
            <div>
              <FaCalendarCheck className="text-4xl text-primary mb-4" />
              <h3 className="text-2xl font-bold text-dark mb-3">Property Viewings</h3>
              <p className="text-gray-700">
                Schedule free property viewings at your convenience. We'll arrange everything and accompany you to the property.
              </p>
            </div>
            <div>
              <FaUserTie className="text-4xl text-primary mb-4" />
              <h3 className="text-2xl font-bold text-dark mb-3">Agent Services</h3>
              <p className="text-gray-700">
                We act as your trusted agent, connecting you with property owners and helping you negotiate the best deals.
              </p>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our dedicated professionals are here to help you find your perfect property in Kigali
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/image1.jpg"
                  alt="Team Member"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">RUTEMBEZA Yves</h3>
                    <p className="text-primary font-semibold text-sm">Founder & CEO</p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  With over 15 years of experience in real estate, I'm passionate about helping clients find their dream homes in Kigali.
                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-primary hover:text-primary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:info@kigalipropertieslink.com" className="text-primary hover:text-primary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2 - john */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/jhon.jpg"
                  alt="jhoni"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">Ntwari</h3>
                    <p className="text-secondary font-semibold text-sm">Senior Property Consultant</p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Specializing in luxury properties and investment opportunities. I help clients make informed decisions.
                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-secondary hover:text-secondary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:consultant@kigalipropertieslink.com" className="text-secondary hover:text-secondary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 3 - ingabire */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/ingabire.jpg"
                  alt="ingabire"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">Assumpta</h3>
                    <p className="text-primary font-semibold text-sm">Property Manager</p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Ensuring smooth property viewings and managing client relationships. Your satisfaction is my priority.
                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-primary hover:text-primary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:manager@kigalipropertieslink.com" className="text-primary hover:text-primary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 4 - Add New Member */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/gentil.jpg"
                  alt="Team Member"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">Gentil Esperance</h3>
                    <p className="text-primary font-semibold text-sm">Customer Support & Office Administrator
                    </p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                Managing client inquiries, scheduling property viewings, and supporting administrative tasks to ensure smooth and professional customer service.                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-primary hover:text-primary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:info@kigalipropertieslink.com" className="text-primary hover:text-primary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Agents */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark mb-4">Our Agents</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet our experienced real estate agents ready to assist you with all your property needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           
            {/* Agent 1 - aisha */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/agents/aisha.jpg"
                  alt="Real Estate Agent"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">aisha</h3>
                    <p className="text-primary font-semibold text-sm">Real Estate Agent</p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Committed to providing exceptional service and helping clients achieve their real estate goals.
                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-primary hover:text-primary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:aisha@kigalipropertieslink.com" className="text-primary hover:text-primary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
           
            {/* Agent 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/agents/alexandre.jpg"
                  alt="Real Estate Agent"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">alexandre</h3>
                    <p className="text-primary font-semibold text-sm">Real Estate Agent</p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Dedicated to finding you the perfect property. Expert in residential and commercial real estate.
                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-primary hover:text-primary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:alexandre@kigalipropertieslink.com" className="text-primary hover:text-primary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Agent 2 - vanessa */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/agents/vanessa.jpg"
                  alt="vanessa - Real Estate Agent"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">Ntwari</h3>
                    <p className="text-secondary font-semibold text-sm">Real Estate Agent</p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Experienced in property sales and rentals. Committed to providing exceptional service to all clients.
                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-secondary hover:text-secondary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:vanessa@kigalipropertieslink.com" className="text-secondary hover:text-secondary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-secondary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Agent 3 - lambert */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <Image
                  src="/images/team/agents/lambert.jpg"
                  alt="niyonzima - Real Estate Agent"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Name and Title Overlay with Paper Background - Left Aligned */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-white/75 backdrop-blur-sm rounded-lg px-4 py-2.5 shadow-lg border border-white/30 max-w-[85%]">
                    <h3 className="text-lg font-bold text-dark mb-0.5">niyonzima Lambert</h3>
                    <p className="text-primary font-semibold text-lg">Real Estate Agent</p>
                  </div>
                </div>
              </div>
              {/* Description Below Image */}
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Your trusted partner in property transactions. Specializing in helping clients find their ideal homes.
                </p>
                <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
                  <a href="tel:+250788123456" className="text-primary hover:text-primary-dark transition-colors" title="Call">
                    <FaPhone className="text-xl" />
                  </a>
                  <a href="mailto:lambert@kigalipropertieslink.com" className="text-primary hover:text-primary-dark transition-colors" title="Email">
                    <FaEnvelope className="text-xl" />
                  </a>
                  <a href="https://wa.me/250788123456" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark transition-colors" title="WhatsApp">
                    <FaWhatsapp className="text-xl" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Our Partners */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-dark mb-8 text-center">Our Partners</h2>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h3 className="text-2xl font-bold text-dark mb-4">Homart Properties</h3>
            <p className="text-gray-700 max-w-2xl mx-auto">
              We proudly represent Homart Properties, one of Kigali's leading real estate developers. 
              Our partnership includes exclusive access to Greenland Plaza and other premium developments 
              across the city, ensuring you have access to the finest properties available.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark p-12 rounded-2xl text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Let us help you find the perfect home or investment opportunity in Kigali
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/properties"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-secondary-dark transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
