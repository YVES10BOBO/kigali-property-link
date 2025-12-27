"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { mockProperties } from "@/lib/mock-data/properties";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilters, { FilterState } from "@/components/property/PropertyFilters";

export default function PropertiesPageClient() {
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    propertyType: searchParams.get("propertyType") || "",
    location: searchParams.get("location") || "",
    purpose: searchParams.get("purpose") || "",
    priceRange: searchParams.get("priceRange") || "",
    sortBy: "newest",
  });

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

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...mockProperties];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.location.toLowerCase().includes(searchLower)
      );
    }

    // Purpose filter (rent/sale)
    if (filters.purpose) {
      filtered = filtered.filter((p) => p.priceType === filters.purpose);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter((p) => p.location.includes(filters.location));
    }

    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange === "1200+") {
        filtered = filtered.filter((p) => p.price >= 1200);
      } else {
        const [min, max] = filters.priceRange.split("-");
        if (min && max) {
          filtered = filtered.filter((p) => p.price >= parseInt(min) && p.price <= parseInt(max));
        }
      }
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "area-large":
        filtered.sort((a, b) => b.area - a.area);
        break;
      default:
        // newest first (keep original order)
        break;
    }

    return filtered;
  }, [filters]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark mb-2">All Properties</h1>
        <p className="text-gray-600">
          Discover {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} in Kigali
        </p>
      </div>

      {/* Filters */}
      <PropertyFilters filters={filters} onFilterChange={setFilters} />

      {/* Results Count */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16">
          <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-bold text-dark mb-2">No Properties Found</h2>
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
      ) : (
        <>
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          {/* Results Info */}
          <div className="text-center text-gray-600">
            Showing {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"}
          </div>
        </>
      )}
    </>
  );
}

