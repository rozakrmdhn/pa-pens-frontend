import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware logic
export function middleware(req: NextRequest) {
    const currentUserCookie = req.cookies.get('currentUser')?.value;

    let accessToken = '';

    // Parse the currentUser cookie if it exists
    if (currentUserCookie) {
        try {
            const parsedCookie = JSON.parse(currentUserCookie);
            accessToken = parsedCookie.accessToken || '';
        } catch (error) {
            console.error('Failed to parse currentUser cookie:', error);
        }
    }

    const protectedPaths = [
        '/dashboard', 
        '/pengajuan',
        '/monitoring',
        '/logbook',
        '/master/dosen'
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
    ],
};
