import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession()

    // Define protected routes
    const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login')
    const isMyAccountRoute = path.startsWith('/my-account')
    const isProtectedRoute = isAdminRoute || isMyAccountRoute

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
        const redirectUrl = isAdminRoute ? '/admin/login' : '/'
        return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Check admin role for admin routes
    if (isAdminRoute && session) {
        const { data: user } = await supabase
            .from('User')
            .select('role')
            .eq('id', session.user.id)
            .single()

        if (user?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Redirect to dashboard if accessing login with session
    if (path === '/admin/login' && session) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*', '/my-account/:path*'],
}
