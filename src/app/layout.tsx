import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kigalipropertieslink.com'),
  title: {
    default: "Kigali Properties Link | Find Your Dream Home in Kigali",
    template: "%s | Kigali Properties Link"
  },
  description: "Discover premium apartments, houses, and properties for rent and sale in Kigali, Rwanda. Browse exclusive listings at Greenland Plaza and other prime locations.",
  keywords: ["Kigali properties", "real estate Rwanda", "apartments for rent Kigali", "houses for sale Kigali", "property rental Kigali", "Greenland Plaza"],
  authors: [{ name: "Kigali Properties Link" }],
  creator: "Kigali Properties Link",
  publisher: "Kigali Properties Link",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kigalipropertieslink.com',
    siteName: "Kigali Properties Link",
    title: "Kigali Properties Link | Find Your Dream Home in Kigali",
    description: "Discover premium apartments, houses, and properties for rent and sale in Kigali, Rwanda.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kigali Properties Link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kigali Properties Link | Find Your Dream Home in Kigali",
    description: "Discover premium apartments, houses, and properties for rent and sale in Kigali, Rwanda.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

