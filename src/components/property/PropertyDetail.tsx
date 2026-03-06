"use client";

import { Property } from "@/types/property";
import ImageGallery from "@/components/shared/ImageGallery";
import AutoTranslatedText from "@/components/property/AutoTranslatedText";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatPrice } from "@/lib/currency";

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const { t } = useLanguage();
  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["/images/default-property.jpg"];

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <ImageGallery images={images} title={property.title} />

      {/* Property Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-dark mb-2">
              <AutoTranslatedText text={property.title} from="en" />
            </h1>
            <p className="text-gray-600 flex items-center">
              <i className="fas fa-map-marker-alt text-secondary mr-2"></i>
              <AutoTranslatedText text={property.location} from="en" />
            </p>
          </div>
          {/* Badge - Show based on units or property price_type */}
          {property.units && property.units.length > 0 ? (
            (() => {
              const availableUnits = property.units.filter(u => u.status === 'available');
              const hasRentUnits = availableUnits.some(u => u.rent_price && u.rent_price > 0);
              const hasSaleUnits = availableUnits.some(u => u.sale_price && u.sale_price > 0);
              
              if (hasRentUnits && hasSaleUnits) {
                return (
                  <span className="px-6 py-2 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary">
                    For Rent & Sale
                  </span>
                );
              } else if (hasRentUnits) {
                return (
                  <span className="px-6 py-2 rounded-full text-lg font-semibold text-white bg-primary">
                    For Rent
                  </span>
                );
              } else if (hasSaleUnits) {
                return (
                  <span className="px-6 py-2 rounded-full text-lg font-semibold text-white bg-secondary">
                    For Sale
                  </span>
                );
              }
              return null;
            })()
          ) : (
            <span
              className={`px-6 py-2 rounded-full text-lg font-semibold text-white ${
                property.price_type === "rent" 
                  ? "bg-primary" 
                  : property.price_type === "sale"
                  ? "bg-secondary"
                  : "bg-gradient-to-r from-primary to-secondary"
              }`}
            >
              {property.price_type === "rent" 
                ? "For Rent" 
                : property.price_type === "sale"
                ? "For Sale"
                : "For Rent & Sale"}
            </span>
          )}
        </div>

        {/* Price Summary - For properties with units */}
        {property.units && property.units.length > 0 ? (
          <div className="mb-6">
            <div className="text-5xl font-bold text-primary mb-2">
              {(() => {
                const availableUnits = property.units.filter(u => u.status === 'available');
                const rentPrices = availableUnits.map(u => u.rent_price).filter((p): p is number => p !== null && p !== undefined);
                const salePrices = availableUnits.map(u => u.sale_price).filter((p): p is number => p !== null && p !== undefined);
                
                if (rentPrices.length > 0 && salePrices.length > 0) {
                  const minRent = Math.min(...rentPrices);
                  const minSale = Math.min(...salePrices);
                  const rentCurrency = availableUnits.find(u => u.rent_price)?.currency || property.currency || "RWF";
                  const saleCurrency = availableUnits.find(u => u.sale_price)?.currency || property.currency || "RWF";
                  return (
                    <div className="space-y-2">
                      <div>From {formatPrice(minRent, 'rent', rentCurrency)}</div>
                      <div className="text-2xl text-gray-600">From {formatPrice(minSale, 'sale', saleCurrency)}</div>
                    </div>
                  );
                } else if (rentPrices.length > 0) {
                  const minRent = Math.min(...rentPrices);
                  const rentCurrency = availableUnits.find(u => u.rent_price)?.currency || property.currency || "RWF";
                  return <div>From {formatPrice(minRent, 'rent', rentCurrency)}</div>;
                } else if (salePrices.length > 0) {
                  const minSale = Math.min(...salePrices);
                  const saleCurrency = availableUnits.find(u => u.sale_price)?.currency || property.currency || "RWF";
                  return <div>From {formatPrice(minSale, 'sale', saleCurrency)}</div>;
                }
                return null;
              })()}
            </div>
            {(property.units.some(u => u.status === 'available' && (u.rent_price || u.sale_price))) && (
              <p className="text-sm text-gray-600">See all unit prices and details in the table below</p>
            )}
          </div>
        ) : (
          <div className="text-5xl font-bold text-primary mb-6">
            {property.price && property.price > 0 ? (
              formatPrice(property.price, property.price_type, property.currency)
            ) : null}
          </div>
        )}

        {/* Key Features - Only show if at least one value > 0 */}
        {(property.bedrooms > 0 || property.bathrooms > 0 || property.area > 0) && (
          <div className={`grid gap-6 p-6 bg-light rounded-xl ${
            [property.bedrooms > 0, property.bathrooms > 0, property.area > 0].filter(Boolean).length === 1 
              ? 'grid-cols-1' 
              : [property.bedrooms > 0, property.bathrooms > 0, property.area > 0].filter(Boolean).length === 2
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}>
            {property.bedrooms > 0 && (
              <div className="text-center">
                <i className="fas fa-bed text-3xl text-primary mb-2"></i>
                <div className="text-2xl font-bold text-dark">{property.bedrooms}</div>
                <div className="text-gray-600">Bedrooms</div>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="text-center">
                <i className="fas fa-bath text-3xl text-primary mb-2"></i>
                <div className="text-2xl font-bold text-dark">{property.bathrooms}</div>
                <div className="text-gray-600">Bathrooms</div>
              </div>
            )}
            {property.area > 0 && (
              <div className="text-center">
                <i className="fas fa-ruler-combined text-3xl text-primary mb-2"></i>
                <div className="text-2xl font-bold text-dark">{property.area}</div>
                <div className="text-gray-600">Square Meters</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {property.description && (
        <div>
          <h2 className="text-2xl font-bold text-dark mb-4">{t.propertyDetail.description}</h2>
          <p className="text-gray-700 leading-relaxed">
            <AutoTranslatedText text={property.description} from="en" />
          </p>
        </div>
      )}

      {/* Available Units Section - for buildings with multiple units */}
      {property.units && property.units.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-dark mb-4">Available Units</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Beds</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Baths</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Area</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Rent</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Sale</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {property.units
                    .map((unit, index) => {
                      const unitType = unit.bedrooms === 0 ? 'Studio' : `${unit.bedrooms} Bedroom${unit.bedrooms > 1 ? 's' : ''}`;
                      return (
                        <tr key={unit.id || index} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-dark">{unit.unit_number || `Unit ${index + 1}`}</td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-medium">{unitType}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {unit.bedrooms > 0 ? (
                              <span className="inline-flex items-center gap-1">
                                <i className="fas fa-bed text-primary"></i>
                                {unit.bedrooms}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {unit.bathrooms > 0 ? (
                              <span className="inline-flex items-center gap-1">
                                <i className="fas fa-bath text-primary"></i>
                                {unit.bathrooms}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {unit.area > 0 ? (
                              <span className="inline-flex items-center gap-1">
                                <i className="fas fa-ruler-combined text-primary"></i>
                                {unit.area} m²
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-primary">
                            {unit.rent_price ? (
                              <span className="whitespace-nowrap">
                                {formatPrice(unit.rent_price, 'rent', unit.currency || property.currency || "RWF")}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-secondary">
                            {unit.sale_price ? (
                              <span className="whitespace-nowrap">
                                {formatPrice(unit.sale_price, 'sale', unit.currency || property.currency || "RWF")}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              unit.status === 'available' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : unit.status === 'reserved'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {unit.status === 'available' && <i className="fas fa-check-circle mr-1"></i>}
                              {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {property.units.filter(u => u.status === 'available').length === 0 && (
                <div className="px-6 py-12 text-center">
                  <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500 font-medium">No units currently available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Amenities */}
      <div>
        <h2 className="text-2xl font-bold text-dark mb-4">Amenities & Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.amenities?.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-light rounded-lg">
              <i className="fas fa-check-circle text-primary"></i>
              <span className="text-gray-700">
                <AutoTranslatedText text={amenity} from="en" />
              </span>
            </div>
          ))}
          {property.furnished && (
            <div className="flex items-center gap-3 p-3 bg-light rounded-lg">
              <i className="fas fa-check-circle text-primary"></i>
              <span className="text-gray-700">Fully Furnished</span>
            </div>
          )}
          {property.parking && (
            <div className="flex items-center gap-3 p-3 bg-light rounded-lg">
              <i className="fas fa-check-circle text-primary"></i>
              <span className="text-gray-700">Parking Available</span>
            </div>
          )}
          {property.security && (
            <div className="flex items-center gap-3 p-3 bg-light rounded-lg">
              <i className="fas fa-check-circle text-primary"></i>
              <span className="text-gray-700">24/7 Security</span>
            </div>
          )}
          {property.generator && (
            <div className="flex items-center gap-3 p-3 bg-light rounded-lg">
              <i className="fas fa-check-circle text-primary"></i>
              <span className="text-gray-700">Generator Backup</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
