import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Define protected routes
    const isProtectedRoute = path.startsWith('/admin') && !path.startsWith('/admin/login')

    // Get session cookie
    const session = request.cookies.get('admin_session')?.value

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Redirect to dashboard if accessing login with session
    if (path.startsWith('/admin/login') && session) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
