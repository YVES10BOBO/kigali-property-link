"use client";

import { useState, useEffect } from "react";
import { Property } from "@/types/property";
import PropertyDetail from "@/components/property/PropertyDetail";
import { PropertyCardFromDB } from "@/components/property/PropertyCard";
import PropertyMap from "@/components/map/PropertyMap";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

interface PropertyDetailClientProps {
  id: string;
}

export default function PropertyDetailClient({ id }: PropertyDetailClientProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("not_found");
            return;
          }
          throw new Error("Failed to fetch property");
        }
        
        const data = await response.json();
        setProperty(data);
        
        // Fetch similar properties (same location or type)
        const similarResponse = await fetch(
          `/api/properties?location=${encodeURIComponent(data.location)}&purpose=${data.price_type}`
        );
        if (similarResponse.ok) {
          const similarData = await similarResponse.json();
          setSimilarProperties(
            similarData.filter((p: Property) => p.id !== id).slice(0, 3)
          );
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          inquiry_type: 'viewing',
          preferred_date: formData.preferred_date || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setFormSubmitted(true);
      setFormData({ name: "", email: "", phone: "", preferred_date: "", message: "" });
      
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (error: any) {
      alert('Error submitting form. Please try again.');
      console.error('Error:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (error === "not_found" || !property) {
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

  if (error) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h2 className="text-2xl font-bold text-dark mb-2">Error Loading Property</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

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

            {formSubmitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <i className="fas fa-check-circle text-4xl text-green-600 mb-3"></i>
                <h3 className="text-xl font-bold text-green-800 mb-2">Inquiry Submitted!</h3>
                <p className="text-green-700">
                  We've received your inquiry and will contact you soon to schedule a viewing.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter your name"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="0788 XXX XXX"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="your@email.com"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Preferred Date</label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleFormChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-dark">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Any specific requirements..."
                    rows={4}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none resize-y"
                  ></textarea>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-check"></i>
                        Book Viewing
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTrackModal(true)}
                    className="w-full text-primary font-semibold text-sm flex items-center justify-center gap-2 underline-offset-4 hover:underline"
                  >
                    <i className="fas fa-location-arrow" />
                    Track my inquiry
                  </button>
                </div>
              </form>
            )}

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

      {/* Property Location Map */}
      {property && property.latitude && property.longitude && (
        <div className="mt-12 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-dark mb-6">Property Location</h2>
          <PropertyMap
            properties={[property]}
            center={{
              lat: Number(property.latitude),
              lng: Number(property.longitude),
            }}
            zoom={15}
            height="400px"
            selectedPropertyId={property.id}
          />
          <p className="text-gray-600 mt-4 text-center">
            <i className="fas fa-map-marker-alt text-primary mr-2"></i>
            {property.location}
          </p>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="mt-12 pt-12 border-t border-gray-200">
        <TestimonialsSection 
          propertyId={id} 
          title="Property Reviews" 
          showAddForm={true}
        />
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-dark mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((prop) => (
              <PropertyCardFromDB key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}

      {/* Track Inquiry / Login Modal */}
      <Modal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        title="Track your inquiry"
      >
        <p className="text-gray-600 text-sm mb-4">
          Want to see the status of your viewing requests and messages? Log in to your client account.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setShowTrackModal(false);
              router.push("/login?redirect=/client");
            }}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-sign-in-alt" />
            Log in to my account
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTrackModal(false);
              router.push("/register?redirect=/client");
            }}
            className="w-full border border-primary text-primary py-2.5 rounded-lg font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-user-plus" />
            Create a new account
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          After logging in, open <span className="font-semibold">My Inquiries</span> to track all viewing
          requests made with your email.
        </p>
      </Modal>
    </>
  );
}

