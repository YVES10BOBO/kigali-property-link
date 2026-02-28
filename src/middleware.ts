import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Protect dashboard routes (admin/agent only)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const adminEmail = process.env.ADMIN_EMAIL;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Always allow configured admin email, even if profile is missing/misconfigured
    if (adminEmail && user.email === adminEmail) {
      return response;
    }

    // Check if user has a profile with admin/agent role
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single();

    // If no profile exists or role is not admin/agent, deny access
    if (!profile || !profile.role || !['admin', 'agent'].includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/client';
      url.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(url);
    }
  }

  // Protect client account routes - any authenticated user (admin, agent, user)
  if (request.nextUrl.pathname.startsWith('/client')) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login/register pages
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
    const adminEmail = process.env.ADMIN_EMAIL;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // If this is the configured admin email, send straight to dashboard
      if (adminEmail && user.email === adminEmail) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('email', user.email)
        .single();

      const url = request.nextUrl.clone();

      if (profile && profile.role && ['admin', 'agent'].includes(profile.role)) {
        url.pathname = '/dashboard';
      } else {
        url.pathname = '/client';
      }

      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
