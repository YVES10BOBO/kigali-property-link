"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Property } from "@/types/property";
import { PropertyCardFromDB } from "@/components/property/PropertyCard";
import PropertyFilters, { FilterState } from "@/components/property/PropertyFilters";
import PropertyMap from "@/components/map/PropertyMap";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  FaList,
  FaMap,
  FaSpinner,
  FaExclamationCircle,
  FaSearch,
} from "react-icons/fa";

export default function PropertiesPageClient() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyType: searchParams.get("propertyType") || "",
    location: searchParams.get("location") || "",
    purpose: searchParams.get("purpose") || "",
    priceRange: searchParams.get("priceRange") || "",
    sortBy: "newest",
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const router = useRouter();

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (filters.location) params.set("location", filters.location);
        if (filters.purpose) params.set("purpose", filters.purpose);
        if (filters.priceRange) params.set("priceRange", filters.priceRange);
        if (filters.search) params.set("search", filters.search);
        if (filters.propertyType) params.set("property_type", filters.propertyType);
        
        const response = await fetch(`/api/properties?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch properties");
        
        const data: Property[] = await response.json();
        
        // Sort client-side
        const sorted = [...data];
        switch (filters.sortBy) {
          case "price-low":
            sorted.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            sorted.sort((a, b) => b.price - a.price);
            break;
          case "area-large":
            sorted.sort((a, b) => b.area - a.area);
            break;
          default:
            // Keep server order (newest first)
            break;
        }
        
        setProperties(sorted);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load properties";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      search: "",
      propertyType: searchParams.get("propertyType") || "",
      location: searchParams.get("location") || "",
      purpose: searchParams.get("purpose") || "",
      priceRange: searchParams.get("priceRange") || "",
      sortBy: "newest",
    });
  }, [searchParams]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">{t.properties.title}</h1>
          <p className="text-gray-600">
            {loading ? "Loading..." : `Discover ${properties.length} ${properties.length === 1 ? "property" : "properties"} in Kigali`}
          </p>
      </div>

      {/* Filters */}
      <PropertyFilters filters={filters} onFilterChangeAction={setFilters} />

      {/* View Mode Toggle */}
      {!loading && !error && properties.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-600">
            Showing {properties.length} {properties.length === 1 ? "property" : "properties"}
          </div>
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaList className="mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center ${
                viewMode === "map"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaMap className="mr-2" />
              Map
            </button>
          </div>
        </div>
      )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <FaSpinner className="animate-spin text-4xl text-primary mb-4 mx-auto" />
            <p className="text-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <FaExclamationCircle className="text-4xl text-red-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-dark mb-2">Error Loading Properties</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && properties.length === 0 ? (
          <div className="text-center py-16">
            <FaSearch className="text-6xl text-gray-300 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-dark mb-2">
              {t.properties.noResults}
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters to see more results.
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  propertyType: "",
                  location: "",
                  purpose: "",
                  priceRange: "",
                  sortBy: "newest",
                })
              }
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : !loading && !error ? (
          <>
            {viewMode === "list" ? (
              <>
                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {properties.map((property) => (
                    <PropertyCardFromDB key={property.id} property={property} />
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Map View */}
                <div className="mb-8">
                  <PropertyMap
                    properties={properties.filter((p) => p.latitude && p.longitude)}
                    height="600px"
                    onMarkerClick={(property) => {
                      router.push(`/properties/${property.id}`);
                    }}
                  />
                </div>
                {/* Properties List Below Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCardFromDB key={property.id} property={property} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : null}
    </>
  );
}

