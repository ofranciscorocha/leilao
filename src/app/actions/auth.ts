'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
// import { hash } from 'bcrypt' // In a real app. For this demo, plain text or simple hash.

export async function logout() {
    // In a real app: cookies().delete('session')
    redirect('/admin/login')
}

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const type = formData.get('type') as string
    const document = formData.get('document') as string
    const phone = formData.get('phone') as string

    try {
        // Check if exists
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return { success: false, message: 'Email já cadastrado.' }
        }

        // Basic user creation
        await prisma.user.create({
            data: {
                name,
                email,
                password: password, // TODO: Hash this
                type,
                cpf: type === 'PF' ? document : undefined,
                cnpj: type === 'PJ' ? document : undefined,
                phone,
                role: 'USER',
                status: 'ACTIVE' // Auto-activate for demo
            } as any
        })


        return { success: true, message: 'Conta criada com sucesso!' }
    } catch (e) {
        console.error(e)
        return { success: false, message: 'Erro ao criar conta.' }
    }
}
