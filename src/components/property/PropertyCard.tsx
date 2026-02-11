"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Property, formatPropertyForDisplay } from "@/types/property";
import { useFavorites } from "@/hooks/useFavorites";
import AutoTranslatedText from "@/components/property/AutoTranslatedText";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  priceType: "rent" | "sale";
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  badge: "rent" | "sale";
}

// Support both old format and new Property type
export function PropertyCardFromDB({ property }: { property: Property }) {
  const formatted = formatPropertyForDisplay(property);
  return <PropertyCard {...formatted} />;
}

export default function PropertyCard({
  id,
  title,
  price,
  priceType,
  location,
  bedrooms,
  bathrooms,
  area,
  image,
  badge,
}: PropertyCardProps) {
  const router = useRouter();
  const { isFavorited, toggleFavorite, isAuthenticated } = useFavorites();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const favorited = isFavorited(id);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // User is authenticated, proceed with favorite
    toggleFavorite(id);
  };

  return (
    <Link href={`/properties/${id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          <span
            className={`absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-semibold text-white ${
              badge === "rent" ? "bg-primary" : "bg-secondary"
            }`}
          >
            {badge === "rent" ? "For Rent" : "For Sale"}
          </span>
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={handleHeartClick}
              className="bg-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors"
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              {favorited ? (
                <FaHeart className="text-red-500 text-lg transition-colors" />
              ) : (
                <FaRegHeart className="text-gray-600 text-lg transition-colors" />
              )}
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-2xl font-bold text-primary mb-2">
            ${price.toLocaleString()}
            {priceType === "rent" && <span className="text-base font-normal text-gray-500">/month</span>}
          </div>
          <h3 className="text-xl font-semibold text-dark mb-2">
            <AutoTranslatedText text={title} from="en" />
          </h3>
          <p className="text-gray-500 text-sm mb-4 flex items-center">
            <FaMapMarkerAlt className="text-secondary mr-2" />
            <AutoTranslatedText text={location} from="en" />
          </p>
          <div className="flex gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FaBed className="text-primary" />
              {bedrooms} Beds
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FaBath className="text-primary" />
              {bathrooms} Baths
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FaRulerCombined className="text-primary" />
              {area} m²
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
