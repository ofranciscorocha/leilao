'use server'

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createComitente(formData: FormData) {
    const razaoSocial = formData.get('razaoSocial') as string;
    const nomeFantasia = formData.get('nomeFantasia') as string;
    const cnpjCpf = formData.get('cnpjCpf') as string;

    // Contato
    const contatoNome = formData.get('contatoNome') as string;
    const contatoEmail = formData.get('contatoEmail') as string;
    const contatoTelefone = formData.get('contatoTelefone') as string;

    // Endereço
    const logradouro = formData.get('logradouro') as string;
    const numero = formData.get('numero') as string;
    const complemento = formData.get('complemento') as string;
    const bairro = formData.get('bairro') as string;
    const cidade = formData.get('cidade') as string;
    const estado = formData.get('estado') as string;
    const cep = formData.get('cep') as string;

    // SLA
    const taxaComissao = parseFloat(formData.get('taxaComissao') as string) || null;
    const taxaFixa = parseFloat(formData.get('taxaFixa') as string) || null;
    const observacoes = formData.get('observacoes') as string;

    if (!razaoSocial || !cnpjCpf) {
        throw new Error('Razão Social e CNPJ/CPF são obrigatórios');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaAny = prisma as any;

    await prismaAny.comitente.create({
        data: {
            razaoSocial,
            nomeFantasia,
            cnpjCpf,
            contatoNome,
            contatoEmail,
            contatoTelefone,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep,
            taxaComissao,
            taxaFixa,
            observacoes
        }
    });

    redirect(`/admin/comitentes`);
}
