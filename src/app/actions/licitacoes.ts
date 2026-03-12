'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getLicitacoes(search?: string, status?: string) {
  const where: any = {}
  if (status && status !== 'ALL') where.status = status
  if (search) {
    where.OR = [
      { numero: { contains: search, mode: 'insensitive' } },
      { orgao: { contains: search, mode: 'insensitive' } },
      { objeto: { contains: search, mode: 'insensitive' } },
    ]
  }
  return (prisma as any).licitacao.findMany({ where, orderBy: { createdAt: 'desc' } })
}

export async function createLicitacao(data: FormData) {
  const obj: any = {
    numero: data.get('numero') as string,
    orgao: data.get('orgao') as string,
    objeto: data.get('objeto') as string || '',
    modalidade: data.get('modalidade') as string || 'PREGAO_ELETRONICO',
    status: data.get('status') as string || 'MONITORANDO',
    observacoes: data.get('observacoes') as string || null,
    editalUrl: data.get('editalUrl') as string || null,
    portalUrl: data.get('portalUrl') as string || null,
    descricao: data.get('descricao') as string || null,
  }

  const valorEstimado = parseFloat(data.get('valorEstimado') as string)
  const valorProposta = parseFloat(data.get('valorProposta') as string)
  const valorVencedor = parseFloat(data.get('valorVencedor') as string)
  if (!isNaN(valorEstimado)) obj.valorEstimado = valorEstimado
  if (!isNaN(valorProposta)) obj.valorProposta = valorProposta
  if (!isNaN(valorVencedor)) obj.valorVencedor = valorVencedor

  const dataPublicacao = data.get('dataPublicacao') as string
  const dataAbertura = data.get('dataAbertura') as string
  const dataEncerramento = data.get('dataEncerramento') as string
  if (dataPublicacao) obj.dataPublicacao = new Date(dataPublicacao)
  if (dataAbertura) obj.dataAbertura = new Date(dataAbertura)
  if (dataEncerramento) obj.dataEncerramento = new Date(dataEncerramento)

  await (prisma as any).licitacao.create({ data: obj })
  revalidatePath('/admin/licitacoes')
}

export async function updateLicitacao(id: string, data: FormData) {
  const obj: any = {
    numero: data.get('numero') as string,
    orgao: data.get('orgao') as string,
    objeto: data.get('objeto') as string || '',
    modalidade: data.get('modalidade') as string,
    status: data.get('status') as string,
    observacoes: data.get('observacoes') as string || null,
    editalUrl: data.get('editalUrl') as string || null,
    portalUrl: data.get('portalUrl') as string || null,
    descricao: data.get('descricao') as string || null,
  }

  const valorEstimado = parseFloat(data.get('valorEstimado') as string)
  const valorProposta = parseFloat(data.get('valorProposta') as string)
  const valorVencedor = parseFloat(data.get('valorVencedor') as string)
  obj.valorEstimado = !isNaN(valorEstimado) ? valorEstimado : null
  obj.valorProposta = !isNaN(valorProposta) ? valorProposta : null
  obj.valorVencedor = !isNaN(valorVencedor) ? valorVencedor : null

  const dataPublicacao = data.get('dataPublicacao') as string
  const dataAbertura = data.get('dataAbertura') as string
  const dataEncerramento = data.get('dataEncerramento') as string
  obj.dataPublicacao = dataPublicacao ? new Date(dataPublicacao) : null
  obj.dataAbertura = dataAbertura ? new Date(dataAbertura) : null
  obj.dataEncerramento = dataEncerramento ? new Date(dataEncerramento) : null

  await (prisma as any).licitacao.update({ where: { id }, data: obj })
  revalidatePath('/admin/licitacoes')
}

export async function deleteLicitacao(id: string) {
  await (prisma as any).licitacao.delete({ where: { id } })
  revalidatePath('/admin/licitacoes')
}

export async function updateLicitacaoStatus(id: string, status: string) {
  await (prisma as any).licitacao.update({ where: { id }, data: { status } })
  revalidatePath('/admin/licitacoes')
}
