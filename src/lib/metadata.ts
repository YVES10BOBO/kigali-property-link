// helper functions for building metadata with absolute URLs

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

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
  return SITE_URL + p;
}

/**
 * Get the default OpenGraph image URL, falling back to a static path if the
 * environment variable isn't provided.
 */
export function defaultOgImage(): string {
  const img = process.env.NEXT_PUBLIC_OG_IMAGE || "/images/bridge-og.png";
  return absoluteUrl(img);
}
