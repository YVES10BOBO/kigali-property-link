import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import PropertyDetailClient from "./PropertyDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
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
