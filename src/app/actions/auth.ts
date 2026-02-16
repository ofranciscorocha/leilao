'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const LoginSchema = z.object({
    email: z.string().min(1, 'Email/Username is required'),
    password: z.string().min(1, 'Password is required'),
})

export async function login(prevState: any, formData: FormData) {
    const result = LoginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
            message: 'Invalid fields',
        }
    }

    const { email, password } = result.data

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || user.password !== password) {
            // Note: In production, compare hashed passwords!
            return {
                message: 'Invalid credentials',
            }
        }

        if (user.role !== 'ADMIN') {
            return {
                message: 'Access denied. Admin only.',
            }
        }

        // Set session cookie
        // In a real app, use a signed JWT or session ID
        (await cookies()).set('admin_session', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
    } catch (error) {
        console.error('Login error:', error)
        return {
            message: 'Database error',
        }
    }

    redirect('/admin/dashboard')
}

export async function logout() {
    (await cookies()).delete('admin_session')
    redirect('/admin/login')
}
