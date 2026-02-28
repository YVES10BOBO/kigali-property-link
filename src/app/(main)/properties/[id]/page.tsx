import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import PropertyDetailClient from "./PropertyDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

import { absoluteUrl } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  
  try {
    const { data: property } = await supabase
      .from('properties')
      .select('title, description, images, price, price_type, location')
      .eq('id', id)
      .single();

    if (!property) {
      return {
        title: "Property Not Found",
        description: "The property you're looking for doesn't exist.",
      };
    }

    const imageUrl = absoluteUrl(
      property.images && property.images.length > 0
        ? property.images[0]
        : '/images/default-property.jpg'
    );

    const title = `${property.title} - ${property.price_type === 'rent' ? 'For Rent' : 'For Sale'}`;
    const description =
      property.description ||
      `${property.title} located in ${property.location}. ${
        property.price_type === 'rent' ? 'Available for rent' : 'Available for sale'
      } at $${property.price.toLocaleString()}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description: property.description || `${property.title} in ${property.location}`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "Property Details",
      description: "View property details",
    };
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-custom py-8 md:py-12">
        <PropertyDetailClient id={id} />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
