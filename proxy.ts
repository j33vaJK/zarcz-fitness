import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's an admin route
    if (pathname.startsWith("/admin")) {
        const sessionToken = request.cookies.get("session")?.value;

        // Exclude the login page from protection to avoid infinite loops
        if (pathname === "/admin/login") {
            const session = await getSession(sessionToken);
            if (session) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.next();
        }

        const session = await getSession(sessionToken);
        if (!session) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};