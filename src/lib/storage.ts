'use server'

import { createServerAdminClient } from "./supabase-server"

export async function uploadImage(
  file: File,
  bucket: string = 'auction-images',
  folder?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createServerAdminClient()

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error) {
    console.error('Upload error:', error)
    return { url: null, error: 'Erro ao fazer upload da imagem' }
  }
}

export async function deleteImage(
  filePath: string,
  bucket: string = 'auction-images'
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createServerAdminClient()

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Erro ao deletar imagem' }
  }
}

export async function uploadMultipleImages(
  files: File[],
  bucket: string = 'auction-images',
  folder?: string
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.all(
    files.map(file => uploadImage(file, bucket, folder))
  )

  const urls = results
    .filter(r => r.url !== null)
    .map(r => r.url as string)

  const errors = results
    .filter(r => r.error !== null)
    .map(r => r.error as string)

  return { urls, errors }
}

// Helper to extract file path from Supabase URL
export async function getFilePathFromUrl(url: string, bucket: string = 'auction-images'): Promise<string | null> {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.indexOf(bucket)

    if (bucketIndex === -1) return null

    return pathParts.slice(bucketIndex + 1).join('/')
  } catch {
    return null
  }
}
