"use client";

import { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  property_id?: string | null;
  created_at: string;
}

interface TestimonialsSectionProps {
  propertyId?: string;
  featured?: boolean;
  limit?: number;
  title?: string;
  showAddForm?: boolean;
}

export default function TestimonialsSection({
  propertyId,
  featured = false,
  limit,
  title = "What Our Clients Say",
  showAddForm = false,
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    review: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, [propertyId, featured, limit]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (propertyId) params.append("property_id", propertyId);
      if (featured) params.append("featured", "true");
      if (limit) params.append("limit", limit.toString());

      const response = await fetch(`/api/testimonials?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          property_id: propertyId || null,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", rating: 5, review: "" });
        setShowForm(false);
        setTimeout(() => {
          setSubmitSuccess(false);
          fetchTestimonials();
        }, 3000);
      } else {
        alert("Failed to submit testimonial. Please try again.");
      }
    } catch (error) {
      alert("Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="md" text="Loading testimonials..." />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-dark">{title}</h2>
        {showAddForm && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            {showForm ? "Cancel" : "Add Review"}
          </button>
        )}
      </div>

      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-check-circle mr-2"></i>
          Thank you! Your review has been submitted and is pending approval.
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-dark mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="Enter your email (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className={`text-2xl ${
                      rating <= formData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <i className="fas fa-star"></i>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                required
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <i className="fas fa-comments text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-2xl font-bold text-dark mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">
            Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </div>
  );
}
