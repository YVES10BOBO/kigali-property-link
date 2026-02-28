import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://bridgeproperties.rw/';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/client/',
          '/api/',
          '/login',
          '/register',
          '/test-db/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
