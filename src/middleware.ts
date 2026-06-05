import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'solvark-super-secret-jwt-key-change-in-prod';
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Protect /admin routes (except /admin/login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionCookie = req.cookies.get('solvark_session')?.value;

    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', req.url);
      // Optional: carry the redirect path
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify JWT
      await jwtVerify(sessionCookie, key, {
        algorithms: ['HS256'],
      });
      // Valid session, let it pass
      return NextResponse.next();
    } catch (e) {
      console.warn('Invalid session cookie in middleware, redirecting to login');
      const response = NextResponse.redirect(new URL('/admin/login', req.url));
      response.cookies.delete('solvark_session');
      return response;
    }
  }

  // Redirect authenticated users trying to access login page
  if (path === '/admin/login') {
    const sessionCookie = req.cookies.get('solvark_session')?.value;
    if (sessionCookie) {
      try {
        await jwtVerify(sessionCookie, key, {
          algorithms: ['HS256'],
        });
        // Already authenticated, redirect to /admin
        return NextResponse.redirect(new URL('/admin', req.url));
      } catch (e) {
        // Bad cookie, delete it and allow login page to render
        const response = NextResponse.next();
        response.cookies.delete('solvark_session');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
