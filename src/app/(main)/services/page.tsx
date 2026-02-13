import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import {
  FaHome,
  FaEye,
  FaHandshake,
  FaDollarSign,
  FaBuilding,
  FaHeadset,
  FaCheck,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Our Services - BridgeProperties",
  description: "Comprehensive real estate services in Kigali, Rwanda. Property sales, rentals, property management, and expert consultation services.",
  openGraph: {
    title: "Our Services - BridgeProperties",
    description: "Comprehensive real estate services in Kigali, Rwanda.",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container-custom py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-dark mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive real estate services to help you find your perfect property in Kigali
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaHome className="text-3xl text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-4">Property Search</h3>
            <p className="text-gray-600 mb-4">
              Browse through our extensive database of verified properties. Filter by location, price, size, and amenities to find exactly what you're looking for.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Advanced search filters</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Verified listings only</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>High-quality photos</span>
              </li>
            </ul>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaEye className="text-3xl text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-4">Property Viewings</h3>
            <p className="text-gray-600 mb-4">
              Schedule free property viewings at your convenience. Our team will arrange visits to properties that match your requirements.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Free viewings</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Flexible scheduling</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Expert guidance</span>
              </li>
            </ul>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaHandshake className="text-3xl text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-4">Rental Assistance</h3>
            <p className="text-gray-600 mb-4">
              Complete support throughout your rental journey. From finding the perfect property to handling paperwork and negotiations.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Lease negotiation</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Documentation help</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Move-in support</span>
              </li>
            </ul>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaDollarSign className="text-3xl text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-4">Property Sales</h3>
            <p className="text-gray-600 mb-4">
              Expert assistance for property buyers. We help you find investment opportunities and guide you through the purchase process.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Investment advice</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Price negotiation</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Legal support</span>
              </li>
            </ul>
          </div>

          {/* Service 5 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaBuilding className="text-3xl text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-4">Property Management</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive property management services for landlords. We handle everything from tenant screening to maintenance.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Tenant screening</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Rent collection</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Maintenance coordination</span>
              </li>
            </ul>
          </div>

          {/* Service 6 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaHeadset className="text-3xl text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-dark mb-4">24/7 Support</h3>
            <p className="text-gray-600 mb-4">
              Round-the-clock customer support via WhatsApp, phone, and email. We're always here to help with your property needs.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>WhatsApp support</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Quick response time</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-primary" />
                <span>Multilingual support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Contact us today to learn more about our services and how we can help you find your perfect property in Kigali.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/contact"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/properties"
              className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors"
            >
              Browse Properties
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}


