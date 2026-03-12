import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
    Package2,
    ArrowLeft,
    Edit,
    RefreshCcw,
    Printer,
    Trash2,
    FileText,
    Image as ImageIcon,
    Paperclip,
    DollarSign,
    Truck,
    Clock,
    Car
} from 'lucide-react'
import { LotActionButtons } from './action-buttons'

// Helper for date difference (Dias no Pátio)
function getDaysDifference(startDate: Date, endDate: Date = new Date()) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Formatting helpers
const formatCurrency = (value: number | null) => {
    if (!value) return 'R$0,00'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const formatDate = (date: Date | null | undefined) => {
    if (!date) return '--'
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

// Custom Status Badge mapped to the dashboard colors
const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
        'EM_TRANSITO': 'bg-[#00c0ef]',
        'PENDENTE_VISTORIA': 'bg-[#39cccc]',
        'EM_ESTOQUE': 'bg-[#0073b7]',
        'LIBERADO_LEILAO': 'bg-[#00a65a]',
        'EM_LEILAO': 'bg-[#f39c12]',
        'PENDENTE_PAGAMENTO': 'bg-[#f39c12]', // Fallback orange
        'PENDENTE_BAIXA': 'bg-[#dd4b39]',
        'PENDENTE_RETIRADA': 'bg-[#d81b60]',
        'AGUARDANDO_REMOCAO': 'bg-[#605ca8]',
        'RETIRADOS': 'bg-[#001f3f]',
        'PRENSADOS': 'bg-[#111111]',
        'BLOQUEADOS': 'bg-[#111111]',
    }
    const color = map[status] || 'bg-gray-500'
    const label = status.replace(/_/g, ' ')
    return <span className={`${color} text-white px-2 py-0.5 rounded-sm text-[12px] font-bold`}>{label}</span>
}

