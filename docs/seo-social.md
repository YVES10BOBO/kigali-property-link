## SEO & Social Sharing

This project is configured to generate good metadata for search engines and social platforms.

### Base site URL

The helper in `src/lib/metadata.ts` uses:

- `NEXT_PUBLIC_SITE_URL` (recommended, e.g. `https://bridgeproperties.rw`)
- If not set, it falls back to `https://bridgeproperties.rw`

Always set this in production so absolute URLs are correct.

```env
NEXT_PUBLIC_SITE_URL=https://bridgeproperties.rw
```

### Open Graph & Twitter cards

Global metadata is defined in `src/app/layout.tsx` and per‑page metadata in each page file (e.g. `src/app/(main)/properties/[id]/page.tsx`).

The default OG image is controlled via:

```ts
// src/lib/metadata.ts
export function defaultOgImage(): string {
  const img = process.env.NEXT_PUBLIC_OG_IMAGE
    || "/images/Greenland_property_images/greenlandplaza.jpg";
  return absoluteUrl(img);
}
```

Set this environment variable to change the default card image:

```env
NEXT_PUBLIC_OG_IMAGE=/images/Greenland_property_images/greenlandplaza.jpg
```

After deployment, you can verify with:

- **Facebook Sharing Debugger** – preview OG tags and image  
- **Twitter Card Validator** – preview Twitter cards  

### Sitemap & robots

- `src/app/sitemap.ts` generates a sitemap using `NEXT_PUBLIC_SITE_URL` and Supabase data.
- `src/app/robots.ts` exposes robots.txt rules (public pages allowed, dashboards and APIs disallowed).

Search engines will automatically discover:

- Home page
- Main static pages (`/properties`, `/about`, `/services`, `/contact`, `/blog`)
- All individual property detail pages

### WhatsApp / Facebook preview tips

- Always use the **HTTPS** URL, e.g. `https://bridgeproperties.rw/`.
- After changing OG tags, use Facebook Sharing Debugger’s “Scrape Again”.
- For WhatsApp, you can force a refresh by sharing a URL with a query string once, e.g. `https://bridgeproperties.rw/?v=2`.

