export interface Property {
  id: string;
  title: string;
  price: number;
  priceType: "rent" | "sale";
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];
  badge: "rent" | "sale";
  description?: string;
  amenities?: string[];
  furnished?: boolean;
  parking?: boolean;
  security?: boolean;
  generator?: boolean;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Greenland Plaza 2BR Apartment",
    price: 800,
    priceType: "rent",
    location: "Kimihurura, Kigali",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    badge: "rent",
    description: "Beautiful 2-bedroom apartment in the prestigious Greenland Plaza. This modern apartment features spacious rooms, modern finishes, and stunning views of Kigali. Perfect for professionals or small families looking for a comfortable living space in the heart of Kimihurura.",
    amenities: ["Fully Furnished", "Parking Available", "24/7 Security", "Generator Backup", "WiFi Ready", "Balcony"],
    furnished: true,
    parking: true,
    security: true,
    generator: true,
  },
  {
    id: "2",
    title: "Greenland Plaza 3BR Penthouse",
    price: 150000,
    priceType: "sale",
    location: "Kimihurura, Kigali",
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    badge: "sale",
    description: "Luxurious 3-bedroom penthouse with panoramic city views. This premium property features high-end finishes, spacious living areas, and exclusive access to building amenities. A perfect investment opportunity in one of Kigali's most sought-after locations.",
    amenities: ["Fully Furnished", "Parking Available", "24/7 Security", "Generator Backup", "Swimming Pool Access", "Gym Access"],
    furnished: true,
    parking: true,
    security: true,
    generator: true,
  },
  {
    id: "3",
    title: "Modern Studio Apartment",
    price: 450,
    priceType: "rent",
    location: "Kacyiru, Kigali",
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600",
    badge: "rent",
  },
  {
    id: "4",
    title: "Luxury Villa with Pool",
    price: 280000,
    priceType: "sale",
    location: "Nyarutarama, Kigali",
    bedrooms: 4,
    bathrooms: 4,
    area: 350,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
    badge: "sale",
  },
  {
    id: "5",
    title: "Executive 3BR Apartment",
    price: 1200,
    priceType: "rent",
    location: "Remera, Kigali",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    badge: "rent",
  },
  {
    id: "6",
    title: "Phoenix Plaza 1BR Suite",
    price: 600,
    priceType: "rent",
    location: "Kicukiro, Kigali",
    bedrooms: 1,
    bathrooms: 1,
    area: 75,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
    badge: "rent",
  },
];

