"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/property";

export default function ComparePropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const propertyIds = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    
    if (propertyIds.length === 0) {
      setLoading(false);
      return;
    }

    fetchProperties(propertyIds);
  }, [searchParams]);

  const fetchProperties = async (ids: string[]) => {
    try {
      const promises = ids.map(id => 
        fetch(`/api/properties/${id}`).then(res => res.ok ? res.json() : null)
      );
      
      const results = await Promise.all(promises);
      const validProperties = results.filter(p => p !== null) as Property[];
      setProperties(validProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (id: string) => {
    const newIds = properties
      .filter(p => p.id !== id)
      .map(p => p.id)
      .join(',');
    
    if (newIds) {
      router.push(`/properties/compare?ids=${newIds}`);
    } else {
      router.push('/properties');
    }
  };

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

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="fas fa-balance-scale text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Properties to Compare</h2>
            <p className="text-gray-600 mb-6">Select properties to compare</p>
            <Link
              href="/properties"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Browse Properties
            </Link>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Compare Properties</h1>
              <p className="text-gray-600 mt-2">Side-by-side comparison</p>
            </div>
            <Link
              href="/properties"
              className="text-primary hover:text-primary-dark"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Properties
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Feature</th>
                  {properties.map((property) => (
                    <th key={property.id} className="px-6 py-4 text-left text-sm font-medium text-gray-700 min-w-[250px]">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                        <button
                          onClick={() => removeProperty(property.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                          title="Remove from comparison"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Images */}
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Image</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <i className="fas fa-home text-gray-400 text-3xl"></i>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Price */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Price</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <div className="text-2xl font-bold text-primary">
                        ${property.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {property.price_type === 'rent' ? 'per month' : 'total'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Description */}
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Description</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4 text-sm text-gray-600">
                      {property.description || 'No description'}
                    </td>
                  ))}
                </tr>

                {/* Bedrooms */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Bedrooms</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <i className="fas fa-bed text-primary mr-2"></i>
                      {property.bedrooms}
                    </td>
                  ))}
                </tr>

                {/* Bathrooms */}
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Bathrooms</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <i className="fas fa-bath text-primary mr-2"></i>
                      {property.bathrooms}
                    </td>
                  ))}
                </tr>

                {/* Area */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Area</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      {property.area} sq ft
                    </td>
                  ))}
                </tr>

                {/* Features */}
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Features</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {property.furnished && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Furnished</span>
                        )}
                        {property.parking && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Parking</span>
                        )}
                        {property.security && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Security</span>
                        )}
                        {property.generator && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Generator</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Amenities */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">Amenities</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      {property.amenities && property.amenities.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Actions</td>
                  {properties.map((property) => (
                    <td key={property.id} className="px-6 py-4">
                      <Link
                        href={`/properties/${property.id}`}
                        className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
