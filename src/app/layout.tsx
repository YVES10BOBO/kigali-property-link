import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { defaultOgImage, absoluteUrl } from "@/lib/metadata";
import ToastProvider from "@/components/providers/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bridgeproperties.rw/"),
  title: {
    default: "BridgeProperties | Smart Real Estate in Rwanda",
    template: "%s | BridgeProperties"
  },
  description:
    "Discover verified apartments, houses, land, and commercial properties for rent and sale in Rwanda with BridgeProperties.",
  keywords: [
    "BridgeProperties",
    "Rwanda properties",
    "real estate Rwanda",
    "apartments for rent Kigali",
    "houses for sale Kigali",
    "property rental Kigali",
  ],
  authors: [{ name: "BridgeProperties" }],
  creator: "BridgeProperties",
  publisher: "BridgeProperties",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: "BridgeProperties",
    title: "BridgeProperties | Smart Real Estate in Rwanda",
    description:
      "Discover verified apartments, houses, land, and commercial properties for rent and sale in Rwanda.",
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
    site: "@BridgeProperties",
    title: "BridgeProperties | Smart Real Estate in Rwanda",
    description:
      "Discover verified apartments, houses, land, and commercial properties for rent and sale in Rwanda.",
    images: [defaultOgImage()],
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
              <ToastProvider />
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

