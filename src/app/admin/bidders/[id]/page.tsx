import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowLeft, Edit, Trash2, FileText, Paperclip, BarChart, Check, Clock, XCircle, Ban, CheckCircle2 } from "lucide-react"
import Link from 'next/link'
import { StatusActions } from "./status-actions"

export default async function BidderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            bids: true,
            wonLots: true,
            documents: true
        }
    })

    if (!user) {
        notFound()
    }

    // Format date helpers
    const formatDate = (date: Date | null | undefined) => {
        if (!date) return '-'
        return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }).format(date)
    }

    const formatShortDate = (date: Date | null | undefined) => {
        if (!date) return '-'
        return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(date)
    }

    return (
        <div className="space-y-4 max-w-6xl">
            {/* Top Toolbar */}
            <div className="flex justify-between items-center bg-[#f9f9f9] border border-[#d2d6de] p-2 rounded-sm shadow-sm">
                <div className="flex gap-1">
                    <Link href="/admin/bidders" className="bg-white border border-[#d2d6de] text-[#333] px-3 py-1.5 text-[12px] font-bold rounded-sm hover:bg-[#e6e6e6] flex items-center gap-1 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                    </Link>
                    <button className="bg-[#00c0ef] border border-[#00acd6] text-white px-3 py-1.5 text-[12px] font-bold rounded-sm hover:bg-[#00acd6] flex items-center gap-1 transition-colors">
                        <Edit className="w-3.5 h-3.5" /> Editar
                    </button>
                    <button className="bg-[#dd4b39] border border-[#d73925] text-white px-3 py-1.5 text-[12px] font-bold rounded-sm hover:bg-[#d73925] flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                    </button>
                </div>
                <div className="flex gap-1">
                    <button className="bg-white border border-[#d2d6de] text-[#333] px-3 py-1.5 text-[12px] font-bold rounded-sm hover:bg-[#e6e6e6] flex items-center gap-1 transition-colors">
                        <FileText className="w-3.5 h-3.5" /> Anotações (0)
                    </button>
                    <button className="bg-white border border-[#d2d6de] text-[#333] px-3 py-1.5 text-[12px] font-bold rounded-sm hover:bg-[#e6e6e6] flex items-center gap-1 transition-colors">
                        <Paperclip className="w-3.5 h-3.5" /> Documentos ({user.documents.length})
                    </button>
                    <button className="bg-white border border-[#d2d6de] text-[#333] px-3 py-1.5 text-[12px] font-bold rounded-sm hover:bg-[#e6e6e6] flex items-center gap-1 transition-colors">
                        <BarChart className="w-3.5 h-3.5" /> Relatórios
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border-t-[3px] border-t-[#3c8dbc] rounded-sm shadow-sm">

                {/* Action Bar (Status Buttons) */}
                <div className="flex justify-end p-3 border-b border-[#f4f4f4] bg-white gap-2">
                    <StatusActions userId={user.id} currentStatus={user.status} />
                </div>

                {/* Information Grid */}
                <div className="flex flex-col md:flex-row">
                    {/* Left Column - User Details */}
                    <div className="flex-1 border-r border-[#f4f4f4]">
                        <table className="w-full text-[13px] text-left">
                            <tbody>
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="w-40 p-3 bg-white font-bold text-[#333]">Status</th>
                                    <td className="p-3">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-3 h-3 rounded-full ${user.status === 'ACTIVE' ? 'bg-[#00a65a]' : user.status === 'PENDING' ? 'bg-[#f39c12]' : user.status === 'REJECTED' ? 'bg-[#ff851b]' : 'bg-[#dd4b39]'}`}></span>
                                                <span className="font-bold text-[#333]">
                                                    {user.status === 'ACTIVE' ? 'Ativo' : user.status === 'PENDING' ? 'Pendente' : user.status === 'REJECTED' ? 'Reprovado' : 'Bloqueado'}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-[#777] italic">Alterado em: {formatDate(user.updatedAt)} - por: Admin</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="p-3 bg-white font-bold text-[#333]">ID</th>
                                    <td className="p-3">{user.id.slice(-6).toUpperCase()}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="p-3 bg-white font-bold text-[#333]">Pessoa</th>
                                    <td className="p-3">{user.type === 'PF' ? 'Física' : 'Jurídica'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="p-3 bg-white font-bold text-[#333]">Nome</th>
                                    <td className="p-3 uppercase">{user.name || user.corporateName || '-'}</td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="p-3 bg-white font-bold text-[#333]">CPF/CNPJ</th>
                                    <td className="p-3">{user.cpf || user.cnpj || '-'}</td>
                                </tr>
                                {user.type === 'PF' && (
                                    <>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">RG / IE</th>
                                            <td className="p-3">{user.rg || '-'} {user.orgEmitter ? `- ${user.orgEmitter}` : ''}</td>
                                        </tr>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">Expedição RG</th>
                                            <td className="p-3">{formatShortDate(user.dispatchDate)}</td>
                                        </tr>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">CNH</th>
                                            <td className="p-3">{user.cnh || '-'}</td>
                                        </tr>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">Emissão CNH</th>
                                            <td className="p-3">{formatShortDate(user.cnhIssueDate)}</td>
                                        </tr>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">Gênero</th>
                                            <td className="p-3 capitalize">{user.gender || '-'}</td>
                                        </tr>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">Data de Nascimento</th>
                                            <td className="p-3">{formatShortDate(user.birthDate)}</td>
                                        </tr>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">Nacionalidade</th>
                                            <td className="p-3">{user.nationality || 'Brasileiro(a)'}</td>
                                        </tr>
                                        <tr className="border-b border-[#f4f4f4]">
                                            <th className="p-3 bg-white font-bold text-[#333]">Naturalidade</th>
                                            <td className="p-3 uppercase">{user.naturalness || '-'}</td>
                                        </tr>
                                    </>
                                )}
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="p-3 bg-white font-bold text-[#333]">E-mail</th>
                                    <td className="p-3 flex items-center gap-2">
                                        {user.email} <span className="bg-[#00a65a] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">Verificado</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="p-3 bg-white font-bold text-[#333]">Celular</th>
                                    <td className="p-3 flex items-center gap-2">
                                        {user.phone || user.mobile || '-'} <span className="bg-[#00a65a] text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold">WhatsApp</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-[#f4f4f4]">
                                    <th className="p-3 bg-white font-bold text-[#333]">Endereço</th>
                                    <td className="p-3 uppercase">
                                        {user.address} {user.number ? `, ${user.number}` : ''} {user.complement ? ` - ${user.complement}` : ''}
                                        <br />
                                        {user.neighborhood} - {user.city}/{user.state} - {user.zipCode}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column - System & Interaction info */}
                    <div className="w-full md:w-80">
                        {/* Usuário Online Section */}
                        <div className="p-3">
                            <h4 className="text-[14px] font-bold border-b border-[#f4f4f4] pb-2 mb-2 text-[#333]">Usuário Online</h4>
                            <table className="w-full text-[13px] text-left">
                                <tbody>
                                    <tr>
                                        <th className="py-1 w-28 text-[#555] font-normal">Usuário</th>
                                        <td className="py-1">{user.email.split('@')[0]}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 text-[#555] font-normal">Senha</th>
                                        <td className="py-1">********</td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 text-[#555] font-normal">Último Login</th>
                                        <td className="py-1">{formatDate(user.createdAt)}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 text-[#555] font-normal">Termos de Uso Assinado em</th>
                                        <td className="py-1">{formatDate(user.createdAt)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="bg-[#f9f9f9] border border-[#d2d6de] text-[#555] text-[11px] px-2 py-1 rounded-sm mt-3 hover:bg-[#e6e6e6]">Histórico de Assinaturas</button>
                        </div>

                        {/* Habilitações Section */}
                        <div className="p-3 border-t border-[#f4f4f4]">
                            <h4 className="text-[14px] font-bold border-b border-[#f4f4f4] pb-2 mb-2 text-[#333]">Habilitações</h4>
                            <table className="w-full text-[13px] text-left">
                                <tbody>
                                    <tr>
                                        <th className="py-1 w-32 text-[#555] font-normal">Habilitação Sucata</th>
                                        <td className="py-1">Não</td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 text-[#555] font-normal">Autorização Sucata</th>
                                        <td className="py-1">
                                            <button className="bg-[#f9f9f9] border border-[#d2d6de] text-[#555] text-[11px] px-2 py-1 rounded-sm hover:bg-[#e6e6e6]">Cadastrar Documento</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Interações */}
                        <div className="p-3 border-t border-[#f4f4f4]">
                            <h4 className="text-[14px] font-bold border-b border-[#f4f4f4] pb-2 mb-2 text-[#333]">Interações do Arrematante</h4>
                            <table className="w-full text-[13px] text-left">
                                <tbody>
                                    <tr>
                                        <th className="py-1 w-32 text-[#555] font-normal">Total de Lances</th>
                                        <td className="py-1">{user.bids.length}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 text-[#555] font-normal">Total de Arrematações</th>
                                        <td className="py-1">{user.wonLots.length}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 text-[#555] font-normal">Notas de Arrematação</th>
                                        <td className="py-1">0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
