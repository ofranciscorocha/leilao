'use client'

import { useState } from "react"
import { Mail, Plus, Send, Eye, Pause, Play, Trash2, BarChart2, Users, Clock, CheckCircle, XCircle, Edit2, Copy, Search, ChevronRight } from "lucide-react"
import Link from 'next/link'

type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED'

interface Campaign {
    id: string
    name: string
    subject: string
    status: CampaignStatus
    list: string
    totalSent: number
    totalOpened: number
    totalClicked: number
    totalFailed: number
    scheduledAt?: string
    sentAt?: string
    createdAt: string
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
    DRAFT: { label: 'Rascunho', color: 'text-gray-600', bg: 'bg-gray-100' },
    SCHEDULED: { label: 'Agendado', color: 'text-blue-600', bg: 'bg-blue-100' },
    SENDING: { label: 'Enviando...', color: 'text-orange-600', bg: 'bg-orange-100' },
    SENT: { label: 'Enviado', color: 'text-green-600', bg: 'bg-green-100' },
    PAUSED: { label: 'Pausado', color: 'text-yellow-600', bg: 'bg-yellow-100' },
}

const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: '1',
        name: 'Leilão de Veículos - Março 2026',
        subject: '🚗 Oportunidades imperdíveis no Pátio Rocha!',
        status: 'SENT',
        list: 'Arrematantes Ativos',
        totalSent: 1250,
        totalOpened: 487,
        totalClicked: 124,
        totalFailed: 12,
        sentAt: '2026-03-05T10:00',
        createdAt: '2026-03-01',
    },
    {
        id: '2',
        name: 'Novos Lotes Disponíveis',
        subject: '📦 Novos lotes chegaram ao pátio!',
        status: 'SCHEDULED',
        list: 'Newsletter Geral',
        totalSent: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalFailed: 0,
        scheduledAt: '2026-03-15T09:00',
        createdAt: '2026-03-10',
    },
    {
        id: '3',
        name: 'Convite VIP - Leilão Especial',
        subject: '⭐ Convite exclusivo para você',
        status: 'DRAFT',
        list: 'Clientes VIP',
        totalSent: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalFailed: 0,
        createdAt: '2026-03-08',
    },
]

function getOpenRate(campaign: Campaign) {
    if (!campaign.totalSent) return 0
    return Math.round((campaign.totalOpened / campaign.totalSent) * 100)
}
function getClickRate(campaign: Campaign) {
    if (!campaign.totalOpened) return 0
    return Math.round((campaign.totalClicked / campaign.totalOpened) * 100)
}

