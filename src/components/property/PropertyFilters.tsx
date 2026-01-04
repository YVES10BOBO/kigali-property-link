"use client";

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  search: string;
  propertyType: string;
  location: string;
  purpose: string;
  priceRange: string;
  sortBy: string;
}

export default function PropertyFilters({ onFilterChange, filters }: PropertyFiltersProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block font-semibold mb-2 text-sm text-dark">Search</label>
          <input
            type="text"
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-sm text-dark">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleChange("propertyType", e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="">All Types</option>
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
          <label className="block font-semibold mb-2 text-sm text-dark">Location</label>
          <select
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="">All Locations</option>
            <option value="Kimihurura">Kimihurura</option>
            <option value="Nyarutarama">Nyarutarama</option>
            <option value="Kacyiru">Kacyiru</option>
            <option value="Remera">Remera</option>
            <option value="Kicukiro">Kicukiro</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-sm text-dark">Purpose</label>
          <select
            value={filters.purpose}
            onChange={(e) => handleChange("purpose", e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="">Rent or Buy</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-sm text-dark">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="area-large">Largest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
