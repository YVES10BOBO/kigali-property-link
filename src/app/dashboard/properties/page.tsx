"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Property } from "@/types/property";

export default function ManagePropertiesPage() {
  // Replace `useSearchParams` (which can cause CSR bailout during prerender)
  // with a simple client-side read of `window.location.search` inside useEffect.
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]); // Store all for counts
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priceType: "all",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
    propertyType: "",
  });
  
  // Bulk actions
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const success = params.get("success");
      if (success) {
        setSuccessMessage(success);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (e) {
      // ignore on servers or if no window
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.priceType, filters.priceMin, filters.priceMax, filters.dateFrom, filters.dateTo, filters.propertyType]);

  const fetchProperties = async () => {
    try {
      // Build query params from filters
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.priceType && filters.priceType !== 'all') params.append('price_type', filters.priceType);
      if (filters.priceMin) params.append('price_min', filters.priceMin);
      if (filters.priceMax) params.append('price_max', filters.priceMax);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.propertyType) params.append('property_type', filters.propertyType);
      params.append('admin', 'true'); // Flag to get all properties, not just available
      
      const url = `/api/properties?${params.toString()}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
        setAllProperties(data); // Store all for counts
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.priceType, filters.priceMin, filters.priceMax, filters.dateFrom, filters.dateTo, filters.propertyType]);

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

  // Apply status filter from tabs
  const filteredProperties = filter === "all"
    ? properties
    : properties.filter((p) => p.status === filter);
  
  // Bulk actions
  const toggleSelectProperty = (id: string) => {
    const newSelected = new Set(selectedProperties);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProperties(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProperties.size === filteredProperties.length) {
      setSelectedProperties(new Set());
    } else {
      setSelectedProperties(new Set(filteredProperties.map((p) => p.id)));
    }
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedProperties.size === 0) return;

    try {
      const updates = Array.from(selectedProperties).map((id) =>
        fetch(`/api/properties/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        })
      );

      await Promise.all(updates);
      setSuccessMessage(`Updated ${selectedProperties.size} property status to ${bulkStatus}`);
      setSelectedProperties(new Set());
      setBulkStatus("");
      fetchProperties();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      alert("Failed to update properties. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProperties.size} property(ies)? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletes = Array.from(selectedProperties).map((id) =>
        fetch(`/api/properties/${id}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deletes);
      setSuccessMessage(`Deleted ${selectedProperties.size} property(ies)`);
      setSelectedProperties(new Set());
      fetchProperties();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      alert("Failed to delete properties. Please try again.");
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.priceType && filters.priceType !== 'all') params.append('price_type', filters.priceType);
      if (filters.priceMin) params.append('price_min', filters.priceMin);
      if (filters.priceMax) params.append('price_max', filters.priceMax);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.propertyType) params.append('property_type', filters.propertyType);
      params.append('admin', 'true');
      
      const response = await fetch(`/api/properties/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `properties-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccessMessage('Properties exported successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      alert('Failed to export properties. Please try again.');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      priceType: "all",
      priceMin: "",
      priceMax: "",
      dateFrom: "",
      dateTo: "",
      propertyType: "",
    });
    setFilter("all");
  };
  
  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.priceType !== 'all' || filters.priceMin || filters.priceMax || filters.dateFrom || filters.dateTo || filters.propertyType;

  const formatPrice = (price: number, priceType: string) => {
    if (priceType === "rent") {
      return `$${price.toLocaleString()}/month`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Manage Properties</h1>
          <p className="text-gray-600">Add, edit, and manage your property listings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-download"></i>
            Export CSV
          </button>
          <Link
            href="/dashboard/properties/add"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Add Property
          </Link>
        </div>
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

      {/* Property Analytics Summary */}
      {!loading && (allProperties.length > 0 || properties.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Properties</p>
                <p className="text-2xl font-bold text-dark">{allProperties.length || properties.length}</p>
              </div>
              <i className="fas fa-home text-2xl text-primary"></i>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available</p>
                <p className="text-2xl font-bold text-dark">
                  {(allProperties.length > 0 ? allProperties : properties).filter((p) => p.status === "available").length}
                </p>
              </div>
              <i className="fas fa-check-circle text-2xl text-green-500"></i>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Reserved</p>
                <p className="text-2xl font-bold text-dark">
                  {(allProperties.length > 0 ? allProperties : properties).filter((p) => p.status === "reserved").length}
                </p>
              </div>
              <i className="fas fa-clock text-2xl text-yellow-500"></i>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sold/Rented</p>
                <p className="text-2xl font-bold text-dark">
                  {(allProperties.length > 0 ? allProperties : properties).filter((p) => p.status === "sold" || p.status === "rented").length}
                </p>
              </div>
              <i className="fas fa-tag text-2xl text-red-500"></i>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties by title or location..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 pl-10 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => {
              setFilters({ ...filters, status: "all" });
              setFilter("all");
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all" && filters.status === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({allProperties.length || properties.length})
          </button>
          <button
            onClick={() => {
              setFilters({ ...filters, status: "available" });
              setFilter("available");
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "available"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Available ({allProperties.filter((p) => p.status === "available").length || properties.filter((p) => p.status === "available").length})
          </button>
          <button
            onClick={() => {
              setFilters({ ...filters, status: "reserved" });
              setFilter("reserved");
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "reserved"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Reserved ({allProperties.filter((p) => p.status === "reserved").length || properties.filter((p) => p.status === "reserved").length})
          </button>
          <button
            onClick={() => {
              setFilters({ ...filters, status: "sold" });
              setFilter("sold");
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "sold"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sold ({allProperties.filter((p) => p.status === "sold").length || properties.filter((p) => p.status === "sold").length})
          </button>
          <button
            onClick={() => {
              setFilters({ ...filters, status: "rented" });
              setFilter("rented");
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "rented"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rented ({allProperties.filter((p) => p.status === "rented").length || properties.filter((p) => p.status === "rented").length})
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-primary font-semibold hover:underline flex items-center gap-2"
          >
            <i className={`fas fa-${showAdvancedFilters ? "chevron-up" : "chevron-down"}`}></i>
            {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              <i className="fas fa-times mr-1"></i>
              Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Type</label>
              <select
                value={filters.priceType}
                onChange={(e) => setFilters({ ...filters, priceType: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              >
                <option value="all">All Types</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="studio">Studio</option>
                <option value="penthouse">Penthouse</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>

            {/* Price Min */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price ($)</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="0"
              />
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price ($)</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                placeholder="1000000"
              />
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
              />
            </div>
          </div>
        )}
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
        <div className="space-y-4">
          {/* Bulk Actions Toolbar */}
          {selectedProperties.size > 0 && (
            <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-dark">
                  {selectedProperties.size} property(ies) selected
                </span>
                <button
                  onClick={() => setSelectedProperties(new Set())}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                >
                  <option value="">Change status to...</option>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
                <button
                  onClick={handleBulkStatusUpdate}
                  disabled={!bulkStatus}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-sync mr-2"></i>
                  Update Status
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Select All Checkbox */}
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedProperties.size === filteredProperties.length && filteredProperties.length > 0}
              onChange={toggleSelectAll}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="font-semibold text-dark">
              Select all ({filteredProperties.length} properties)
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative ${
                  selectedProperties.has(property.id) ? "ring-2 ring-primary" : ""
                }`}
              >
                {/* Checkbox */}
                <div className="absolute top-4 left-4 z-10 bg-white rounded p-1 shadow-sm">
                  <input
                    type="checkbox"
                    checked={selectedProperties.has(property.id)}
                    onChange={() => toggleSelectProperty(property.id)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
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
        </div>
      )}
    </div>
  );
}
