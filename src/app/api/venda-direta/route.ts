import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const manufacturer = searchParams.get('manufacturer') || undefined
    const yearMin = searchParams.get('yearMin') || undefined
    const yearMax = searchParams.get('yearMax') || undefined
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined
    const condition = searchParams.get('condition') || undefined

    const where: any = {
      status: 'DISPONIVEL',
      publishedToSelect: true,
    }

    if (manufacturer) {
      where.manufacturer = { contains: manufacturer, mode: 'insensitive' }
    }
    if (condition) {
      where.condition = condition
    }
    if (priceMax) {
      where.minimumPrice = { lte: priceMax }
    }
    if (yearMin || yearMax) {
      where.year = {}
      if (yearMin) where.year.gte = yearMin
      if (yearMax) where.year.lte = yearMax
    }

    const [items, total] = await Promise.all([
      (prisma as any).vendaDireta.findMany({
        where,
        select: {
          id: true,
          title: true,
          manufacturer: true,
          model: true,
          year: true,
          color: true,
          fuel: true,
          plate: true,
          mileage: true,
          minimumPrice: true,
          suggestedPrice: true,
          condition: true,
          documentStatus: true,
          ipvaStatus: true,
          multasStatus: true,
          hasKeys: true,
          hasManual: true,
          location: true,
          mainImage: true,
          observations: true,
          publishedAt: true,
          images: {
            orderBy: { order: 'asc' },
            take: 3,
            select: { id: true, url: true, order: true, caption: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip: offset,
        take: Math.min(limit, 100),
      }),
      (prisma as any).vendaDireta.count({ where }),
    ])

    return NextResponse.json(
      { items, total, offset, limit },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      }
    )
  } catch (err: any) {
    console.error('[GET /api/venda-direta]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