export default async function LotLogisticsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const lot = await prisma.lot.findUnique({
        where: { id: params.id },
        include: {
            images: true,
            logistics: true,
            inspection: true,
            auction: true
        }
    })

    if (!lot) {
        notFound()
    }

    const {
        id, status, comitente, entrada, saida, despesaClassificacao,
        startingPrice, reservePrice, placaUf, linhaVeiculo,
        manufacturer, model, versaoVeiculo, category, processoSei, orgaoContrato,
        patio, localPatio, fipeCodigo, fipeValor, sucata, hasKeys,
        year, color, fuel, chassis, numeroMotor, renavam, accessories,
        modalidade, observacoes, observacoesInternas, createdAt, updatedAt
    } = lot

    // Extract lotNumber for ID display if actual UUID is long
    const displayId = id.slice(-6).toUpperCase()

    const diasNoPatio = entrada ? getDaysDifference(entrada, saida || new Date()) : 0

    return (
        <div className="space-y-4 max-w-7xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[24px] font-normal text-[#333] flex items-center gap-2">
                    <Package2 className="w-6 h-6 text-gray-500" /> Bens <span className="text-gray-400 text-[18px]">Visualizar</span>
                </h1>
                <div className="text-[12px] text-[#777]">
                    Home &gt; Logística &gt; Visualizar
                </div>
            </div>

            <div className="bg-white border-t-[3px] border-t-[#3c8dbc] shadow-sm rounded-sm">

                {/* Horizontal Tabs List */}
                <div className="flex border-b border-[#f4f4f4] overflow-x-auto">
                    <button className="flex items-center gap-2 px-4 py-3 border-t-2 border-transparent border-t-[#3c8dbc] bg-white text-[#3c8dbc] font-bold text-[13px] hover:bg-[#f9f9f9]">
                        <FileText className="w-4 h-4" /> Cadastro
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 border-t-2 border-transparent text-[#555] font-normal text-[13px] hover:bg-[#f9f9f9] border-l border-[#f4f4f4]">
                        <FileText className="w-4 h-4" /> Vistoria
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 border-t-2 border-transparent text-[#555] font-normal text-[13px] hover:bg-[#f9f9f9] border-l border-[#f4f4f4]">
                        <ImageIcon className="w-4 h-4" /> Imagens
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 border-t-2 border-transparent text-[#555] font-normal text-[13px] hover:bg-[#f9f9f9] border-l border-[#f4f4f4]">
                        <Paperclip className="w-4 h-4" /> Arquivos
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 border-t-2 border-transparent text-[#555] font-normal text-[13px] hover:bg-[#f9f9f9] border-l border-[#f4f4f4]">
                        <DollarSign className="w-4 h-4" /> Despesas
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 border-t-2 border-transparent text-[#555] font-normal text-[13px] hover:bg-[#f9f9f9] border-l border-[#f4f4f4]">
                        <Truck className="w-4 h-4" /> Remoções
                    </button>
                    <button className="flex items-center gap-2 px-4 py-3 border-t-2 border-transparent text-[#555] font-normal text-[13px] hover:bg-[#f9f9f9] border-l border-[#f4f4f4]" title="Histórico">
                        <Clock className="w-4 h-4" />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-3 border-b border-[#f4f4f4] flex flex-wrap gap-2 justify-between items-center bg-[#f9f9f9]">
                    <LotActionButtons lotId={lot.id} currentStatus={lot.status} />

                    <div className="flex gap-1.5">
                        <button className="bg-white border border-[#ccc] text-[#333] px-3 py-1.5 text-[12px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#e6e6e6]">
                            <FileText className="w-3.5 h-3.5" /> Parabrisa
                        </button>
                        <button className="bg-white border border-[#ccc] text-[#333] p-1.5 rounded-sm flex items-center hover:bg-[#e6e6e6]">
                            <Printer className="w-4 h-4" />
                        </button>
                        <button className="bg-[#dd4b39] border border-[#d33724] text-white px-3 py-1.5 text-[12px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#d33724]">
                            <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </button>
                    </div>
                </div>

                {/* Main Two-Column Grid Content */}
                <div className="p-0 flex flex-col md:flex-row">
                    {/* Left Column Data Table */}
                    <div className="flex-1 border-r border-[#f4f4f4]">
                        <table className="w-full text-left text-[13px]">
                            <tbody className="divide-y divide-[#f4f4f4]">
                                <tr>
                                    <th className="py-2.5 px-3 w-48 font-bold text-[#333] bg-[#fdfdfd]">ID</th>
                                    <td className="py-2.5 px-3">{displayId}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Status</th>
                                    <td className="py-2.5 px-3 flex items-center gap-2">
                                        {getStatusBadge(status)}
                                        {status === 'EM_ESTOQUE' && (
                                            <button className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-2 py-0.5 rounded-sm text-[12px] font-bold flex items-center gap-1">
                                                <RefreshCcw className="w-3 h-3" /> Liberar Leilão
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Comitente</th>
                                    <td className="py-2.5 px-3 uppercase">{comitente || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Entrada</th>
                                    <td className="py-2.5 px-3">{formatDate(entrada)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Saída</th>
                                    <td className="py-2.5 px-3">{saida ? formatDate(saida) : '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Dias no Pátio</th>
                                    <td className="py-2.5 px-3">{diasNoPatio}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Classificação de Despesas</th>
                                    <td className="py-2.5 px-3 flex items-center gap-1 uppercase">
                                        <Car className="w-4 h-4 text-[#777]" /> {despesaClassificacao || 'VEÍCULOS'}
                                    </td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Valor de Avaliação</th>
                                    <td className="py-2.5 px-3">{formatCurrency(startingPrice)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Mínimo para Venda</th>
                                    <td className="py-2.5 px-3">{formatCurrency(reservePrice)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Placa</th>
                                    <td className="py-2.5 px-3 font-bold text-[#dd4b39] uppercase">{placaUf?.substring(0, 3) || '---'} {placaUf?.substring(3) || '----'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Uf/Placa</th>
                                    <td className="py-2.5 px-3 uppercase">{placaUf || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Linha de Veículos</th>
                                    <td className="py-2.5 px-3 uppercase">{linhaVeiculo || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Marca</th>
                                    <td className="py-2.5 px-3 uppercase">{manufacturer || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Modelo</th>
                                    <td className="py-2.5 px-3 uppercase">{model || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Versão Veiculo</th>
                                    <td className="py-2.5 px-3 uppercase">{versaoVeiculo || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Categoria</th>
                                    <td className="py-2.5 px-3 uppercase">{category || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Processo SEI / Ofício (Referência)</th>
                                    <td className="py-2.5 px-3 uppercase">{processoSei || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Órgão / Contrato</th>
                                    <td className="py-2.5 px-3 uppercase">{orgaoContrato || '--'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column Data Table */}
                    <div className="flex-1">
                        <table className="w-full text-left text-[13px]">
                            <tbody className="divide-y divide-[#f4f4f4]">
                                <tr>
                                    <th className="py-2.5 px-3 w-40 font-bold text-[#333] bg-[#fdfdfd]">Pátio</th>
                                    <td className="py-2.5 px-3 uppercase">{patio || 'Pátio Rocha Leilões - Feira de Santana/BA'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Local no Pátio</th>
                                    <td className="py-2.5 px-3 uppercase">{localPatio || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Código Fipe</th>
                                    <td className="py-2.5 px-3 uppercase">{fipeCodigo || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Valor Fipe Entrada</th>
                                    <td className="py-2.5 px-3">{formatCurrency(fipeValor)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Sucata</th>
                                    <td className="py-2.5 px-3">{sucata ? 'Sim' : 'Não'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Com Chave</th>
                                    <td className="py-2.5 px-3">{hasKeys ? 'Sim' : 'Não'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Ano Fabricação</th>
                                    <td className="py-2.5 px-3">{year ? year.split('/')[0] : '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Ano Modelo</th>
                                    <td className="py-2.5 px-3">{year ? year.split('/')[1] || year.split('/')[0] : '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Cor</th>
                                    <td className="py-2.5 px-3 uppercase">{color || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Combustível</th>
                                    <td className="py-2.5 px-3 uppercase">{fuel || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Kilometragem</th>
                                    <td className="py-2.5 px-3">--</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Chassi</th>
                                    <td className="py-2.5 px-3 uppercase">{chassis || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Número do Motor</th>
                                    <td className="py-2.5 px-3 uppercase">{numeroMotor || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Renavam</th>
                                    <td className="py-2.5 px-3 uppercase">{renavam || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Acessórios</th>
                                    <td className="py-2.5 px-3 uppercase">{accessories || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Modalidade</th>
                                    <td className="py-2.5 px-3 uppercase">{modalidade || 'Extra-Judicial'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Observações</th>
                                    <td className="py-2.5 px-3 uppercase">{observacoes || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Observações Internas</th>
                                    <td className="py-2.5 px-3 uppercase">{observacoesInternas || '--'}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Criado em</th>
                                    <td className="py-2.5 px-3 text-[#777] text-[11px]">{formatDate(createdAt)}</td>
                                </tr>
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-[#333] bg-[#fdfdfd]">Alterado em</th>
                                    <td className="py-2.5 px-3 text-[#777] text-[11px]">{formatDate(updatedAt)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
