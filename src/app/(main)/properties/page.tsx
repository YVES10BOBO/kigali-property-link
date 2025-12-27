import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import PropertiesPageClient from "./PropertiesPageClient";

export default function PropertiesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-custom py-8 md:py-12">
        <Suspense fallback={<div className="text-center py-12">Loading properties...</div>}>
          <PropertiesPageClient />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
