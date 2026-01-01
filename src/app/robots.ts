import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kigalipropertieslink.com';
  
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
