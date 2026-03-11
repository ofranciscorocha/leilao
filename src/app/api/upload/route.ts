import { NextRequest, NextResponse } from 'next/server'
import { uploadMultipleImages } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Get folder from query params (optional)
    const folder = request.nextUrl.searchParams.get('folder') || undefined

    const { urls, errors } = await uploadMultipleImages(files, 'auction-images', folder)

    if (errors.length > 0) {
      return NextResponse.json(
        { urls, errors },
        { status: 207 } // Multi-status
      )
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Erro ao processar upload' },
      { status: 500 }
    )
  }
}
