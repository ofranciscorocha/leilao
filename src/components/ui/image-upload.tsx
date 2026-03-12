'use client'

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "./button"

interface ImageUploadProps {
  value?: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
}

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 10,
  maxSizeMB = 5,
  accept = 'image/*'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Validate file count
    if (previews.length + files.length > maxFiles) {
      alert(`Você pode fazer upload de no máximo ${maxFiles} imagens`)
      return
    }

    // Validate file sizes
    const maxBytes = maxSizeMB * 1024 * 1024
    const oversizedFiles = files.filter(f => f.size > maxBytes)

    if (oversizedFiles.length > 0) {
      alert(`Algumas imagens excedem o tamanho máximo de ${maxSizeMB}MB`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.urls) {
        const newUrls = [...value, ...data.urls]
        const newPreviews = [...previews, ...data.urls]

        onChange(newUrls)
        setPreviews(newPreviews)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)

    onChange(newUrls)
    setPreviews(newPreviews)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={uploading || previews.length >= maxFiles}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Enviando...' : 'Escolher imagens'}
        </Button>
        <span className="text-sm text-muted-foreground self-center">
          {previews.length}/{maxFiles} imagens
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {previews.length === 0 && (
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nenhuma imagem selecionada</p>
          <p className="text-xs mt-1">Clique no botão acima para adicionar</p>
        </div>
      )}
    </div>
  )
}
