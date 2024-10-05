import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware logic
export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth-token');

    const protectedRoute = req.nextUrl.pathname.startsWith('/dashboard')
    || req.nextUrl.pathname.startsWith('/pengajuan');

    // Redirect if no token
    if (protectedRoute && !token) {
        const loginUrl = new URL('/auth', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated, continue
    return NextResponse.next();
}

// Matcher function to apply middleware only on specific routes
export const config = {
    matcher: [
        // '/dashboard/:path*',
        // '/pengajuan/:path*',
    ],
};
