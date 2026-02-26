import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

/**
 * Decodes the JWT payload (without verifying signature - verification happens server-side).
 * Used here solely to read the `role` field from the token for routing decisions.
 */
function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export default function proxy(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const { pathname } = req.nextUrl;

  // Always allow API auth routes and callback routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname === '/callback' ||
    pathname.includes('callback')
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = !!(accessToken || refreshToken);

  // Decode role from the access token (falls back to refreshToken if access token missing)
  let userRole: string | undefined;
  const tokenToDecode = accessToken || refreshToken;
  if (tokenToDecode) {
    const payload = decodeJwtPayload(tokenToDecode);
    userRole = payload?.role;
  }

  const isAdmin = userRole === 'admin';

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/register-otp',
    '/demo',
    '/forgot-otp',
    '/reset-password',
    '/forgot-password',
    '/admin/login',
  ];

  // —— Admin route protection ——
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // If already logged in as admin, redirect to admin dashboard
      if (isAuthenticated && isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      // If logged in but NOT admin, redirect to /home (not admin login)
      if (isAuthenticated && !isAdmin) {
        return NextResponse.redirect(new URL('/home', req.url));
      }
      return NextResponse.next();
    }

    // For all other /admin/* routes
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (!isAdmin) {
      // Authenticated user but not an admin — redirect to user home
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return NextResponse.next();
  }

  // —— Redirect authenticated users away from auth pages ——
  if (
    isAuthenticated &&
    (pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/register-otp' ||
      pathname === '/forgot-otp' ||
      pathname === '/reset-password' ||
      pathname === '/forgot-password')
  ) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // —— Redirect authenticated users from root to /home ——
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // —— Protect all non-public routes ——
  if (!publicRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
