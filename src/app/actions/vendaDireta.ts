'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// List all vendas diretas, optionally filtered by status
export async function getVendasDiretas(status?: string) {
  const where: any = {}
  if (status) where.status = status

  return (prisma as any).vendaDireta.findMany({
    where,
    include: {
      lot: {
        select: {
          id: true,
          lotNumber: true,
          title: true,
          plate: true,
          manufacturer: true,
          model: true,
          year: true,
        }
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1,
      },
      _count: {
        select: { images: true, documents: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Get single venda direta by id with full details
export async function getVendaDireta(id: string) {
  return (prisma as any).vendaDireta.findUnique({
    where: { id },
    include: {
      lot: true,
      images: { orderBy: { order: 'asc' } },
      documents: { orderBy: { createdAt: 'desc' } },
    },
  })
}

// Create from FormData
export async function createVendaDireta(data: FormData) {
  const lotId = data.get('lotId') as string | null

  const payload: any = {
    title: data.get('title') as string,
    description: data.get('description') as string || null,
    manufacturer: data.get('manufacturer') as string || null,
    model: data.get('model') as string || null,
    year: data.get('year') as string || null,
    color: data.get('color') as string || null,
    fuel: data.get('fuel') as string || null,
    plate: data.get('plate') as string || null,
    chassis: data.get('chassis') as string || null,
    renavam: data.get('renavam') as string || null,
    mileage: data.get('mileage') ? parseInt(data.get('mileage') as string) : null,
    minimumPrice: parseFloat(data.get('minimumPrice') as string),
    suggestedPrice: data.get('suggestedPrice') ? parseFloat(data.get('suggestedPrice') as string) : null,
    commission: data.get('commission') ? parseFloat(data.get('commission') as string) : 5.0,
    condition: data.get('condition') as string || null,
    hasKeys: data.get('hasKeys') === 'true',
    hasManual: data.get('hasManual') === 'true',
    hasSpareKey: data.get('hasSpareKey') === 'true',
    documentStatus: data.get('documentStatus') as string || null,
    ipvaStatus: data.get('ipvaStatus') as string || null,
    multasStatus: data.get('multasStatus') as string || null,
    debitoStatus: data.get('debitoStatus') as string || null,
    location: data.get('location') as string || null,
    mainImage: data.get('mainImage') as string || null,
    comitenteId: data.get('comitenteId') as string || null,
    comitenteNome: data.get('comitenteNome') as string || null,
    observations: data.get('observations') as string || null,
    internalNotes: data.get('internalNotes') as string || null,
  }

  if (lotId) {
    payload.lotId = lotId
  }

  const venda = await (prisma as any).vendaDireta.create({ data: payload })
  revalidatePath('/admin/vendadireta')
  return venda
}

// Update from FormData
export async function updateVendaDireta(id: string, data: FormData) {
  const payload: any = {
    title: data.get('title') as string,
    description: data.get('description') as string || null,
    manufacturer: data.get('manufacturer') as string || null,
    model: data.get('model') as string || null,
    year: data.get('year') as string || null,
    color: data.get('color') as string || null,
    fuel: data.get('fuel') as string || null,
    plate: data.get('plate') as string || null,
    chassis: data.get('chassis') as string || null,
    renavam: data.get('renavam') as string || null,
    mileage: data.get('mileage') ? parseInt(data.get('mileage') as string) : null,
    minimumPrice: parseFloat(data.get('minimumPrice') as string),
    suggestedPrice: data.get('suggestedPrice') ? parseFloat(data.get('suggestedPrice') as string) : null,
    commission: data.get('commission') ? parseFloat(data.get('commission') as string) : 5.0,
    condition: data.get('condition') as string || null,
    hasKeys: data.get('hasKeys') === 'true',
    hasManual: data.get('hasManual') === 'true',
    hasSpareKey: data.get('hasSpareKey') === 'true',
    documentStatus: data.get('documentStatus') as string || null,
    ipvaStatus: data.get('ipvaStatus') as string || null,
    multasStatus: data.get('multasStatus') as string || null,
    debitoStatus: data.get('debitoStatus') as string || null,
    location: data.get('location') as string || null,
    mainImage: data.get('mainImage') as string || null,
    comitenteNome: data.get('comitenteNome') as string || null,
    observations: data.get('observations') as string || null,
    internalNotes: data.get('internalNotes') as string || null,
  }

  const venda = await (prisma as any).vendaDireta.update({ where: { id }, data: payload })
  revalidatePath('/admin/vendadireta')
  revalidatePath(`/admin/vendadireta/${id}`)
  return venda
}

// Change status only
export async function updateVendaDiretaStatus(id: string, status: string) {
  const extra: any = {}
  if (status === 'VENDIDO') {
    extra.soldAt = new Date()
  }

  const venda = await (prisma as any).vendaDireta.update({
    where: { id },
    data: { status, ...extra },
  })
  revalidatePath('/admin/vendadireta')
  revalidatePath(`/admin/vendadireta/${id}`)
  return venda
}

// Publish to Rocha Select
export async function publishToSelect(id: string) {
  const venda = await (prisma as any).vendaDireta.update({
    where: { id },
    data: {
      publishedToSelect: true,
      publishedAt: new Date(),
      status: 'DISPONIVEL',
    },
  })
  revalidatePath('/admin/vendadireta')
  revalidatePath(`/admin/vendadireta/${id}`)
  return venda
}

// Unpublish from Rocha Select
export async function unpublishFromSelect(id: string) {
  const venda = await (prisma as any).vendaDireta.update({
    where: { id },
    data: {
      publishedToSelect: false,
    },
  })
  revalidatePath('/admin/vendadireta')
  revalidatePath(`/admin/vendadireta/${id}`)
  return venda
}

// Delete venda direta
export async function deleteVendaDireta(id: string) {
  await (prisma as any).vendaDireta.delete({ where: { id } })
  revalidatePath('/admin/vendadireta')
}

// Public endpoint: returns DISPONIVEL + publishedToSelect=true for Rocha Select
export async function getPublishedForSelect(params?: {
  limit?: number
  offset?: number
  manufacturer?: string
  yearMin?: string
  yearMax?: string
  priceMax?: number
  condition?: string
}) {
  const where: any = {
    status: 'DISPONIVEL',
    publishedToSelect: true,
  }

  if (params?.manufacturer) {
    where.manufacturer = { contains: params.manufacturer, mode: 'insensitive' }
  }
  if (params?.condition) {
    where.condition = params.condition
  }
  if (params?.priceMax) {
    where.minimumPrice = { lte: params.priceMax }
  }
  if (params?.yearMin || params?.yearMax) {
    where.year = {}
    if (params?.yearMin) where.year.gte = params.yearMin
    if (params?.yearMax) where.year.lte = params.yearMax
  }

  return (prisma as any).vendaDireta.findMany({
    where,
    include: {
      images: { orderBy: { order: 'asc' }, take: 3 },
    },
    orderBy: { publishedAt: 'desc' },
    skip: params?.offset ?? 0,
    take: params?.limit ?? 50,
  })
}

// Transfer a lot from logistics to Venda Direta
export async function sendLotToVendaDireta(lotId: string) {
  const lot = await (prisma as any).lot.findUnique({
    where: { id: lotId },
    include: { logistics: true },
  })

  if (!lot) throw new Error('Lote não encontrado')

  // Check if already in venda direta
  const existing = await (prisma as any).vendaDireta.findUnique({ where: { lotId } })
  if (existing) return existing

  const venda = await (prisma as any).vendaDireta.create({
    data: {
      lotId,
      title: lot.title,
      description: lot.description,
      manufacturer: lot.manufacturer,
      model: lot.model,
      year: lot.year,
      color: lot.color,
      fuel: lot.fuel,
      plate: lot.plate,
      chassis: lot.chassis,
      renavam: lot.renavam,
      mileage: null,
      minimumPrice: lot.startingPrice ?? 0,
      suggestedPrice: lot.fipeValor ?? null,
      condition: lot.condition ?? null,
      hasKeys: lot.hasKeys ?? false,
      location: lot.location ?? lot.localPatio ?? null,
      mainImage: lot.imageUrl ?? null,
      comitenteNome: lot.comitente ?? null,
      observations: lot.observacoes ?? null,
      internalNotes: lot.observacoesInternas ?? null,
      status: 'EM_PREPARACAO',
    },
  })

  // Update lot status
  await (prisma as any).lot.update({
    where: { id: lotId },
    data: { status: 'VENDA_DIRETA' },
  })

  revalidatePath('/admin/vendadireta')
  revalidatePath('/admin/logistics')
  return venda
}
