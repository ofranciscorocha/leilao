'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LotGalleryProps {
    images: string[]
    title: string
}

export function LotGallery({ images, title }: LotGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0] || '/placeholder-car.jpg')

    return (
        <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={cn(
                                "relative w-24 aspect-video rounded-md overflow-hidden border-2 flex-shrink-0",
                                mainImage === img ? "border-blue-600" : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
