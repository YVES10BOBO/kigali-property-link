import { Property } from "@/types/property";
import ImageGallery from "@/components/shared/ImageGallery";
import { PropertyCardFromDB } from "./PropertyCard";

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
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
            <h1 className="text-4xl font-bold text-dark mb-2">{property.title}</h1>
            <p className="text-gray-600 flex items-center">
              <i className="fas fa-map-marker-alt text-secondary mr-2"></i>
              {property.location}
            </p>
          </div>
          <span
            className={`px-6 py-2 rounded-full text-lg font-semibold text-white ${
              property.price_type === "rent" ? "bg-primary" : "bg-secondary"
            }`}
          >
            {property.price_type === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>

        {/* Price */}
        <div className="text-5xl font-bold text-primary mb-6">
          ${property.price.toLocaleString()}
          {property.price_type === "rent" && (
            <span className="text-2xl font-normal text-gray-500">/month</span>
          )}
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-3 gap-6 p-6 bg-light rounded-xl">
          <div className="text-center">
            <i className="fas fa-bed text-3xl text-primary mb-2"></i>
            <div className="text-2xl font-bold text-dark">{property.bedrooms}</div>
            <div className="text-gray-600">Bedrooms</div>
          </div>
          <div className="text-center">
            <i className="fas fa-bath text-3xl text-primary mb-2"></i>
            <div className="text-2xl font-bold text-dark">{property.bathrooms}</div>
            <div className="text-gray-600">Bathrooms</div>
          </div>
          <div className="text-center">
            <i className="fas fa-ruler-combined text-3xl text-primary mb-2"></i>
            <div className="text-2xl font-bold text-dark">{property.area}</div>
            <div className="text-gray-600">Square Meters</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {property.description && (
        <div>
          <h2 className="text-2xl font-bold text-dark mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>
      )}

      {/* Amenities */}
      <div>
        <h2 className="text-2xl font-bold text-dark mb-4">Amenities & Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {property.amenities?.map((amenity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-light rounded-lg">
              <i className="fas fa-check-circle text-primary"></i>
              <span className="text-gray-700">{amenity}</span>
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
