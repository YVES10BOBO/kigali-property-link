"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  name: string;
  email: string | null;
  rating: number;
  review: string;
  property_id: string | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  created_at: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/testimonials/all");
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

  const updateTestimonialStatus = async (id: string, status: string, featured?: boolean) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, featured }),
      });

      if (response.ok) {
        setSuccessMessage(`Testimonial ${status} successfully`);
        fetchTestimonials();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("Failed to update testimonial");
      }
    } catch (error) {
      alert("Failed to update testimonial");
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("Testimonial deleted successfully");
        fetchTestimonials();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert("Failed to delete testimonial");
      }
    } catch (error) {
      alert("Failed to delete testimonial");
    }
  };

  const filteredTestimonials =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.status === filter);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      ></i>
    ));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Manage Testimonials</h1>
        <p className="text-gray-600">Review and manage client testimonials and reviews</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-check-circle mr-2"></i>
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({testimonials.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({testimonials.filter((t) => t.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved ({testimonials.filter((t) => t.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "rejected"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({testimonials.filter((t) => t.status === "rejected").length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <i className="fas fa-comments text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-2xl font-bold text-dark mb-2">No Testimonials Found</h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "No testimonials have been submitted yet."
              : `No testimonials with status "${filter}" found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-dark mb-1">{testimonial.name}</h3>
                      {testimonial.email && (
                        <p className="text-sm text-gray-600">{testimonial.email}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        testimonial.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : testimonial.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {testimonial.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.review}</p>
                  {testimonial.featured && (
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2">
                      <i className="fas fa-star mr-1"></i>
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:w-48">
                  {testimonial.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateTestimonialStatus(testimonial.id, "approved")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                      >
                        <i className="fas fa-check mr-2"></i>
                        Approve
                      </button>
                      <button
                        onClick={() => updateTestimonialStatus(testimonial.id, "rejected")}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Reject
                      </button>
                    </>
                  )}
                  {testimonial.status === "approved" && (
                    <button
                      onClick={() =>
                        updateTestimonialStatus(
                          testimonial.id,
                          "approved",
                          !testimonial.featured
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        testimonial.featured
                          ? "bg-gray-500 text-white hover:bg-gray-600"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                    >
                      <i className="fas fa-star mr-2"></i>
                      {testimonial.featured ? "Unfeature" : "Feature"}
                    </button>
                  )}
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
