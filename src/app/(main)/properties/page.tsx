import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import PropertiesPageClient from "./PropertiesPageClient";

export const metadata: Metadata = {
  title: "Properties for Rent and Sale in Kigali",
  description: "Browse our extensive collection of properties for rent and sale in Kigali, Rwanda. Find apartments, houses, studios, penthouses, and villas in prime locations.",
  openGraph: {
    title: "Properties for Rent and Sale in Kigali",
    description: "Browse our extensive collection of properties for rent and sale in Kigali, Rwanda.",
  },
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Extra top padding so content is clearly below fixed navbar */}
      <main className="container-custom pt-28 pb-12">
        <Suspense fallback={<LoadingSpinner size="lg" text="Loading properties..." fullScreen />}>
          <PropertiesPageClient />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
