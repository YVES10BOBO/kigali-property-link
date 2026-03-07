// helper functions for building metadata with absolute URLs

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bridgeproperties.rw";

/**
 * Ensure the given path becomes an absolute URL using the configured site URL.
 * If the input already looks like an absolute URL, it is returned unchanged.
 */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  // ensure leading slash
  const p = path.startsWith("/") ? path : "/" + path;
  // Ensure SITE_URL doesn't have trailing slash when combining
  const baseUrl = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  return baseUrl + p;
}

/**
 * Get the default OpenGraph image URL, falling back to a static path if the
 * environment variable isn't provided.
 */
export function defaultOgImage(): string {
  // Default to Greenland Plaza image if not set
  const img = process.env.NEXT_PUBLIC_OG_IMAGE || "/images/Greenland_property_images/greenlandplaza.jpg";
  return absoluteUrl(img);
}
