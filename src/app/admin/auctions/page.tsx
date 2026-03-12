import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { CreateAuctionDialog } from "@/components/admin/create-auction-dialog"
import { DeleteAuctionButton } from "@/components/admin/delete-auction-button"
import { AuctionFilters } from "@/components/admin/auction-filters"
import { formatDate } from "@/lib/utils"
import {
    Pencil,
    Gavel,
} from "lucide-react"
import { Prisma } from '@prisma/client'

export default async function AuctionsPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams

    // Build Where Clause
    const where: Prisma.AuctionWhereInput = {}

    const status = searchParams.status as string
    if (status && status !== 'all') {
        // @ts-ignore - Validated by UI, but could be safer
        where.status = status
    }

    const search = searchParams.search as string
    if (search) {
        where.title = { contains: search } // Case insensitive in SQLite?
    }

    const id = searchParams.id as string
    if (id) {
        where.id = { contains: id }
    }

    // Minimal date filtering logic for now
    const startDate = searchParams.startDate as string
    if (startDate) {
        where.startDate = { gte: new Date(startDate) }
    }

    const endDate = searchParams.endDate as string
    if (endDate) {
        where.endDate = { lte: new Date(endDate) }
    }

    const auctions = await prisma.auction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { lots: true }
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Gavel className="h-6 w-6" />
                    Leilões
                </h1>
                <div className="text-sm text-gray-500 breadcrumbs">
                    Home &gt; Leilões
                </div>
            </div>

            {/* Toolbar & Filters Area */}
            <div className="space-y-4">
                {/* Top Row: New Button & Ordering */}
                <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm border">
                    <CreateAuctionDialog />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Ordenação:</span>
                        <Select defaultValue="status">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="status">Por Status</SelectItem>
                                <SelectItem value="date">Por Data</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Dynamic Filters */}
                <AuctionFilters />
            </div>

            {/* Table */}
            <div className="bg-white rounded-md shadow-sm border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                        <tr>
                            <th className="p-3 border-r w-16 text-center">ID</th>
                            <th className="p-3 border-r">Título do Leilão / Comitente</th>
                            <th className="p-3 border-r w-32">Datas</th>
                            <th className="p-3 border-r w-24">Tipo</th>
                            <th className="p-3 border-r w-24">Modalidade</th>
                            <th className="p-3 border-r w-16 text-center">Lotes</th>
                            <th className="p-3 border-r w-32">Status</th>
                            <th className="p-3 w-24 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {auctions.map((auction) => (
                            <tr key={auction.id} className="hover:bg-gray-50">
                                <td className="p-3 border-r text-center text-gray-500">
                                    {auction.id.substring(0, 4)}...
                                </td>
                                <td className="p-3 border-r">
                                    <div className="font-medium text-blue-700 hover:underline cursor-pointer">
                                        {auction.title}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Único Comitente: <span className="uppercase">Exemplo Comitente</span>
                                    </div>
                                </td>
                                <td className="p-3 border-r text-xs text-gray-600">
                                    {formatDate(auction.startDate)}
                                </td>
                                <td className="p-3 border-r text-gray-600">
                                    Online
                                </td>
                                <td className="p-3 border-r text-center text-gray-400">
                                    --
                                </td>
                                <td className="p-3 border-r text-center">
                                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-gray-700">
                                        <Gavel className="h-3 w-3" />
                                        {auction._count.lots}
                                    </span>
                                </td>
                                <td className="p-3 border-r">
                                    <StatusBadge status={auction.status} />
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <DeleteAuctionButton id={auction.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {auctions.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-500">
                                    Nenhum leilão encontrado com os filtros selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'OPEN') {
        return (
            <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Em Andamento
            </div>
        )
    }
    if (status === 'CLOSED') {
        return (
            <div className="flex items-center gap-2 text-red-700 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                Encerrado
            </div>
        )
    }
    if (status === 'UPCOMING') {
        return (
            <div className="flex items-center gap-2 text-blue-700 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Em Breve
            </div>
        )
    }
    return <span className="text-gray-500">{status}</span>
}
