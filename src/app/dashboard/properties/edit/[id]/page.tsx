"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/property";
import ImageUpload from "@/components/forms/ImageUpload";
import UnitsManager, { Unit } from "@/components/forms/UnitsManager";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_type: "rent" as "rent" | "sale" | "rent_and_sale",
    currency: "RWF" as "RWF" | "USD",
    property_type: "" as string,
    location: "",
    latitude: "",
    longitude: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    // Optional text-based features (not yet wired into UI on edit form)
    features: [] as string[],
    // Boolean feature flags for backward compatibility with existing data
    furnished: false,
    parking: false,
    security: false,
    generator: false,
    amenities: [] as string[],
    status: "available" as "available" | "off_plan" | "reserved" | "sold" | "rented",
    images: [] as string[],
  });

  const [currentAmenity, setCurrentAmenity] = useState("");
  const [hasMultipleUnits, setHasMultipleUnits] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data: Property = await response.json();
          setProperty(data);
          
          // Check if property has units
          const hasUnits = !!(data.units && data.units.length > 0);
          setHasMultipleUnits(hasUnits);
          
          // Load units if they exist
          if (hasUnits && data.units) {
            setUnits(data.units.map((u: any) => ({
              id: u.id,
              unit_number: u.unit_number || "",
              bedrooms: u.bedrooms || 0,
              bathrooms: u.bathrooms || 1,
              area: u.area || 0,
              rent_price: u.rent_price,
              sale_price: u.sale_price,
              status: u.status || "available",
              furnished: u.furnished || false,
              description: u.description,
              images: u.images,
            })));
          }
          
          // Pre-fill form
          setFormData({
            title: data.title || "",
            description: data.description || "",
            price: (data.price ?? 0).toString(),
            price_type: data.price_type ?? "rent",
            currency: (data.currency as "RWF" | "USD") || "RWF",
            property_type: data.property_type || "",
            location: data.location || "",
            latitude: data.latitude?.toString() || "",
            longitude: data.longitude?.toString() || "",
            bedrooms: data.bedrooms.toString(),
            bathrooms: data.bathrooms.toString(),
            area: data.area.toString(),
            // Text features (not yet used in UI for edit)
            features: [],
            // Map boolean feature flags from existing property
            furnished: data.furnished ?? false,
            parking: data.parking ?? false,
            security: data.security ?? false,
            generator: data.generator ?? false,
            amenities: data.amenities || [],
            status: (
              data.status === 'available' ||
              data.status === 'reserved' ||
              data.status === 'sold' ||
              data.status === 'rented' ||
              data.status === 'off_plan'
            )
              ? data.status
              : 'available',
            images: data.images || [],
          });
        } else {
          setError("Property not found");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

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

    // Validate required fields
    if (!formData.title || !formData.location) {
      setError("Please fill in all required fields (Title, Location)");
      setSaving(false);
      return;
    }

    // Validate based on property type
    if (hasMultipleUnits) {
      if (units.length === 0) {
        setError("Please add at least one unit for this building");
        setSaving(false);
        return;
      }
      // Validate each unit
      for (const unit of units) {
        // Units are optional - no validation needed
        // All unit fields (unit_number, bedrooms, bathrooms, area, prices) are optional
      }
    } else {
      if (!formData.price) {
        setError("Please provide a price for this property");
        setSaving(false);
        return;
      }
    }

    try {
      // Prepare data for API
      const propertyData: any = {
        title: formData.title,
        description: formData.description || null,
        property_type: formData.property_type || null,
        location: formData.location,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        furnished: formData.furnished,
        parking: formData.parking,
        security: formData.security,
        generator: formData.generator,
        amenities: formData.amenities,
        status: formData.status,
        images: formData.images,
      };

      // Add price/price_type/currency only if NOT a building with units
      if (!hasMultipleUnits) {
        propertyData.price = parseFloat(formData.price);
        propertyData.price_type = formData.price_type;
        propertyData.currency = formData.currency;
        propertyData.units = []; // Clear units if switching to single property
      } else {
        // For buildings with units, price is null but price_type is still needed for badge
        propertyData.price = null;
        propertyData.price_type = formData.price_type; // Keep price_type for badge display
        propertyData.currency = formData.currency; // Currency applies to the building and its units
        propertyData.units = units;
      }

      const response = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        router.push(`/dashboard/properties?success=Property updated successfully`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update property");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-gray-600">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <h2 className="text-2xl font-bold text-dark mb-2">Property Not Found</h2>
        <p className="text-gray-600 mb-6">{error || "The property you're looking for doesn't exist."}</p>
        <Link
          href="/dashboard/properties"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/properties"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <i className="fas fa-arrow-left"></i> Back to Properties
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">Edit Property</h1>
        <p className="text-gray-600">Update the property details below</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-dark">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  placeholder="e.g., Greenland Plaza 2BR Apartment"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-dark">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none resize-y"
                  placeholder="Describe the property in detail..."
                />
              </div>

              {/* Building Type Toggle */}
              <div className="md:col-span-2">
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

              {/* Price fields - only show if NOT a building with units */}
              {!hasMultipleUnits && (
                <>
                  <div>
                    <label className="block font-semibold mb-2 text-dark">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    >
                      <option value="RWF">RWF (Rwandan Franc)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-dark">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                      placeholder={formData.currency === "USD" ? "800.00" : "800000"}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-dark">
                      Price Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="price_type"
                      value={formData.price_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    >
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                      <option value="rent_and_sale">For Rent & Sale</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold mb-2 text-dark">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="duplex">Duplex</option>
                  <option value="bungalow">Bungalow</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-dark">
                  Full Address / Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  minLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  placeholder="e.g., KG 123 St, Kimihurura, Kigali, Rwanda"
                />
                <p className="mt-1 text-xs text-gray-500">
                  <i className="fas fa-info-circle mr-1"></i>
                  Please provide the complete, real address that can be easily searched on maps (e.g., street name, neighborhood, city, country)
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-dark">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                >
                  <option value="available">Available</option>
                  <option value="off_plan">Off-plan Project</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coordinates - Optional */}
          <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2 mb-3">
              <i className="fas fa-map-marker-alt text-blue-600 mt-1"></i>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Map Coordinates (Optional)</h3>
                <p className="text-xs text-blue-700">
                  Add coordinates for accurate map display. Get from Google Maps: Right-click property → "What's here?" → Copy coordinates
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-2 text-dark">
                  Latitude (Optional)
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  placeholder="e.g., -1.9441"
                />
                <p className="mt-1 text-xs text-gray-600">
                  <i className="fas fa-info-circle mr-1"></i>
                  Get from Google Maps: Right-click property → "What's here?" → Copy coordinates
                </p>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-dark">
                  Longitude (Optional)
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  placeholder="e.g., 30.0619"
                />
                <p className="mt-1 text-xs text-gray-600">
                  <i className="fas fa-info-circle mr-1"></i>
                  Get from Google Maps: Right-click property → "What's here?" → Copy coordinates
                </p>
              </div>
            </div>
          </div>

          {/* Units Management - only show if building with multiple units */}
          {hasMultipleUnits && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-4">Building Units</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Add all available units in this building. Each unit can have different sizes, prices, and availability.
              </p>
              
              {/* Currency and Price Type for Building with Units */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label className="block font-semibold mb-2 text-dark">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  >
                    <option value="RWF">RWF (Rwandan Franc)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">Default currency for all units</p>
                </div>
                
                <div>
                  <label className="block font-semibold mb-2 text-dark">
                    Price Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="price_type"
                    value={formData.price_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
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
            <div>
              <h2 className="text-xl font-bold text-dark mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-dark">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-dark">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-dark">Area (m²)</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    placeholder="120"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary"
                />
                <span className="font-medium">Furnished</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formData.parking}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary"
                />
                <span className="font-medium">Parking</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  name="security"
                  checked={formData.security}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary"
                />
                <span className="font-medium">Security</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  name="generator"
                  checked={formData.generator}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary"
                />
                <span className="font-medium">Generator</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">Amenities</h2>
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
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="e.g., WiFi Ready, Swimming Pool"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-plus"></i> Add
              </button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center gap-2"
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
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">Property Images</h2>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
              maxImages={10}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Updating Property...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Update Property
                </>
              )}
            </button>
            <Link
              href="/dashboard/properties"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
