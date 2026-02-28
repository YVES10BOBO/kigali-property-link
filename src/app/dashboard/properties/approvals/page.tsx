"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/property";

export default function PropertyApprovalsPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<"approve" | "reject" | "request_revision">("approve");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const response = await fetch("/api/properties?status=pending_approval&admin=true");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedProperty) return;

    try {
      const response = await fetch(`/api/properties/${selectedProperty.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          notes,
          rejection_reason: action === "reject" ? notes : null,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedProperty(null);
        setNotes("");
        fetchPendingProperties();
      } else {
        alert("Failed to update property status");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  const getStatusCounts = () => {
    return {
      pending: properties.filter(p => p.status === "pending_approval").length,
      needsRevision: properties.filter(p => p.status === "needs_revision").length,
    };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Property Approvals</h1>
              <p className="text-gray-600 mt-2">Review and approve property listings</p>
            </div>
            <Link
              href="/dashboard/properties"
              className="text-primary hover:text-primary-dark"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Properties
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
            <div className="text-gray-600 text-sm">Pending Approval</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-orange-600">{counts.needsRevision}</div>
            <div className="text-gray-600 text-sm">Needs Revision</div>
          </div>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="fas fa-check-circle text-6xl text-green-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No properties pending approval</p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="h-32 w-48 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-32 w-48 rounded-lg bg-gray-200 flex items-center justify-center">
                        <i className="fas fa-home text-gray-400 text-3xl"></i>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                        <p className="text-gray-600">{property.location}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        {property.status === "pending_approval" ? "Pending" : "Needs Revision"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Price</span>
                        <p className="font-semibold">
                          ${(property.price ?? 0).toLocaleString()} / {property.price_type ?? "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Bedrooms</span>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Bathrooms</span>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Area</span>
                        <p className="font-semibold">{property.area} sq ft</p>
                      </div>
                    </div>

                    {property.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>
                    )}

                    {property.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
                        <p className="text-sm">
                          <strong>Previous Rejection Reason:</strong> {property.rejection_reason}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setAction("approve");
                          setShowModal(true);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <i className="fas fa-check mr-2"></i>
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setAction("request_revision");
                          setShowModal(true);
                        }}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <i className="fas fa-edit mr-2"></i>
                        Request Revision
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setAction("reject");
                          setShowModal(true);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Reject
                      </button>
                      <Link
                        href={`/properties/${property.id}`}
                        target="_blank"
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Modal */}
        {showModal && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {action === "approve" && "Approve Property"}
                {action === "reject" && "Reject Property"}
                {action === "request_revision" && "Request Revision"}
              </h3>

              <p className="text-gray-600 mb-4">
                Property: <strong>{selectedProperty.title}</strong>
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {action === "approve" && "Notes (optional)"}
                  {action === "reject" && "Rejection Reason *"}
                  {action === "request_revision" && "Revision Notes *"}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  required={action !== "approve"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={
                    action === "approve"
                      ? "Add any notes for the owner..."
                      : action === "reject"
                      ? "Explain why this property is being rejected..."
                      : "What changes are needed?"
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProperty(null);
                    setNotes("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    action === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : action === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
