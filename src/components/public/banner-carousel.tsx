'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { SearchBar } from './search-bar'
import { Banner } from '@prisma/client'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface BannerCarouselProps {
    banners: Banner[]
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
    const [current, setCurrent] = useState(0)

    // Auto-advance
    useEffect(() => {
        if (banners.length <= 1) return
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [banners.length])

    if (!banners || banners.length === 0) {
        // Fallback Hero
        return (
            <section className="bg-blue-900 text-white py-12 lg:py-20 relative overflow-hidden h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                            Encontre Leilões de Veículos, Imóveis e Mais
                        </h1>
                        <p className="text-lg text-blue-100">
                            O melhor lugar para arrematar com segurança e transparência.
                        </p>
                        <div className="bg-white p-2 rounded-lg shadow-xl max-w-xl mx-auto">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    const next = () => setCurrent(prev => (prev + 1) % banners.length)
    const prev = () => setCurrent(prev => (prev - 1 + banners.length) % banners.length)

    return (
        <section className="relative h-[500px] overflow-hidden bg-gray-900 group">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${banner.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}

                    {/* Content */}
                    <div className="container relative z-10 h-full flex flex-col items-center justify-center text-center text-white space-y-6">
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
                            {banner.title}
                        </h1>
                        {/* Static Search Bar for all slides */}
                        <div className="bg-white p-2 rounded-lg shadow-xl max-w-xl w-full mx-auto">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            {banners.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={prev}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={next}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </>
            )}

            {/* Indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-2 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/50 w-2'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
