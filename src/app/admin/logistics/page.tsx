import { Car, Home, Package2, Filter, Search, List as ListIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from 'next/link'

// Define the 11 statuses from the mockup
const LOGISTICS_STATUSES = [
    { id: 'EM_TRANSITO', label: 'Em Transito', color: 'bg-[#00c0ef]' },        // Cyan
    { id: 'PENDENTE_VISTORIA', label: 'Pendente de Vistoria', color: 'bg-[#39cccc]' }, // Teal
    { id: 'EM_ESTOQUE', label: 'Em Estoque', color: 'bg-[#0073b7]' },          // Dark Blue
    { id: 'LIBERADO_LEILAO', label: 'Liberado para Leilão', color: 'bg-[#00a65a]' },   // Green
    { id: 'EM_LEILAO', label: 'Em Leilão', color: 'bg-[#f39c12]' },            // Orange
    { id: 'PENDENTE_BAIXA', label: 'Pendente de Baixa', color: 'bg-[#dd4b39]' }, // Red
    { id: 'PENDENTE_RETIRADA', label: 'Pendente de Retirada', color: 'bg-[#d81b60]' }, // Pink/Magenta
    { id: 'AGUARDANDO_REMOCAO', label: 'Aguardando Remoção', color: 'bg-[#605ca8]' }, // Purple
    { id: 'RETIRADOS', label: 'Retirados', color: 'bg-[#001f3f]' },            // Navy
    { id: 'PRENSADOS', label: 'Prensados', color: 'bg-[#111111]' },            // Black
    { id: 'BLOQUEADOS', label: 'Bloqueados', color: 'bg-[#111111]' },          // Black
]

export default async function LogisticsDashboardPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;

    // Extract Filters
    const placaFilter = typeof sp.placa === 'string' ? sp.placa : undefined;
    const idFilter = typeof sp.id === 'string' ? sp.id : undefined;
    const qFilter = typeof sp.q === 'string' ? sp.q : undefined;

    // Build the Where clause based on filters
    const whereClause: any = {};

    if (placaFilter) {
        whereClause.placa = { contains: placaFilter, mode: 'insensitive' };
    }
    if (idFilter) {
        whereClause.id = { contains: idFilter, mode: 'insensitive' };
    }
    if (qFilter) {
        whereClause.OR = [
            { comitente: { contains: qFilter, mode: 'insensitive' } },
            { model: { contains: qFilter, mode: 'insensitive' } },
            { manufacturer: { contains: qFilter, mode: 'insensitive' } }
        ];
    }

    // Fetch counts grouped by status matching all filters
    const statusCounts = await prisma.lot.groupBy({
        by: ['status'],
        where: whereClause,
        _count: { id: true }
    });

    // Helper map for fast lookup
    const countsMap = statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr._count.id;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[24px] font-normal text-[#333] flex items-center gap-2">
                    <span className="text-gray-500">🌍</span> Logística
                </h1>
                {/* Breadcrumbs - simplified for now */}
                <div className="text-[12px] text-[#777]">
                    Home &gt; Logística &gt; Dashboard
                </div>
            </div>

            {/* Main Container */}
            <div className="bg-white border-t-[3px] border-t-[#3c8dbc] shadow-sm rounded-sm">

                {/* Top Actions: Add New Lots */}
                <div className="flex border-b border-[#f4f4f4] p-3 gap-2">
                    <Link href="/admin/logistics/new?category=VEICULO"
                        className="flex flex-col items-center justify-center border w-28 h-20 transition-colors border-[#ddd] text-[#3c8dbc] hover:bg-[#f4f4f4] hover:border-[#3c8dbc]">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-[16px] font-bold">+</span>
                            <Car className="w-6 h-6" />
                        </div>
                        <span className="text-[12px] font-bold">Veículo</span>
                    </Link>
                    <Link href="/admin/logistics/new?category=IMOVEL"
                        className="flex flex-col items-center justify-center border w-28 h-20 transition-colors border-[#ddd] text-[#3c8dbc] hover:bg-[#f4f4f4] hover:border-[#3c8dbc]">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-[16px] font-bold">+</span>
                            <Home className="w-6 h-6" />
                        </div>
                        <span className="text-[12px] font-bold">Imóvel</span>
                    </Link>
                    <Link href="/admin/logistics/new?category=DIVERSOS"
                        className="flex flex-col items-center justify-center border w-28 h-20 transition-colors border-[#ddd] text-[#3c8dbc] hover:bg-[#f4f4f4] hover:border-[#3c8dbc]">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-[16px] font-bold">+</span>
                            <Package2 className="w-6 h-6" />
                        </div>
                        <span className="text-[12px] font-bold">Diversos</span>
                    </Link>
                </div>

                {/* Filter / Search Bar Form */}
                <form method="GET" action="/admin/logistics" className="bg-[#f9f9f9] p-3 border-b border-[#f4f4f4] flex items-center gap-2 flex-wrap">
                    <div className="flex items-center">
                        <span className="bg-[#f4f4f4] border border-[#ccc] border-r-0 text-[#555] px-3 py-1.5 text-[12px]">Placa</span>
                        <input type="text" name="placa" defaultValue={placaFilter} placeholder="Placa" className="border border-[#ccc] px-2 py-1.5 text-[12px] w-32 focus:outline-none focus:border-[#3c8dbc]" />
                    </div>

                    <div className="flex items-center">
                        <span className="bg-[#f4f4f4] border border-[#ccc] border-r-0 text-[#555] px-3 py-1.5 text-[12px]">ID</span>
                        <input type="text" name="id" defaultValue={idFilter} placeholder="ID" className="border border-[#ccc] px-2 py-1.5 text-[12px] w-32 focus:outline-none focus:border-[#3c8dbc]" />
                    </div>

                    <Link href="/admin/logistics" className="bg-white border border-[#ccc] text-[#333] px-3 py-1.5 text-[12px] font-bold flex items-center gap-1 hover:bg-[#e6e6e6]">
                        Limpar Filtros
                    </Link>

                    <div className="flex-1 flex justify-end items-center">
                        <div className="flex w-64">
                            <span className="bg-white border border-[#ccc] border-r-0 text-[#555] px-2 py-1.5 flex items-center justify-center"><Search className="w-3.5 h-3.5" /></span>
                            <input type="text" name="q" defaultValue={qFilter} placeholder="Buscar (Comitente, Modelo...)" className="border border-[#ccc] px-2 py-1.5 text-[12px] flex-1 focus:outline-none focus:border-[#3c8dbc] border-r-0" />
                            <button type="submit" className="bg-[#3c8dbc] text-white px-3 py-1.5 text-[12px] font-bold border border-[#367fa9] hover:bg-[#367fa9]">
                                Buscar
                            </button>
                        </div>
                    </div>
                </form>

                {/* KPI Cards Grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-white">
                    {LOGISTICS_STATUSES.map((status) => {
                        const count = countsMap[status.id] || 0;
                        return (
                            <div key={status.id} className={`${status.color} text-white m-[2px] transition-transform hover:scale-[1.02] cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between`} style={{ height: '110px' }}>
                                <div className="p-3 z-10">
                                    <div className="text-[32px] font-bold leading-none mb-1">{count}</div>
                                    <div className="text-[13px] break-words leading-tight pr-4">{status.label}</div>
                                </div>
                                <div className="bg-black/10 py-1 px-3 text-center text-[12px] z-10 hover:bg-black/20 transition-colors flex justify-center items-center gap-1 group">
                                    Mais informações <span className="text-[10px] group-hover:translate-x-1 transition-transform">➔</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
