'use server'

import { prisma } from "@/lib/prisma"
import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function logout() {
    const supabase = await createServerClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
}

import { z } from "zod"

const LoginSchema = z.object({
    email: z.string().min(1, 'Usuário ou e-mail é obrigatório'),
    password: z.string().min(1, 'Senha é obrigatória'),
})

export async function loginUser(prevState: any, formData: FormData) {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!validatedFields.success) {
        return {
            success: false,
            message: 'Erro de validação',
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { email, password } = validatedFields.data

    try {
        const supabase = await createServerClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { success: false, message: error.message }
        }

        revalidatePath('/')
        redirect('/admin/dashboard')
    } catch (e: any) {
        console.error(e)
        return { success: false, message: e?.message || 'Erro ao fazer login.' }
    }
}

// Alias for backward compatibility
export const login = loginUser

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const type = formData.get('type') as string
    const document = formData.get('document') as string
    const phone = formData.get('phone') as string

    try {
        const supabase = await createServerClient()

        // Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    type,
                    phone,
                }
            }
        })

        if (authError) {
            return { success: false, message: authError.message }
        }

        if (!authData.user) {
            return { success: false, message: 'Erro ao criar usuário.' }
        }

        // Create user profile in database
        await prisma.user.create({
            data: {
                id: authData.user.id, // Use Supabase Auth ID
                name,
                email,
                password: '', // Not needed anymore, handled by Supabase
                type,
                cpf: type === 'PF' ? document : undefined,
                cnpj: type === 'PJ' ? document : undefined,
                phone,
                role: 'USER',
                status: 'ACTIVE'
            } as any
        })

        return { success: true, message: 'Conta criada com sucesso! Verifique seu email.' }
    } catch (e) {
        console.error(e)
        return { success: false, message: 'Erro ao criar conta.' }
    }
}
