import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Middleware logic
export function middleware(req: NextRequest) {
    const currentUserCookie = req.cookies.get('currentUser')?.value;

    let accessToken = '';

    // Parse the currentUser cookie if it exists
    if (currentUserCookie) {
        try {
            const parsedCookie = JSON.parse(currentUserCookie);
            accessToken = parsedCookie.accessToken || '';

            // Decode the JWT token
            const decodedToken = jwt.decode(accessToken) as { exp: number };

            // Check if the token is expired
            const isExpired = decodedToken && decodedToken.exp * 1000 < Date.now();

            if (isExpired) {
                console.warn("Token has expired. Logging out...");
                // Redirect to refresh token route or login page
                const refreshUrl = new URL('/auth/access', req.url);
                return NextResponse.redirect(refreshUrl);
            }

        } catch (error) {
            console.error('Failed to parse currentUser cookie:', error);
            const loginUrl = new URL('/auth', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    const protectedPaths = [
        '/dashboard', 
        '/pengajuan',
        '/monitoring',
        '/logbook',
        '/master/dosen',
        '/master/mahasiswa',
    ];
    const protectedRoute = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    // Redirect if no token
    if (protectedRoute && !accessToken) {
        const loginUrl = new URL('/auth', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated, continue
    return NextResponse.next();
}

// Matcher function to apply middleware only on specific routes
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/pengajuan/:path*',
        '/monitoring/:path*',
        '/logbook/:path*',
        '/master/dosen/:path*',
        '/master/mahasiswa/:path*',
    ],
};
