import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const { pathname } = req.nextUrl;

  const publicRoutes = [
    '/login',
    '/signup',
    '/register-otp',
    '/forgot-otp',
    '/reset-password',
    '/forgot-password',
    '/admin/login'
  ];

  const roleRedirectMap: Record<string, string> = {
    '/admin': '/admin/dashboard'
  };

  const isAdmin = pathname.startsWith('/admin')

  if (pathname === '/home') {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  const matchedRole = Object.keys(roleRedirectMap)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => pathname.startsWith(prefix));

  if (publicRoutes.includes(pathname) && (accessToken || refreshToken) && matchedRole) {
    return NextResponse.redirect(new URL(roleRedirectMap[matchedRole], req.url));
  }

  if ((accessToken || refreshToken) && (pathname === '/login' || pathname === '/signup'  || pathname ==='/register-otp' || pathname ==='/reset-password'|| pathname ==='/forgot-otp' || pathname ==='/reset-password'|| pathname ==='/forgot-password') && !isAdmin ) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  if (!publicRoutes.includes(pathname) && !accessToken && !refreshToken && matchedRole) {
    return NextResponse.redirect(new URL(`${matchedRole}/login`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
};

