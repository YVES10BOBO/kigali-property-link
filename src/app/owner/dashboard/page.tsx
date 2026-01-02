"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Property } from "@/types/property";

export default function OwnerDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push("/login?redirect=/owner/dashboard");
          return;
        }
        
        setUser(currentUser);

        // Fetch properties owned by this user
        const { data: propertiesData, error } = await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching properties:", error);
        } else {
          setProperties(propertiesData || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      pending_approval: { text: "Pending Approval", className: "bg-yellow-100 text-yellow-800" },
      available: { text: "Available", className: "bg-green-100 text-green-800" },
      reserved: { text: "Reserved", className: "bg-blue-100 text-blue-800" },
      sold: { text: "Sold", className: "bg-gray-100 text-gray-800" },
      rented: { text: "Rented", className: "bg-gray-100 text-gray-800" },
      unverified: { text: "Unverified", className: "bg-orange-100 text-orange-800" },
      rejected: { text: "Rejected", className: "bg-red-100 text-red-800" },
      needs_revision: { text: "Needs Revision", className: "bg-yellow-100 text-yellow-800" },
    };
    
    const badge = badges[status] || { text: status, className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your properties...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600 mt-2">Manage your property listings</p>
            </div>
            <Link
              href="/owner/properties/add"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              List New Property
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
            <div className="text-gray-600 text-sm">Total Properties</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">
              {properties.filter(p => p.status === "available").length}
            </div>
            <div className="text-gray-600 text-sm">Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {properties.filter(p => p.status === "pending_approval").length}
            </div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-gray-600">
              {properties.filter(p => p.status === "sold" || p.status === "rented").length}
            </div>
            <div className="text-gray-600 text-sm">Sold/Rented</div>
          </div>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
            <p className="text-gray-600 mb-6">Start by listing your first property</p>
            <Link
              href="/owner/properties/add"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="h-12 w-12 rounded-lg object-cover mr-3"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                              <i className="fas fa-home text-gray-400"></i>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.bedrooms} bed, {property.bathrooms} bath
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${property.price.toLocaleString()} / {property.price_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.created_at
                          ? new Date(property.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/owner/properties/edit/${property.id}`}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Link>
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-gray-600 hover:text-gray-900"
                          target="_blank"
                        >
                          <i className="fas fa-external-link-alt"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
