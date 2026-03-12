import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from 'next/link'
import {
    Gavel, Settings, ArrowLeft, ArrowRight, Eye, Play, Mic,
    MonitorSmartphone, Package, FileText, UserCheck, Search,
    Download, MessageSquare, Image as ImageIcon, Map, Building2,
    Calendar, Watch, DollarSign, TrendingUp
} from "lucide-react"

// Array of statuses for the top progress bar
const STATUSES = ['ATIVO', 'AO VIVO', 'LOTEAMENTO', 'VENDA DIRETA', 'EM BREVE', 'ENCERRADO', 'SUSPENSO', 'INATIVO'];

export default async function AuctionDetailsPage({ params }: { params: { id: string } }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = prisma;
    const auction = await p.auction.findUnique({
        where: { id: params.id },
        include: {
            comitente: true,
            lots: { select: { id: true } },
            habilitacoes: { select: { id: true } }
        }
    });

    if (!auction) notFound();

    // Map internal status to Portuguese labels
    const getStatusLabel = (st: string) => {
        switch (st) {
            case 'OPEN': return 'ATIVO';
            case 'LIVE': return 'AO VIVO';
            case 'EM_LOTEAMENTO': return 'LOTEAMENTO';
            case 'UPCOMING': return 'EM BREVE';
            case 'EM_BREVE': return 'EM BREVE';
            case 'CLOSED': return 'ENCERRADO';
            case 'SUSPENSO': return 'SUSPENSO';
            case 'INATIVO': return 'INATIVO';
            default: return 'ATIVO';
        }
    };

    const currentStatusLabel = getStatusLabel(auction.status);

    return (
        <div className="space-y-4 pb-12 text-[13px] text-[#333]">
            {/* Top Bar / Header */}
            <div className="bg-white border-t-[3px] border-t-[#3c8dbc] shadow-sm flex flex-col md:flex-row items-center justify-between p-3 rounded-sm gap-2">
                <div className="flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    <h1 className="m-0 text-[18px] font-normal" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
                        Leilões - {auction.title} <span className="font-bold">(ID: {auction.id.slice(0, 6)})</span>
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/auctions" className="bg-white border border-[#d2d6de] hover:bg-[#f4f4f4] px-3 py-1.5 rounded-sm flex items-center gap-1 font-bold">
                        <ArrowLeft className="w-4 h-4" /> Voltar
                    </Link>
                    <Link href={`/admin/auctions/create`} className="bg-[#00c0ef] hover:bg-[#00a7d0] text-white border border-[#00acd6] px-3 py-1.5 rounded-sm flex items-center gap-1 font-bold">
                        Editar
                    </Link>
                    <button className="bg-[#f39c12] hover:bg-[#e08e0b] text-white border border-[#f39c12] px-3 py-1.5 rounded-sm flex items-center gap-1 font-bold">
                        Destaque
                    </button>
                    {/* Action Align Right section */}
                    <div className="ml-4 flex gap-2 border-l pl-4 border-[#eee]">
                        <button className="bg-white border border-[#d2d6de] hover:bg-[#f4f4f4] px-3 py-1.5 rounded-sm flex items-center gap-1 font-bold">
                            Arquivar
                        </button>
                        <button className="bg-[#dd4b39] hover:bg-[#d73925] text-white border border-[#d73925] px-3 py-1.5 rounded-sm flex items-center gap-1 font-bold">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>

            {/* Horizontal Status Bar */}
            <div className="flex w-full overflow-x-auto border border-[#d2d6de] rounded-sm bg-white shadow-sm font-bold text-center text-[12px] uppercase">
                {STATUSES.map((st, idx) => {
                    const isActive = st === currentStatusLabel;
                    return (
                        <div key={st} className={`flex-1 py-2 px-1 border-r border-[#f4f4f4] whitespace-nowrap min-w-[100px] ${isActive ? 'bg-[#00a65a] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                            {st}
                        </div>
                    );
                })}
            </div>

            {/* Big Action Buttons Row */}
            <div className="flex flex-wrap gap-4 items-center justify-start bg-white p-4 border border-[#d2d6de] rounded-sm shadow-sm">

                {/* Logo Placeholder */}
                <div className="w-[140px] h-[70px] bg-gray-100 border border-[#d2d6de] rounded-sm flex items-center justify-center text-gray-400 overflow-hidden relative">
                    {auction.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={auction.coverImage} alt="Cover" className="object-cover w-full h-full" />
                    ) : (
                        <ImageIcon size={30} />
                    )}
                </div>

                <Link href={`/admin/auctions/${auction.id}/operador`} className="flex flex-col items-center justify-center border border-[#d2d6de] rounded-sm bg-white hover:bg-[#f4f4f4] w-[140px] h-[70px] text-[#3c8dbc] transition-colors">
                    <Mic className="w-8 h-8 mb-1" />
                    <span className="font-bold text-[12px]">Painel OPERACIONAL</span>
                </Link>

                <Link href={`/painel/auditorio/${auction.id}/telao`} target="_blank" className="flex flex-col items-center justify-center border border-[#d2d6de] rounded-sm bg-white hover:bg-[#f4f4f4] w-[140px] h-[70px] text-[#3c8dbc] transition-colors">
                    <MonitorSmartphone className="w-8 h-8 mb-1" />
                    <span className="font-bold text-[12px]">Tela do AUDITÓRIO</span>
                </Link>

                <div className="flex flex-col items-center justify-center border border-[#d2d6de] rounded-sm bg-white hover:bg-[#f4f4f4] w-[100px] h-[70px] text-gray-700 transition-colors cursor-pointer relative">
                    <Package className="w-8 h-8 mb-1" />
                    <span className="font-bold text-[12px]">Lotes ({auction.lots ? auction.lots.length : 0})</span>
                </div>

                <div className="flex flex-col items-center justify-center border border-[#d2d6de] rounded-sm bg-white hover:bg-[#f4f4f4] w-[100px] h-[70px] text-gray-700 transition-colors cursor-pointer relative">
                    <FileText className="w-8 h-8 mb-1" />
                    <span className="font-bold text-[11px] text-center leading-tight">Notas e Autos<br />Documentação</span>
                </div>

                <Link href={`/admin/auctions/${auction.id}/habilitacoes`} className="flex flex-col items-center justify-center border border-[#d2d6de] rounded-sm bg-white hover:bg-[#f4f4f4] w-[100px] h-[70px] text-gray-700 transition-colors relative">
                    <UserCheck className="w-8 h-8 mb-1" />
                    <span className="font-bold text-[12px]">Habilitações ({auction.habilitacoes ? auction.habilitacoes.length : 0})</span>
                </Link>
            </div>

            {/* Main Content Grid: Configs (Left) and Sidebar (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left: Configuracoes Operacionais */}
                <div className="lg:col-span-3 bg-white border border-[#d2d6de] rounded-sm shadow-sm">
                    <div className="p-3 border-b border-[#f4f4f4] bg-gray-50">
                        <h3 className="font-bold text-[#333] m-0">Configurações Operacionais</h3>
                    </div>

                    <div className="p-0">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Modalidade</td>
                                    <td className="p-3">{auction.modalidade || 'Não definido'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Habilitação</td>
                                    <td className="p-3">{auction.enableGuestBids ? 'Automática' : 'Habilitação Manual'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Habilitação Pessoa</td>
                                    <td className="p-3">{auction.audienceRestriction === 'ALL' ? 'Todos' : auction.audienceRestriction}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Parcelamento</td>
                                    <td className="p-3">{auction.paymentInstallments ? 'Com Parcelamento' : 'Apenas à vista'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Apenas pessoa jurídica lance sucata?</td>
                                    <td className="p-3 font-bold text-red-600">Sim</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Mascarar Usuário do Licitante</td>
                                    <td className="p-3">UTILIZAR MÁSCARA (j***b)</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Streaming do Leilão</td>
                                    <td className="p-3">{auction.videoEmbedUrl ? 'Youtube / Vimeo Ativo' : 'Não configurado'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4] bg-yellow-50">
                                    <td colSpan={2} className="p-2 font-bold text-gray-700 px-3">Dados Cadastrais</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Status</td>
                                    <td className="p-3 text-[#00a65a] font-bold flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-[#00a65a]"></div> {currentStatusLabel}
                                    </td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Esconder as Datas no Site</td>
                                    <td className="p-3">{auction.hideDates ? 'SIM' : 'NÃO'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Data de Abertura para Lances</td>
                                    <td className="p-3">{auction.biddingStart?.toLocaleString('pt-BR') || 'Não definido'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Data do Leilão Central</td>
                                    <td className="p-3">{auction.startDate?.toLocaleString('pt-BR')}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Tipo do Leilão</td>
                                    <td className="p-3">{auction.type} {auction.type === 'LIVE' && '(Ao Vivo)'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Leiloeiro</td>
                                    <td className="p-3">{auction.leiloeiroMatricula} - {auction.leiloeiroNome}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Comitente Principal</td>
                                    <td className="p-3">{auction.comitente?.razaoSocial || 'Nenhum / Loteamento Misto'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Breve Descrição</td>
                                    <td className="p-3">{auction.summary}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <td className="p-3 bg-gray-50 w-1/3 font-bold border-r border-[#f4f4f4]">Local do Leilão / Visitação</td>
                                    <td className="p-3">{auction.visitacaoLocal}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-[#f4f4f4] flex items-center justify-between text-gray-500 text-[11px]">
                        <span>Criado em {auction.createdAt.toLocaleString('pt-BR')}</span>
                        <span>Alterado em {auction.updatedAt.toLocaleString('pt-BR')}</span>
                    </div>
                </div>

                {/* Right: Sidebar Action Links */}
                <div className="space-y-4">

                    {/* Quick Access Block */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden flex flex-col">
                        <Link href={`/leiloes/${auction.id}`} target="_blank" className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <Eye className="w-4 h-4 text-gray-400" /> Acessar leilão no site
                        </Link>
                        <Link href={`#`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <Users className="w-4 h-4 text-gray-400" /> Auditório dos Licitantes
                        </Link>
                        <Link href={`#`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <FileText className="w-4 h-4 text-gray-400" /> Arquivos do Leilão
                        </Link>
                        <Link href={`/admin/reports`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <TrendingUp className="w-4 h-4 text-gray-400" /> Relatórios de Fechamento
                        </Link>
                        <Link href={`/admin/reports/ata/${auction.id}`} target="_blank" className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#3c8dbc] font-bold flex items-center gap-2 transition-colors">
                            <FileText className="w-4 h-4 text-[#3c8dbc]" /> Gerar Ata do Leiloeiro
                        </Link>
                        <Link href={`#`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <Search className="w-4 h-4 text-gray-400" /> Histórico de Emails por Lote
                        </Link>
                        <Link href={`/admin/auctions/${auction.id}/condicionais`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <Search className="w-4 h-4 text-gray-400" /> Lotes Condicionais
                        </Link>
                        <Link href={`#`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <MessageSquare className="w-4 h-4 text-gray-400" /> CHAT com Comitente
                        </Link>
                        <Link href={`#`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4 text-gray-400" /> Download Mensagens
                        </Link>
                        <Link href={`#`} className="p-3 border-b border-[#f4f4f4] hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors">
                            <Package className="w-4 h-4 text-gray-400" /> Cartelas no Leilão
                        </Link>
                        <Link href={`#`} className="p-3 hover:bg-gray-50 text-[#333] flex items-center gap-2 transition-colors font-bold text-[#3c8dbc]">
                            <Settings className="w-4 h-4 text-[#3c8dbc]" /> Opções do Leilão
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    )
}

function Users(props: { className?: string }) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
