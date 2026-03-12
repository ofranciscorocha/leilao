'use client'

import { useState } from 'react'
import { Phone, Plus, Send, Eye, Trash2, Edit2, Users, BarChart2, MessageSquare, Search, CheckCheck, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type Status = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'PAUSED'

interface WACampaign {
    id: string
    name: string
    message: string
    status: Status
    list: string
    totalSent: number
    totalDelivered: number
    totalRead: number
    totalFailed: number
    scheduledAt?: string
    sentAt?: string
    createdAt: string
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
    DRAFT: { label: 'Rascunho', color: 'text-gray-600', bg: 'bg-gray-100' },
    SCHEDULED: { label: 'Agendado', color: 'text-blue-600', bg: 'bg-blue-100' },
    SENDING: { label: 'Enviando...', color: 'text-orange-600', bg: 'bg-orange-100' },
    SENT: { label: 'Enviado', color: 'text-green-600', bg: 'bg-green-100' },
    PAUSED: { label: 'Pausado', color: 'text-yellow-600', bg: 'bg-yellow-100' },
}

const MOCK: WACampaign[] = [
    {
        id: '1',
        name: 'Leilão de Março - Aviso',
        message: '🔨 *Pátio Rocha Leilões*\n\nOlá {{name}}! Nosso próximo leilão acontece em *15/03/2026*.\n\n📦 Mais de 200 lotes disponíveis!\n\nAcesse: {{link}}',
        status: 'SENT',
        list: 'Arrematantes Ativos',
        totalSent: 1250,
        totalDelivered: 1198,
        totalRead: 876,
        totalFailed: 52,
        sentAt: '2026-03-05T09:00',
        createdAt: '2026-03-01',
    },
    {
        id: '2',
        name: 'Lembrete 24h - Leilão',
        message: '⏰ *Lembrete*\n\nOlá {{name}}, faltam apenas 24 horas para o leilão!\n\nVerifique seus lotes favoritos em: {{link}}',
        status: 'SCHEDULED',
        list: 'Habilitados Leilão Março',
        totalSent: 0,
        totalDelivered: 0,
        totalRead: 0,
        totalFailed: 0,
        scheduledAt: '2026-03-14T09:00',
        createdAt: '2026-03-10',
    },
]

export default function WhatsAppMarketingPage() {
    const [campaigns, setCampaigns] = useState<WACampaign[]>(MOCK)
    const [showNew, setShowNew] = useState(false)
    const [newName, setNewName] = useState('')
    const [newMessage, setNewMessage] = useState('')
    const [search, setSearch] = useState('')

    const totalSent = campaigns.reduce((s, c) => s + c.totalSent, 0)
    const totalRead = campaigns.reduce((s, c) => s + c.totalRead, 0)
    const avgRead = totalSent ? Math.round((totalRead / totalSent) * 100) : 0

    const filtered = campaigns.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))

    const create = () => {
        if (!newName.trim()) return
        setCampaigns(p => [...p, {
            id: crypto.randomUUID(), name: newName, message: newMessage, status: 'DRAFT',
            list: '', totalSent: 0, totalDelivered: 0, totalRead: 0, totalFailed: 0,
            createdAt: new Date().toISOString().split('T')[0]
        }])
        setNewName(''); setNewMessage(''); setShowNew(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Phone className="h-[22px] w-[22px] text-green-600" />
                    <h1 className="text-[24px] font-normal m-0">WhatsApp Marketing</h1>
                </div>
                <div className="text-[12px] text-[#777]">Home &gt; WhatsApp Marketing</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Campanhas" value={campaigns.length} color="#25D366" icon={<Phone size={22} />} />
                <StatCard label="Mensagens Enviadas" value={totalSent.toLocaleString('pt-BR')} color="#00a65a" icon={<Send size={22} />} />
                <StatCard label="Taxa de Leitura" value={`${avgRead}%`} color="#3c8dbc" icon={<CheckCheck size={22} />} />
                <StatCard label="Listas Ativas" value="3" color="#8e44ad" icon={<Users size={22} />} />
            </div>

            {/* Warning about WhatsApp API */}
            <div className="bg-[#fff8e1] border border-[#ffe082] rounded-sm p-4 text-sm text-[#7d5a00] flex items-start gap-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div>
                    <strong>Configuração necessária:</strong> Para enviar mensagens, configure sua API do WhatsApp (Evolution API ou similar) em{' '}
                    <Link href="/admin/settings#whatsapp" className="text-[#3c8dbc] hover:underline font-bold">Configurações → Integrações</Link>.
                </div>
            </div>

            {/* Campaigns */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                    <h3 className="text-[16px] font-normal text-[#333]">Campanhas WhatsApp</h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 border border-[#d2d6de] rounded px-2 py-1.5">
                            <Search size={14} className="text-[#999]" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="text-sm outline-none w-28" />
                        </div>
                        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded transition-colors" style={{ backgroundColor: '#25D366' }}>
                            <Plus size={14} />
                            Nova Campanha
                        </button>
                    </div>
                </div>

                {showNew && (
                    <div className="p-4 border-b bg-[#f9f9f9] space-y-3">
                        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome da campanha *" className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Mensagem (use *negrito*, _itálico_, {{name}}, {{link}})" rows={4} className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none font-mono" />
                        <div className="p-3 bg-[#e8fbe8] rounded border border-[#b2dfb2] text-xs text-[#2d652d]">
                            <strong>Preview (aproximado):</strong><br />
                            <span className="whitespace-pre-wrap">{newMessage || 'Escreva sua mensagem acima...'}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={create} className="px-4 py-1.5 text-white text-sm font-bold rounded" style={{ backgroundColor: '#25D366' }}>Criar Campanha</button>
                            <button onClick={() => setShowNew(false)} className="px-4 py-1.5 text-[#777] text-sm">Cancelar</button>
                        </div>
                    </div>
                )}

                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#f9f9f9] border-b border-[#f4f4f4]">
                            <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Campanha</th>
                            <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Lista</th>
                            <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Status</th>
                            <th className="text-right p-3 text-xs font-bold text-[#555] uppercase">Enviados</th>
                            <th className="text-right p-3 text-xs font-bold text-[#555] uppercase">Entregues</th>
                            <th className="text-right p-3 text-xs font-bold text-[#555] uppercase">Lidos</th>
                            <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => {
                            const s = STATUS_CONFIG[c.status]
                            const readRate = c.totalDelivered ? Math.round((c.totalRead / c.totalDelivered) * 100) : 0
                            return (
                                <tr key={c.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                                    <td className="p-3">
                                        <div className="font-semibold text-[#333]">{c.name}</div>
                                        <div className="text-xs text-[#777] mt-0.5 line-clamp-1 font-mono">{c.message.substring(0, 60)}...</div>
                                    </td>
                                    <td className="p-3 text-xs text-[#777]">{c.list || <span className="italic">Não definida</span>}</td>
                                    <td className="p-3 text-center">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                                    </td>
                                    <td className="p-3 text-right font-semibold">{c.totalSent.toLocaleString('pt-BR')}</td>
                                    <td className="p-3 text-right text-[#555]">{c.totalDelivered.toLocaleString('pt-BR')}</td>
                                    <td className="p-3 text-right">
                                        <span className={`font-bold ${readRate > 50 ? 'text-green-600' : 'text-[#777]'}`}>{readRate}%</span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1.5 bg-[#3c8dbc] text-white rounded-sm"><Edit2 size={12} /></button>
                                            {c.status === 'DRAFT' && <button className="p-1.5 text-white rounded-sm" style={{ backgroundColor: '#25D366' }}><Send size={12} /></button>}
                                            <button onClick={() => setCampaigns(p => p.filter(x => x.id !== c.id))} className="p-1.5 bg-[#dd4b39] text-white rounded-sm"><Trash2 size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
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
