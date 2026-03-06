import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Real Estate Blog - BridgeProperties",
  description: "Stay updated with the latest real estate news, property tips, and market insights in Kigali, Rwanda.",
  openGraph: {
    title: "Real Estate Blog - BridgeProperties",
    description: "Stay updated with the latest real estate news and property tips in Kigali.",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container-custom pt-28 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-dark mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest real estate news, tips, and insights about Kigali&apos;s property market
          </p>
        </div>

        <BlogPageClient />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
