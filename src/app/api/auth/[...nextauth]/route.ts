// Minimal placeholder route to satisfy Next.js type imports.
// If you're using NextAuth or a custom auth handler, replace this
// with the real implementation. Leaving the file empty causes
// TypeScript to treat it as not-a-module which breaks the build.

export async function GET() {
  return new Response('Not Found', { status: 404 });
}

export async function POST() {
  return new Response('Not Found', { status: 404 });
}

export const runtime = 'edge';
