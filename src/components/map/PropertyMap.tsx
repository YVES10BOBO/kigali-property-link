"use client";

import { useEffect, useRef, useState } from "react";
import { Property } from "@/types/property";

interface PropertyMapProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (property: Property) => void;
  selectedPropertyId?: string;
}

export default function PropertyMap({
  properties,
  center,
  zoom = 12,
  height = "500px",
  onMarkerClick,
  selectedPropertyId,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      // avoid synchronous setState inside effect
      setTimeout(() => setIsLoaded(true), 0);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;

    const defaultCenter = center || { lat: -1.9441, lng: 30.0619 }; // Kigali center

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: zoom,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    setMap(mapInstance);
  }, [isLoaded, center, zoom]);

  // Add markers for properties
  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Clear existing markers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    markers.forEach((marker: any) => marker.setMap(null));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newMarkers: any[] = [];

    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return;

      const position = {
        lat: Number(property.latitude),
        lng: Number(property.longitude),
      };

      const isSelected = property.id === selectedPropertyId;

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: property.title,
        icon: isSelected
          ? {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }
          : {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(32, 32),
            },
        animation: isSelected
          ? window.google.maps.Animation.BOUNCE
          : undefined,
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${property.title}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${property.location}</p>
            <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #0d9488;">
              $${(property.price ?? 0).toLocaleString()}${property.price_type === "rent" ? "/month" : ""}
            </p>
            <div style="display: flex; gap: 12px; font-size: 12px; color: #666;">
              <span>${property.bedrooms} bed</span>
              <span>${property.bathrooms} bath</span>
              <span>${property.area}m²</span>
            </div>
            ${onMarkerClick ? `<button onclick="window.selectProperty('${property.id}')" style="margin-top: 8px; padding: 6px 12px; background: #0d9488; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">View Details</button>` : ""}
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        if (onMarkerClick) {
          onMarkerClick(property);
        }
      });

      newMarkers.push(marker);
    });

    // avoid synchronous setState within effect
    setTimeout(() => setMarkers(newMarkers), 0);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);
    }

    // Store selectProperty function globally for info window buttons
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).selectProperty = (propertyId: string) => {
      const property = properties.find((p) => p.id === propertyId);
      if (property && onMarkerClick) {
        onMarkerClick(property);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, properties, selectedPropertyId, onMarkerClick]);

  if (!isLoaded) {
    return (
      <div
        style={{ height }}
        className="bg-gray-100 rounded-lg flex items-center justify-center"
      >
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ height, width: "100%" }}
      className="rounded-lg overflow-hidden"
    />
  );
}
