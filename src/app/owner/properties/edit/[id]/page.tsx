"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/forms/ImageUpload";
import { Property } from "@/types/property";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_type: "rent" as "rent" | "sale",
    location: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnished: false,
    parking: false,
    security: false,
    generator: false,
    amenities: [] as string[],
    images: [] as string[],
    status: "available" as string,
  });

  const [currentAmenity, setCurrentAmenity] = useState("");

  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login?redirect=/owner/properties/edit/" + propertyId);
        return;
      }

      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) {
        setError("Property not found");
        setLoading(false);
        return;
      }

      const propertyData: Property = await response.json();
      
      // Verify ownership
      if (propertyData.owner_id !== user.id) {
        setError("You don't have permission to edit this property");
        setLoading(false);
        return;
      }

      setProperty(propertyData);
      setFormData({
        title: propertyData.title || "",
        description: propertyData.description || "",
        price: propertyData.price?.toString() || "",
        price_type: propertyData.price_type || "rent",
        location: propertyData.location || "",
        bedrooms: propertyData.bedrooms?.toString() || "",
        bathrooms: propertyData.bathrooms?.toString() || "",
        area: propertyData.area?.toString() || "",
        furnished: propertyData.furnished || false,
        parking: propertyData.parking || false,
        security: propertyData.security || false,
        generator: propertyData.generator || false,
        amenities: propertyData.amenities || [],
        images: propertyData.images || [],
        status: propertyData.status || "available",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addAmenity = () => {
    if (currentAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, currentAmenity.trim()],
      }));
      setCurrentAmenity("");
    }
  };

  const removeAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    if (!formData.title || !formData.price || !formData.location) {
      setError("Please fill in all required fields (Title, Price, Location)");
      setSaving(false);
      return;
    }

    try {
      // If status is being changed from available, it might need re-approval
      const updateData: Record<string, unknown> = {
        title: formData.title,
        description: formData.description || null,
        price: parseFloat(formData.price),
        price_type: formData.price_type,
        location: formData.location,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        furnished: formData.furnished,
        parking: formData.parking,
        security: formData.security,
        generator: formData.generator,
        amenities: formData.amenities,
        images: formData.images,
      };

      // If property was needs_revision and owner is updating, set back to pending_approval
      if (property?.status === "needs_revision") {
        updateData.status = "pending_approval";
      } else if (property?.status === "rejected") {
        // If rejected, allow resubmission
        updateData.status = "pending_approval";
      } else {
        // Keep current status unless owner is changing it
        updateData.status = formData.status;
      }

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/owner/dashboard?success=Property updated successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update property");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setFormData((prev) => ({ ...prev, status: newStatus }));
        alert("Status updated successfully!");
      } else {
        alert("Failed to update status");
      }
    } catch {
      alert("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                href="/owner/dashboard"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/owner/dashboard"
            className="text-primary hover:text-primary-dark mb-4 inline-block"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-2">Update your property information</p>
        </div>

        {/* Status Update Section */}
        {property && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Status</h2>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Current: {property.status.replace("_", " ").toUpperCase()}
              </span>
              {property.status === "available" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate("sold")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Mark as Sold
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("rented")}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Mark as Rented
                  </button>
                </div>
              )}
              {(property.status === "sold" || property.status === "rented") && (
                <button
                  onClick={() => handleStatusUpdate("available")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Mark as Available Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Price & Type */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Price & Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="price_type"
                  value={formData.price_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Furnished</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Parking</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="security"
                  checked={formData.security}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Security</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="generator"
                  checked={formData.generator}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Generator</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentAmenity}
                onChange={(e) => setCurrentAmenity(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add amenity"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link
              href="/owner/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Info Message */}
          {property?.status === "needs_revision" && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              <p className="text-sm">
                <i className="fas fa-info-circle mr-2"></i>
                Your property needs revision. After saving, it will be resubmitted for approval.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
