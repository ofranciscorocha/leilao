'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState('')

    function handleSearch() {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <div className="w-full max-w-3xl flex gap-0">
            <Input
                placeholder="Buscar Lotes (ex: Palio, Terreno...)"
                className="h-12 text-lg rounded-r-none border-r-0 bg-gray-50 focus-visible:ring-0 focus-visible:border-blue-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
                onClick={handleSearch}
                className="h-12 px-8 rounded-l-none bg-[#0f172a] hover:bg-blue-900 text-white font-bold tracking-wide"
            >
                <Search className="mr-2 h-5 w-5" />
                BUSCAR
            </Button>
        </div>
    )
}
