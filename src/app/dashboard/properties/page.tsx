"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/property";

export default function ManagePropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success) {
      setSuccessMessage(success);
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        // Get all properties, not just available ones
        setProperties(data);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("Failed to delete property");
    }
  };

  const filteredProperties =
    filter === "all"
      ? properties
      : properties.filter((p) => p.status === filter);

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === "rent") {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Manage Properties</h1>
          <p className="text-gray-600">Add, edit, and manage your property listings</p>
        </div>
        <Link
          href="/dashboard/properties/add"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Property
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
          <span>
            <i className="fas fa-check-circle mr-2"></i>
            {successMessage}
          </span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-700 hover:text-green-900"
          >
            <i className="fas fa-times"></i>
          </button>
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
            All ({properties.length})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "available"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Available ({properties.filter((p) => p.status === "available").length})
          </button>
          <button
            onClick={() => setFilter("reserved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "reserved"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Reserved ({properties.filter((p) => p.status === "reserved").length})
          </button>
          <button
            onClick={() => setFilter("sold")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "sold"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sold ({properties.filter((p) => p.status === "sold").length})
          </button>
          <button
            onClick={() => setFilter("rented")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "rented"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rented ({properties.filter((p) => p.status === "rented").length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-2xl font-bold text-dark mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-6">
            {filter === "all"
              ? "You haven't added any properties yet."
              : `No properties with status "${filter}" found.`}
          </p>
          <Link
            href="/dashboard/properties/add"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : "/images/default-property.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.price_type === "rent"
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {property.price_type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      property.status === "available"
                        ? "bg-green-500 text-white"
                        : property.status === "reserved"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-dark mb-2 line-clamp-1">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                  <i className="fas fa-map-marker-alt text-secondary"></i>
                  {property.location}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(property.price, property.price_type)}
                  </span>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-bed"></i>
                      {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-bath"></i>
                      {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fas fa-ruler-combined"></i>
                      {property.area}m²
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Link
                    href={`/properties/${property.id}`}
                    target="_blank"
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    <i className="fas fa-eye mr-1"></i>
                    View
                  </Link>
                  <Link
                    href={`/dashboard/properties/edit/${property.id}`}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors text-center"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProperty(property.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-trash"></i>
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
