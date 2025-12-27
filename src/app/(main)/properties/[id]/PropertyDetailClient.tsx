"use client";

import { mockProperties } from "@/lib/mock-data/properties";
import PropertyDetail from "@/components/property/PropertyDetail";
import PropertyCard from "@/components/property/PropertyCard";
import Link from "next/link";

interface PropertyDetailClientProps {
  id: string;
}

export default function PropertyDetailClient({ id }: PropertyDetailClientProps) {
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link
            href="/properties"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            View All Properties
          </Link>
        </div>
      </div>
    );
  }

  // Get similar properties (same location or type, excluding current)
  const similarProperties = mockProperties
    .filter(
      (p) =>
        p.id !== id &&
        (p.location === property.location || p.priceType === property.priceType)
    )
    .slice(0, 3);

  return (
    <>
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
      >
        <i className="fas fa-arrow-left"></i>
        <span>Back to Properties</span>
      </Link>

      {/* Property Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <PropertyDetail property={property} />
        </div>

        {/* Sidebar - Book Viewing */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
            <h3 className="text-2xl font-bold text-dark mb-4">Book a Viewing</h3>
            <p className="text-gray-600 mb-6">
              Interested in this property? Fill out the form and we'll contact you to schedule a viewing.
            </p>

            <form className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-dark">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-dark">Phone Number</label>
                <input
                  type="tel"
                  placeholder="0788 XXX XXX"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-dark">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-dark">Preferred Date</label>
                <input
                  type="date"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-dark">Message (Optional)</label>
                <textarea
                  placeholder="Any specific requirements..."
                  rows={4}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none resize-y"
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

            {/* Quick Contact */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-3 text-center">Or contact us directly:</p>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/250788000000?text=Hello! I'm interested in ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25d366] text-white py-3 rounded-lg font-semibold hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fab fa-whatsapp"></i>
                  WhatsApp
                </a>
                <a
                  href="tel:+250788000000"
                  className="flex-1 bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-phone"></i>
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-dark mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

