"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden">
        <Image
          src={images[selectedImage]}
          alt={`${title} - Image ${selectedImage + 1}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-primary scale-105"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
