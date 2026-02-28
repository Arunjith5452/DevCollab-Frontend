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

  if (
    pathname.startsWith('/api/auth') ||
    pathname === '/callback' ||
    pathname.includes('callback')
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = !!(accessToken || refreshToken);

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
      if (isAuthenticated && isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      if (isAuthenticated && !isAdmin) {
        return NextResponse.redirect(new URL('/home', req.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return NextResponse.next();
  }

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

  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  if (!publicRoutes.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};
