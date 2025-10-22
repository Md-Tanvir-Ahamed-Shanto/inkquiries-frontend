import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const user = request.cookies.get('user');
  
  // Parse user data
  let userData = null;
  try {
    userData = user ? JSON.parse(user.value) : null;
  } catch (error) {
    console.error('Failed to parse user data:', error);
    // If we can't parse the user data, consider it invalid and redirect to login
    if (request.nextUrl.pathname.includes('/admin') || 
        request.nextUrl.pathname.includes('/dashboard') || 
        request.nextUrl.pathname.includes('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/set-password',
    '/explore',
    '/artist/profile/',
    '/client/profile/',
    '/debug-auth'
  ];

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect admin, artist, and client routes
  if (pathname.includes('/admin') || pathname.includes('/dashboard') || pathname.includes('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Additional check: if token exists but no valid user data, redirect to login
    // This handles cases where token might be present but invalid/expired
    // if (!userData) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  // Role-based access control
  if (userData) {
    const role = userData.role?.toLowerCase();

    // Protect dashboard and profile routes based on role
    if (pathname.includes('/dashboard')) {
      if (pathname.startsWith('/admin/dashboard') && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/artist/dashboard') && role !== 'artist') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (pathname.startsWith('/client/dashboard') && role !== 'client') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // if (pathname.includes('/artist/profile/') && role !== 'artist') {
      //   return NextResponse.redirect(new URL('/', request.url));
      // }
      // if (pathname.includes('/client/profile/') && role !== 'client') {
      //   return NextResponse.redirect(new URL('/', request.url));
      // }
    }
  }

  return NextResponse.next();
}

// Configure which routes should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};