export default function MarketingPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [showNew, setShowNew] = useState(false)
    const [newName, setNewName] = useState('')
    const [newSubject, setNewSubject] = useState('')

    const filtered = campaigns.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
        if (filterStatus !== 'ALL' && c.status !== filterStatus) return false
        return true
    })

    const totalSent = campaigns.reduce((s, c) => s + c.totalSent, 0)
    const totalOpened = campaigns.reduce((s, c) => s + c.totalOpened, 0)
    const avgOpen = totalSent ? Math.round((totalOpened / totalSent) * 100) : 0

    const createCampaign = () => {
        if (!newName.trim()) return
        const c: Campaign = {
            id: crypto.randomUUID(),
            name: newName,
            subject: newSubject,
            status: 'DRAFT',
            list: '',
            totalSent: 0,
            totalOpened: 0,
            totalClicked: 0,
            totalFailed: 0,
            createdAt: new Date().toISOString().split('T')[0],
        }
        setCampaigns(p => [c, ...p])
        setNewName('')
        setNewSubject('')
        setShowNew(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Mail className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Email Marketing</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/dashboard" className="text-[#3c8dbc] hover:underline">Home</Link> &gt; Marketing
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Campanhas" value={campaigns.length} color="#3c8dbc" icon={<Mail size={22} />} />
                <StatCard label="Emails Enviados" value={totalSent.toLocaleString('pt-BR')} color="#00a65a" icon={<Send size={22} />} />
                <StatCard label="Taxa de Abertura" value={`${avgOpen}%`} color="#f39c12" icon={<Eye size={22} />} />
                <StatCard label="Listas Ativas" value="3" color="#8e44ad" icon={<Users size={22} />} />
            </div>

            {/* Quick nav */}
            <div className="grid grid-cols-3 gap-4">
                <QuickLink href="/admin/marketing/lists" icon={<Users size={20} />} label="Listas de Contatos" sub="Gerencie seus grupos" color="#3c8dbc" />
                <QuickLink href="/admin/marketing/templates" icon={<Edit2 size={20} />} label="Templates" sub="Modelos de email" color="#8e44ad" />
                <QuickLink href="/admin/marketing/stats" icon={<BarChart2 size={20} />} label="Estatísticas" sub="Relatórios detalhados" color="#27ae60" />
            </div>

            {/* Campaigns list */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                    <h3 className="text-[16px] font-normal text-[#333]">Campanhas</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 border border-[#d2d6de] rounded px-2 py-1.5">
                            <Search size={14} className="text-[#999]" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="text-sm outline-none w-32" />
                        </div>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-[#d2d6de] rounded px-2 py-1.5 text-[#555]">
                            <option value="ALL">Todos</option>
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#3c8dbc] rounded hover:bg-[#367fa9] transition-colors">
                            <Plus size={14} />
                            Nova Campanha
                        </button>
                    </div>
                </div>

                {/* New campaign form */}
                {showNew && (
                    <div className="p-4 bg-[#f9f9f9] border-b border-[#eee]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome da campanha *" className="border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]" />
                            <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Assunto do email" className="border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]" />
                            <div className="flex gap-2">
                                <button onClick={createCampaign} className="flex-1 bg-[#00a65a] text-white text-sm font-bold rounded px-4 py-2 hover:bg-[#008d4c] transition-colors">Criar</button>
                                <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-[#777] hover:text-[#333]">Cancelar</button>
                            </div>
                        </div>
                    </div>
                )}

                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#f9f9f9] border-b border-[#f4f4f4]">
                            <th className="text-left p-3 font-bold text-[#555] text-xs uppercase">Campanha</th>
                            <th className="text-left p-3 font-bold text-[#555] text-xs uppercase">Lista</th>
                            <th className="text-center p-3 font-bold text-[#555] text-xs uppercase">Status</th>
                            <th className="text-right p-3 font-bold text-[#555] text-xs uppercase">Enviados</th>
                            <th className="text-right p-3 font-bold text-[#555] text-xs uppercase">Abertura</th>
                            <th className="text-right p-3 font-bold text-[#555] text-xs uppercase">Cliques</th>
                            <th className="text-center p-3 font-bold text-[#555] text-xs uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => {
                            const s = STATUS_CONFIG[c.status]
                            return (
                                <tr key={c.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                                    <td className="p-3">
                                        <div className="font-semibold text-[#333]">{c.name}</div>
                                        <div className="text-xs text-[#777] mt-0.5">{c.subject}</div>
                                    </td>
                                    <td className="p-3 text-xs text-[#777]">{c.list || <span className="italic">Não definida</span>}</td>
                                    <td className="p-3 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                                    </td>
                                    <td className="p-3 text-right font-semibold">{c.totalSent.toLocaleString('pt-BR')}</td>
                                    <td className="p-3 text-right">
                                        <span className={`font-bold ${getOpenRate(c) > 20 ? 'text-green-600' : 'text-[#777]'}`}>
                                            {getOpenRate(c)}%
                                        </span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className="font-semibold text-[#555]">{getClickRate(c)}%</span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1.5 bg-[#3c8dbc] text-white rounded-sm hover:bg-[#367fa9]" title="Editar"><Edit2 size={12} /></button>
                                            {c.status === 'DRAFT' && (
                                                <button className="p-1.5 bg-[#00a65a] text-white rounded-sm hover:bg-[#008d4c]" title="Enviar"><Send size={12} /></button>
                                            )}
                                            {c.status === 'SENDING' && (
                                                <button className="p-1.5 bg-[#f39c12] text-white rounded-sm" title="Pausar"><Pause size={12} /></button>
                                            )}
                                            {c.status === 'SENT' && (
                                                <button className="p-1.5 bg-[#605ca8] text-white rounded-sm" title="Duplicar"><Copy size={12} /></button>
                                            )}
                                            <button className="p-1.5 bg-[#dd4b39] text-white rounded-sm hover:bg-[#c0392b]" title="Excluir"><Trash2 size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-12 text-[#aaa]">
                                    <Mail size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Nenhuma campanha encontrada</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function StatCard({ label, value, color, icon }: any) {
    return (
        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <div>
                    <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                    <div className="text-xs text-[#777] mt-0.5">{label}</div>
                </div>
                <div className="opacity-30" style={{ color }}>{icon}</div>
            </div>
        </div>
    )
}

function QuickLink({ href, icon, label, sub, color }: any) {
    return (
        <Link href={href}>
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-4 flex items-center gap-3 hover:bg-[#f4f4f4] transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: color }}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="font-bold text-sm text-[#333]">{label}</div>
                    <div className="text-xs text-[#777]">{sub}</div>
                </div>
                <ChevronRight size={16} className="text-[#aaa] group-hover:text-[#555]" />
            </div>
        </Link>
    )
}
