"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/property";
import { PropertyCardFromDB } from "@/components/property/PropertyCard";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login?redirect=/client/favorites");
        return;
      }

      // Get favorite property IDs
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('property_favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (favoriteError) {
        console.error('Error fetching favorites:', favoriteError);
        setLoading(false);
        return;
      }

      if (!favoriteData || favoriteData.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Fetch property details
      const propertyIds = favoriteData.map(f => f.property_id);
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds)
        .eq('status', 'available'); // Only show available properties

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
      } else {
        setFavorites(properties || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading favorites...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600 mt-2">Properties you've saved</p>
            </div>
            <Link
              href="/client"
              className="text-primary hover:text-primary-dark"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <i className="fas fa-heart text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
            <p className="text-gray-600 mb-6">Start saving properties you like!</p>
            <Link
              href="/properties"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-gray-600">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <PropertyCardFromDB key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
