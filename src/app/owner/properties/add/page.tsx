"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/forms/ImageUpload";
import UnitsManager, { Unit } from "@/components/forms/UnitsManager";

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_type: "rent" as "rent" | "sale" | "rent_and_sale",
    currency: "RWF" as "RWF" | "USD",
    property_type: "" as string,
    location: "",
    address: "",
    show_address: false,
    latitude: "",
    longitude: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    features: [] as string[], // Changed from individual checkboxes to dynamic list
    amenities: [] as string[],
    images: [] as string[],
  });

  const [currentAmenity, setCurrentAmenity] = useState("");
  const [currentFeature, setCurrentFeature] = useState("");
  const [hasMultipleUnits, setHasMultipleUnits] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);

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

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate required fields
    if (!formData.title || !formData.location) {
      setError("Please fill in all required fields (Title, Location)");
      setLoading(false);
      return;
    }

    // Validate based on property type
    if (hasMultipleUnits) {
      if (units.length === 0) {
        setError("Please add at least one unit for this building");
        setLoading(false);
        return;
      }
      // Units are optional - no validation needed
      // All unit fields (unit_number, bedrooms, bathrooms, area, prices) are optional
    } else {
      if (!formData.price) {
        setError("Please provide a price for this property");
        setLoading(false);
        return;
      }
    }

    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/owner/properties/add");
        return;
      }

      // Prepare data for API
      const propertyData: {
        title: string;
        description: string | null;
        property_type: string | null;
        location: string;
        address: string | null;
        show_address: boolean;
        latitude: number | null;
        longitude: number | null;
        bedrooms: number;
        bathrooms: number;
        area: number;
        furnished: boolean;
        parking: boolean;
        security: boolean;
        generator: boolean;
        amenities: string[];
        status: string;
        images: string[];
        owner_id: string;
        price?: number | null;
        price_type?: string | null;
        currency?: "RWF" | "USD";
        units?: Unit[];
      } = {
        title: formData.title,
        description: formData.description || null,
        property_type: formData.property_type || null,
        location: formData.location,
        address: formData.address || null,
        show_address: formData.show_address || false,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        // Convert features array to boolean fields for backward compatibility
        furnished: formData.features.some(f => f.toLowerCase().includes('furnished')),
        parking: formData.features.some(f => f.toLowerCase().includes('parking')),
        security: formData.features.some(f => f.toLowerCase().includes('security')),
        generator: formData.features.some(f => f.toLowerCase().includes('generator')),
        // Store both features and amenities (features are also shown as amenities)
        amenities: [...formData.amenities, ...formData.features],
        status: "pending_approval", // New properties start as pending
        images: formData.images,
        owner_id: user.id, // Set owner_id
      };

      // Add price/price_type/currency only if NOT a building with units
      if (!hasMultipleUnits) {
        propertyData.price = parseFloat(formData.price);
        propertyData.price_type = formData.price_type;
        propertyData.currency = formData.currency;
      } else {
        // For buildings with units, price and price_type are optional, but currency is still needed
        propertyData.price = null;
        propertyData.price_type = formData.price_type; // Keep price_type for badge display
        propertyData.currency = formData.currency; // Currency applies to the building and its units
        propertyData.units = units;
      }

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        router.push("/owner/dashboard?success=Property submitted for approval");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add property");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below. Your property will be reviewed before going live.
          </p>
        </div>

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
                  placeholder="e.g., Modern 3BR Apartment in Kigali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location / Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Kimihurura, Kigali"
                />
                <p className="mt-1 text-xs text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  General area/neighborhood (this will be visible to everyone)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Address (Optional)
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., KG 123 St, Kimihurura"
                />
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="show_address"
                    checked={formData.show_address}
                    onChange={(e) => setFormData({ ...formData, show_address: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label className="text-xs text-gray-600">
                    Show this address to public (if unchecked, only location will be visible)
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  Specific street address - optional, can be kept private for security
                </p>
              </div>

              {/* Coordinates - Optional for Owner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude (Optional)
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., -1.9441"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    <i className="fas fa-info-circle mr-1"></i>
                    Optional: Admin will verify and finalize coordinates
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude (Optional)
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 30.0619"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    <i className="fas fa-info-circle mr-1"></i>
                    Get coordinates from Google Maps (right-click → coordinates)
                  </p>
                </div>
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
                placeholder="Describe your property..."
              />
            </div>
          </div>

          {/* Building Type Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={hasMultipleUnits}
                onChange={(e) => setHasMultipleUnits(e.target.checked)}
                className="w-5 h-5 text-primary"
              />
              <div>
                <span className="font-semibold text-dark">Building with Multiple Units</span>
                <p className="text-xs text-gray-600 mt-1">
                  Check this if this property has multiple units (e.g., apartment building with Studio, 1BR, 2BR, 3BR units)
                </p>
              </div>
            </label>
          </div>

          {/* Price & Type - only show if NOT a building with units */}
          {!hasMultipleUnits && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Price & Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="RWF">RWF (Rwandan Franc)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>

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
                    placeholder={formData.currency === "USD" ? "800.00" : "800000"}
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
          )}

          {/* Property Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Type</option>
              <optgroup label="Residential">
                <option value="apartment">Apartment</option>
                <option value="studio">Studio</option>
                <option value="condo">Condo</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
              </optgroup>
              <optgroup label="Commercial">
                <option value="office">Office</option>
                <option value="shop">Shop</option>
                <option value="showroom">Showroom</option>
                <option value="warehouse">Warehouse</option>
                <option value="hotel">Hotel</option>
                <option value="guest_house">Guest House</option>
                <option value="commercial_building">Commercial Building</option>
              </optgroup>
              <optgroup label="Land">
                <option value="land">Land / Plot</option>
                <option value="farm">Farm</option>
                <option value="industrial_land">Industrial Land</option>
              </optgroup>
            </select>
          </div>

          {/* Units Management - only show if building with multiple units */}
          {hasMultipleUnits && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Building Units</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Add all available units in this building. Each unit can have different sizes, prices, and availability.
              </p>
              
              {/* Currency and Price Type for Building with Units */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="RWF">RWF (Rwandan Franc)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">Default currency for all units</p>
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
                    <option value="rent_and_sale">For Rent & Sale</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">This determines the badge shown on property cards</p>
                </div>
              </div>
              
              <UnitsManager units={units} onChange={setUnits} defaultCurrency={formData.currency} />
            </div>
          )}

          {/* Property Details - only show if NOT a building with units */}
          {!hasMultipleUnits && (
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
                    Area (m²)
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Features - Dynamic like Amenities */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            <p className="text-gray-600 text-sm mb-4">Add features like Furnished, Parking, Security, Generator, etc. (Optional)</p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add feature (e.g., Furnished, Parking, Security, Generator)"
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>

            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
            <p className="text-gray-600 text-sm mb-4">Add amenities like Swimming Pool, Gym, WiFi, etc. (Optional)</p>
            
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
                placeholder="Add amenity (e.g., Swimming Pool, Gym, WiFi)"
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
            <p className="text-sm text-gray-500 mt-2">
              Upload high-quality photos of your property. First image will be the featured image.
            </p>
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
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Submit for Approval
                </>
              )}
            </button>
          </div>

          {/* Info Message */}
          <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p className="text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              Your property will be reviewed by our team before it goes live. You&apos;ll receive an email notification once it&apos;s approved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
