'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState, useTransition } from "react"

export async function AuctionFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [id, setId] = useState(searchParams.get('id') || '')
    const [status, setStatus] = useState(searchParams.get('status') || 'all')
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')
    const [search, setSearch] = useState(searchParams.get('search') || '')

    function handleSearch() {
        startTransition(() => {
            const params = new URLSearchParams()
            if (id) params.set('id', id)
            if (status && status !== 'all') params.set('status', status)
            if (startDate) params.set('startDate', startDate)
            if (endDate) params.set('endDate', endDate)
            if (search) params.set('search', search)

            router.push(`/admin/auctions?${params.toString()}`)
        })
    }

    return (
        <div className="bg-white p-4 rounded-md shadow-sm border space-y-4">
            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* ID */}
                <div className="md:col-span-2">
                    <Input
                        placeholder="ID do Leilão"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                {/* Status */}
                <div className="md:col-span-3">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status: Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="OPEN">Em Andamento</SelectItem>
                            <SelectItem value="CLOSED">Encerrado</SelectItem>
                            <SelectItem value="UPCOMING">Em Breve</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Comitentes (Placeholder) */}
                <div className="md:col-span-7">
                    <Select disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Comitentes: Todos (Em Breve)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Dates */}
                <div className="md:col-span-6 flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-24">Data do Leilão</span>
                    <Input
                        type="date"
                        className="flex-1"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="text-sm">até</span>
                    <Input
                        type="date"
                        className="flex-1"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                {/* Leiloeiro (Placeholder) */}
                <div className="md:col-span-6">
                    <Select disabled>
                        <SelectTrigger>
                            <SelectValue placeholder="Leiloeiros: Todos (Em Breve)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Utilities */}
                <div className="md:col-span-3">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Tipo: Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="presencial">Presencial</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-3">
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Modalidade: Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-6 flex gap-2">
                    <Input
                        placeholder="Buscar por Título..."
                        className="flex-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleSearch}
                        disabled={isPending}
                    >
                        <Search className="h-4 w-4 mr-2" />
                        {isPending ? 'Buscando...' : 'Buscar'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
