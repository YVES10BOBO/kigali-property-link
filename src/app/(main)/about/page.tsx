import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Link from "next/link";

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
                At Kigali Properties Link, we are dedicated to connecting people with their dream homes and investment opportunities in Kigali. We specialize in showcasing premium properties from trusted developers like Homart Properties, including the prestigious Greenland Plaza.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to make property finding easy, transparent, and stress-free. We act as your trusted agent, helping you discover the perfect apartment, villa, or commercial space that meets your needs and budget.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-2xl text-white">
              <div className="space-y-6">
                <div>
                  <div className="text-5xl font-bold mb-2">150+</div>
                  <div className="text-xl">Properties Listed</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">500+</div>
                  <div className="text-xl">Happy Clients</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">15+</div>
                  <div className="text-xl">Years of Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-dark mb-8 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Verified Properties</h3>
              <p className="text-gray-600">
                All our listings are personally verified for authenticity and quality
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Our experienced team provides personalized assistance throughout your journey
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-3xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Available via WhatsApp, phone, or email whenever you need us
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-dollar-sign text-3xl text-primary"></i>
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
              <i className="fas fa-home text-4xl text-primary mb-4"></i>
              <h3 className="text-2xl font-bold text-dark mb-3">Property Listings</h3>
              <p className="text-gray-700">
                Browse through our extensive collection of apartments, villas, and commercial spaces in prime locations across Kigali.
              </p>
            </div>
            <div>
              <i className="fas fa-calendar-check text-4xl text-primary mb-4"></i>
              <h3 className="text-2xl font-bold text-dark mb-3">Property Viewings</h3>
              <p className="text-gray-700">
                Schedule free property viewings at your convenience. We'll arrange everything and accompany you to the property.
              </p>
            </div>
            <div>
              <i className="fas fa-user-tie text-4xl text-primary mb-4"></i>
              <h3 className="text-2xl font-bold text-dark mb-3">Agent Services</h3>
              <p className="text-gray-700">
                We act as your trusted agent, connecting you with property owners and helping you negotiate the best deals.
              </p>
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
