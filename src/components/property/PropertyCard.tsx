"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Property, formatPropertyForDisplay } from "@/types/property";
import { formatPrice } from "@/lib/currency";
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
  price: number | null; // Allow null for properties without prices
  priceType: "rent" | "sale" | "rent_and_sale";
  currency?: "RWF" | "USD"; // Currency for the property
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  badge: "rent" | "sale" | "rent_and_sale";
  status?: string;
  hasUnits?: boolean;
  units?: Array<{
    bedrooms: number;
    bathrooms: number;
    area: number;
    rent_price?: number | null;
    sale_price?: number | null;
    currency?: "RWF" | "USD";
    status: string;
  }>;
  priceLabel?: string; // For displaying price ranges
}

// Support both old format and new Property type
export function PropertyCardFromDB({ property }: { property: Property }) {
  const formatted = formatPropertyForDisplay(property);
  return (
    <PropertyCard 
      {...formatted} 
      currency={formatted.currency || property.currency || "RWF"}
      status={property.status}
      hasUnits={formatted.hasUnits}
      units={formatted.units}
      priceLabel={formatted.priceLabel}
    />
  );
}

export default function PropertyCard({
  id,
  title,
  price,
  priceType,
  currency = "RWF",
  location,
  bedrooms,
  bathrooms,
  area,
  image,
  badge,
  status,
  hasUnits = false,
  units = [],
  priceLabel,
}: PropertyCardProps) {
  const router = useRouter();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const favorited = isFavorited(id);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
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
          {/* Badge - Use badge prop (from property.price_type) if available, otherwise check units */}
          {(() => {
            // If badge is set (from property.price_type), use it
            if (badge && (badge === "rent" || badge === "sale" || badge === "rent_and_sale")) {
              return (
                <span
                  className={`absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-semibold text-white shadow-lg ${
                    badge === "rent" ? "bg-primary" 
                    : badge === "sale" ? "bg-secondary"
                    : "bg-gradient-to-r from-primary to-secondary"
                  }`}
                >
                  {badge === "rent" ? "For Rent" 
                   : badge === "sale" ? "For Sale"
                   : "For Rent & Sale"}
                </span>
              );
            }
            
            // Otherwise, check units for rent/sale prices
            if (hasUnits && units.length > 0) {
              const availableUnits = units.filter(u => u.status === 'available');
              const hasRentUnits = availableUnits.some(u => u.rent_price && u.rent_price > 0);
              const hasSaleUnits = availableUnits.some(u => u.sale_price && u.sale_price > 0);
              
              if (hasRentUnits && hasSaleUnits) {
                return (
                  <span className="absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary shadow-lg">
                    For Rent & Sale
                  </span>
                );
              } else if (hasRentUnits) {
                return (
                  <span className="absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-semibold text-white bg-primary shadow-lg">
                    For Rent
                  </span>
                );
              } else if (hasSaleUnits) {
                return (
                  <span className="absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-semibold text-white bg-secondary shadow-lg">
                    For Sale
                  </span>
                );
              }
            }
            
            // Fallback for single properties
            return (
              <span
                className={`absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-semibold text-white shadow-lg ${
                  badge === "rent" ? "bg-primary" 
                  : badge === "sale" ? "bg-secondary"
                  : "bg-gradient-to-r from-primary to-secondary"
                }`}
              >
                {badge === "rent" ? "For Rent" 
                 : badge === "sale" ? "For Sale"
                 : "For Rent & Sale"}
              </span>
            );
          })()}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
            {status === "off_plan" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-md">
                <span className="h-2 w-2 rounded-full bg-white/80" />
                Off‑plan Project
              </span>
            )}
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
          {/* Price Display */}
          <div className="text-2xl font-bold text-primary mb-2">
            {hasUnits && priceLabel ? (
              <span>{priceLabel}</span>
            ) : price && price > 0 ? (
              formatPrice(price, priceType, currency)
            ) : null}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-dark mb-2">
            <AutoTranslatedText text={title} from="en" />
          </h3>
          
          {/* Location */}
          <p className="text-gray-500 text-sm mb-3 flex items-center">
            <FaMapMarkerAlt className="text-secondary mr-2" />
            <AutoTranslatedText text={location} from="en" />
          </p>
          
          {/* Units Summary for Buildings - Show FIRST unit's features */}
          {hasUnits && units.length > 0 ? (
            (() => {
              const availableUnits = units.filter(u => u.status === 'available');
              if (availableUnits.length === 0) return null;
              
              // Get FIRST unit (the first one added/selected)
              const firstUnit = availableUnits[0];
              
              const hasRent = availableUnits.some(u => u.rent_price);
              const hasSale = availableUnits.some(u => u.sale_price);
              
              return (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  {/* Show FIRST unit's features - Only show if > 0 */}
                  {(firstUnit.bedrooms > 0 || firstUnit.bathrooms > 0 || firstUnit.area > 0) && (
                    <div className="flex gap-6">
                      {firstUnit.bedrooms > 0 && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FaBed className="text-primary" />
                          {firstUnit.bedrooms} Beds
                        </div>
                      )}
                      {firstUnit.bathrooms > 0 && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FaBath className="text-primary" />
                          {firstUnit.bathrooms} Baths
                        </div>
                      )}
                      {firstUnit.area > 0 && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FaRulerCombined className="text-primary" />
                          {firstUnit.area} m²
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {availableUnits.length} unit{availableUnits.length !== 1 ? 's' : ''} available
                    </p>
                    {(hasRent && hasSale) && (
                      <span className="text-xs bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded-full font-semibold">
                        Rent & Sale
                      </span>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            /* Single Property Details - Only show if > 0 */
            (bedrooms > 0 || bathrooms > 0 || area > 0) && (
              <div className="flex gap-6 pt-4 border-t border-gray-200">
                {bedrooms > 0 && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaBed className="text-primary" />
                    {bedrooms} Beds
                  </div>
                )}
                {bathrooms > 0 && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaBath className="text-primary" />
                    {bathrooms} Baths
                  </div>
                )}
                {area > 0 && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaRulerCombined className="text-primary" />
                    {area} m²
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </Link>
  );
}
