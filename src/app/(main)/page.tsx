import type { Metadata } from "next";
import { absoluteUrl, defaultOgImage } from "@/lib/metadata";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "BridgeProperties | Smart Real Estate in Rwanda",
  description:
    "Find your dream property in Kigali, Rwanda. Discover verified apartments, houses, land, and commercial properties for rent and sale. Verified listings, free viewings, 24/7 support.",
  keywords: [
    "BridgeProperties",
    "Rwanda properties",
    "real estate Rwanda",
    "apartments for rent Kigali",
    "houses for sale Kigali",
    "property rental Kigali",
    "Kigali real estate",
    "property for sale Rwanda",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: "BridgeProperties",
    title: "BridgeProperties | Find Your Dream Property in Kigali, Rwanda",
    description:
      "Discover verified apartments, houses, land, and commercial properties for rent and sale in Kigali, Rwanda. Verified listings, free viewings, 24/7 support.",
    images: [
      {
        url: defaultOgImage(),
        width: 1200,
        height: 630,
        alt: "BridgeProperties - Smart Real Estate in Rwanda",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BridgeProperties | Smart Real Estate in Rwanda",
    description:
      "Find your dream property in Kigali, Rwanda. Verified listings, free viewings, 24/7 support.",
    images: [defaultOgImage()],
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
