'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function createArrematante(formData: FormData) {
    const type = formData.get('type') as string;
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as string;

    // PF
    const cpf = formData.get('cpf') as string;
    const rg = formData.get('rg') as string;

    // PJ
    const cnpj = formData.get('cnpj') as string;
    const corporateName = formData.get('corporateName') as string;
    const tradeName = formData.get('tradeName') as string;
    const responsibleName = formData.get('responsibleName') as string;

    // Endereço
    const zipCode = formData.get('zipCode') as string;
    const address = formData.get('address') as string;
    const number = formData.get('number') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;

    if (!email) {
        throw new Error('E-mail é obrigatório');
    }

    // Hash a default password if not provided
    const password = await bcrypt.hash('patio123', 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaAny = prisma as any;

    await prismaAny.user.create({
        data: {
            type,
            name: type === 'PF' ? name : responsibleName,
            email,
            password,
            role: 'USER',
            status,
            phone,
            cpf: type === 'PF' ? cpf : null,
            rg: type === 'PF' ? rg : null,
            cnpj: type === 'PJ' ? cnpj : null,
            corporateName: type === 'PJ' ? corporateName : null,
            tradeName: type === 'PJ' ? tradeName : null,
            zipCode,
            address,
            number,
            city,
            state
        }
    });

    redirect(`/admin/users`);
}
