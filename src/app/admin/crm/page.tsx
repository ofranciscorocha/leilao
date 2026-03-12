'use client'

import { useState } from 'react'
import {
    Kanban, Plus, User, Phone, Mail, Building, Tag,
    MessageSquare, ArrowRight, X, Edit2, Trash2, ChevronRight,
    Search, Star, TrendingUp, DollarSign, Calendar, Linkedin,
    Instagram, Users, Send
} from 'lucide-react'
import Link from 'next/link'

type Stage = 'NOVO' | 'CONTATO' | 'QUALIFICADO' | 'PROPOSTA' | 'NEGOCIACAO' | 'GANHO' | 'PERDIDO'

interface Contact {
    id: string
    name: string
    email?: string
    phone?: string
    company?: string
    position?: string
    linkedinUrl?: string
    type: string
    source?: string
    tags?: string
    stage: Stage
    priority: 'HIGH' | 'NORMAL' | 'LOW'
    estimatedValue?: number
    notes?: string
    createdAt: string
}

const STAGES: { key: Stage; label: string; color: string; bg: string }[] = [
    { key: 'NOVO', label: 'Novos', color: '#6c757d', bg: '#f8f9fa' },
    { key: 'CONTATO', label: 'Contato Feito', color: '#3c8dbc', bg: '#dce8f3' },
    { key: 'QUALIFICADO', label: 'Qualificado', color: '#8e44ad', bg: '#f3e8ff' },
    { key: 'PROPOSTA', label: 'Proposta Enviada', color: '#f39c12', bg: '#fff3cd' },
    { key: 'NEGOCIACAO', label: 'Em Negociação', color: '#e67e22', bg: '#fde8cc' },
    { key: 'GANHO', label: 'Ganho 🎉', color: '#00a65a', bg: '#d4f4e2' },
    { key: 'PERDIDO', label: 'Perdido', color: '#dd4b39', bg: '#fde8e6' },
]

const MOCK: Contact[] = [
    {
        id: '1', name: 'Ricardo Ferreira', email: 'ricardo@empresaA.com', phone: '11999990001',
        company: 'Empresa Logistics Ltda', position: 'Diretor Operacional',
        type: 'PROSPECT', source: 'LINKEDIN', stage: 'NEGOCIACAO', priority: 'HIGH',
        estimatedValue: 45000, tags: 'logística,veículos', createdAt: '2026-02-01',
        linkedinUrl: 'https://linkedin.com/in/ricardo'
    },
    {
        id: '2', name: 'Ana Paula Lima', email: 'ana@prefeitura.sp.gov.br',
        company: 'Prefeitura de SP', position: 'Gestora de Contratos',
        type: 'LEAD', source: 'EVENTO', stage: 'QUALIFICADO', priority: 'HIGH',
        estimatedValue: 150000, tags: 'governo,licitação', createdAt: '2026-02-15',
    },
    {
        id: '3', name: 'Marcos Souza', email: 'marcos@detran.sp.gov.br',
        company: 'DETRAN-SP', position: 'Chefe de Setor',
        type: 'LEAD', source: 'INDICACAO', stage: 'PROPOSTA', priority: 'HIGH',
        estimatedValue: 200000, createdAt: '2026-03-01',
    },
    {
        id: '4', name: 'Juliana Castro', email: 'ju.castro@gmail.com', phone: '11988880001',
        type: 'LEAD', source: 'SITE', stage: 'CONTATO', priority: 'NORMAL',
        estimatedValue: 5000, tags: 'veículos', createdAt: '2026-03-05',
    },
    {
        id: '5', name: 'Pedro Alves', email: 'pedro@importadora.com', phone: '11977770001',
        company: 'Importadora Nacional SA', position: 'Gerente de Compras',
        type: 'PROSPECT', source: 'WHATSAPP', stage: 'NOVO', priority: 'NORMAL',
        estimatedValue: 25000, createdAt: '2026-03-08',
    },
    {
        id: '6', name: 'Fernanda Rocha', company: 'TJ-SP',
        type: 'CLIENT', source: 'INDICACAO', stage: 'GANHO', priority: 'HIGH',
        estimatedValue: 80000, createdAt: '2025-12-01',
    },
]

function ContactCard({ c, onEdit, onDelete, onMove }: {
    c: Contact; onEdit: () => void; onDelete: () => void; onMove: (s: Stage) => void
}) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="bg-white rounded-lg border border-[#e0e0e0] p-3 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-semibold text-sm text-[#333]">{c.name}</div>
                        {c.position && <div className="text-[10px] text-[#777]">{c.position}</div>}
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-1 text-blue-400 hover:text-blue-600"><Edit2 size={12} /></button>
                    <button onClick={onDelete} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                </div>
            </div>
            {c.company && (
                <div className="flex items-center gap-1 text-[11px] text-[#777] mb-1">
                    <Building size={11} />
                    {c.company}
                </div>
            )}
            {c.phone && (
                <div className="flex items-center gap-1 text-[11px] text-[#777] mb-1">
                    <Phone size={11} />
                    {c.phone}
                </div>
            )}
            {c.estimatedValue && (
                <div className="text-[11px] font-bold text-[#00a65a] mb-2">
                    {c.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
            )}
            <div className="flex items-center justify-between mt-2">
                <div className="flex flex-wrap gap-1">
                    {c.tags?.split(',').filter(Boolean).slice(0, 2).map(t => (
                        <span key={t} className="text-[9px] bg-[#f4f4f4] text-[#555] px-1.5 py-0.5 rounded-full">{t.trim()}</span>
                    ))}
                    {c.linkedinUrl && (
                        <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#0077b5]">
                            <Linkedin size={12} />
                        </a>
                    )}
                </div>
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-[10px] text-[#aaa] hover:text-[#555] flex items-center gap-0.5">
                        Mover <ChevronRight size={11} />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-5 z-10 bg-white border border-[#d2d6de] rounded shadow-lg w-40">
                            {STAGES.filter(s => s.key !== c.stage).map(s => (
                                <button key={s.key} onClick={() => { onMove(s.key); setShowMenu(false) }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#f4f4f4] text-[#333]">
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function CRMPage() {
    const [contacts, setContacts] = useState<Contact[]>(MOCK)
    const [search, setSearch] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [newContact, setNewContact] = useState<Partial<Contact>>({ stage: 'NOVO', priority: 'NORMAL', type: 'LEAD' })

    const filtered = contacts.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()))

    const moveContact = (id: string, stage: Stage) => {
        setContacts(p => p.map(c => c.id === id ? { ...c, stage } : c))
    }

    const deleteContact = (id: string) => setContacts(p => p.filter(c => c.id !== id))

    const createContact = () => {
        if (!newContact.name?.trim()) return
        setContacts(p => [...p, {
            id: crypto.randomUUID(),
            name: newContact.name!,
            email: newContact.email,
            phone: newContact.phone,
            company: newContact.company,
            type: newContact.type || 'LEAD',
            stage: newContact.stage as Stage || 'NOVO',
            priority: newContact.priority as any || 'NORMAL',
            estimatedValue: newContact.estimatedValue,
            createdAt: new Date().toISOString().split('T')[0],
        }])
        setNewContact({ stage: 'NOVO', priority: 'NORMAL', type: 'LEAD' })
        setShowNew(false)
    }

    // Pipeline totals
    const totalValue = contacts.filter(c => c.stage === 'GANHO').reduce((s, c) => s + (c.estimatedValue || 0), 0)
    const pipelineValue = contacts.filter(c => !['GANHO', 'PERDIDO'].includes(c.stage)).reduce((s, c) => s + (c.estimatedValue || 0), 0)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Kanban className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">CRM — Pipeline</h1>
                </div>
                <div className="text-[12px] text-[#777]">Home &gt; CRM</div>
            </div>

            {/* Lead Intelligence Navigation */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm">
                <div className="flex flex-wrap items-center gap-0 border-b border-[#d2d6de]">
                    <Link
                        href="/admin/crm"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 border-[#3c8dbc] text-[#3c8dbc] -mb-px"
                    >
                        <Kanban size={15} /> Pipeline
                    </Link>
                    <Link
                        href="/admin/crm/linkedin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 border-transparent text-[#777] hover:text-[#0077b5] hover:border-[#0077b5] -mb-px transition-colors"
                    >
                        <Linkedin size={15} /> LinkedIn Hunter
                    </Link>
                    <Link
                        href="/admin/crm/social"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 border-transparent text-[#777] hover:text-[#c13584] hover:border-[#c13584] -mb-px transition-colors"
                    >
                        <Instagram size={15} /> Social Media
                    </Link>
                    <Link
                        href="/admin/crm/contacts"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 border-transparent text-[#777] hover:text-[#333] hover:border-[#aaa] -mb-px transition-colors"
                    >
                        <Users size={15} /> Contatos
                    </Link>
                    <Link
                        href="/admin/crm/activities"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 border-transparent text-[#777] hover:text-[#333] hover:border-[#aaa] -mb-px transition-colors"
                    >
                        <Tag size={15} /> Atividades
                    </Link>
                    {/* Quick action: Export to Marketing */}
                    <div className="ml-auto px-3">
                        <Link
                            href="/admin/crm/linkedin"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#3c8dbc] text-white rounded hover:bg-[#367fa9]"
                        >
                            <Send size={12} /> Exportar para Marketing
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Contatos" value={contacts.length} color="#3c8dbc" icon={<User size={22} />} />
                <StatCard label="Em Negociação" value={contacts.filter(c => ['PROPOSTA', 'NEGOCIACAO'].includes(c.stage)).length} color="#f39c12" icon={<TrendingUp size={22} />} />
                <StatCard label="Pipeline" value={pipelineValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} color="#8e44ad" icon={<DollarSign size={22} />} />
                <StatCard label="Contratos Ganhos" value={totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} color="#00a65a" icon={<Star size={22} />} />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 border border-[#d2d6de] rounded px-2 py-1.5 bg-white">
                    <Search size={14} className="text-[#999]" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar contatos..." className="text-sm outline-none w-48" />
                </div>
                <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#3c8dbc] rounded hover:bg-[#367fa9]">
                    <Plus size={16} />
                    Novo Contato
                </button>
            </div>

            {/* New contact form */}
            {showNew && (
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-4 space-y-3">
                    <h3 className="font-bold text-[#333]">Novo Contato</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input value={newContact.name || ''} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} placeholder="Nome *" className="border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        <input value={newContact.email || ''} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        <input value={newContact.phone || ''} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} placeholder="Telefone/WhatsApp" className="border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        <input value={newContact.company || ''} onChange={e => setNewContact(p => ({ ...p, company: e.target.value }))} placeholder="Empresa" className="border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        <select value={newContact.type} onChange={e => setNewContact(p => ({ ...p, type: e.target.value }))} className="border border-[#d2d6de] rounded px-3 py-2 text-sm">
                            <option value="LEAD">Lead</option>
                            <option value="PROSPECT">Prospect</option>
                            <option value="CLIENT">Cliente</option>
                            <option value="PARTNER">Parceiro</option>
                        </select>
                        <select value={newContact.stage} onChange={e => setNewContact(p => ({ ...p, stage: e.target.value as Stage }))} className="border border-[#d2d6de] rounded px-3 py-2 text-sm">
                            {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                        <input type="number" value={newContact.estimatedValue || ''} onChange={e => setNewContact(p => ({ ...p, estimatedValue: parseFloat(e.target.value) }))} placeholder="Valor Estimado (R$)" className="border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        <div className="flex gap-2">
                            <button onClick={createContact} className="flex-1 bg-[#00a65a] text-white font-bold text-sm rounded px-4 py-2 hover:bg-[#008d4c]">Criar</button>
                            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-[#777]">X</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban Board */}
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                    {STAGES.map(stage => {
                        const stageContacts = filtered.filter(c => c.stage === stage.key)
                        const stageValue = stageContacts.reduce((s, c) => s + (c.estimatedValue || 0), 0)
                        return (
                            <div key={stage.key} className="w-64 flex flex-col">
                                {/* Column header */}
                                <div className="flex items-center justify-between px-3 py-2.5 rounded-t-lg" style={{ backgroundColor: stage.bg, borderBottom: `3px solid ${stage.color}` }}>
                                    <div>
                                        <span className="font-bold text-sm" style={{ color: stage.color }}>{stage.label}</span>
                                        <div className="text-[10px] text-[#777]">{stageContacts.length} contatos</div>
                                    </div>
                                    {stageValue > 0 && (
                                        <div className="text-[10px] font-bold text-[#555]">
                                            {stageValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </div>
                                    )}
                                </div>
                                {/* Cards */}
                                <div className="flex-1 bg-[#f4f4f4] rounded-b-lg p-2 space-y-2 min-h-[300px]">
                                    {stageContacts.map(c => (
                                        <ContactCard
                                            key={c.id}
                                            c={c}
                                            onEdit={() => { }}
                                            onDelete={() => deleteContact(c.id)}
                                            onMove={(s) => moveContact(c.id, s)}
                                        />
                                    ))}
                                    {stageContacts.length === 0 && (
                                        <div className="text-center py-8 text-[#ccc]">
                                            <div className="text-xs">Nenhum contato</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, color, icon }: any) {
    return (
        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <div>
                    <div className="text-lg font-bold" style={{ color }}>{value}</div>
                    <div className="text-xs text-[#777] mt-0.5">{label}</div>
                </div>
                <div className="opacity-30" style={{ color }}>{icon}</div>
            </div>
        </div>
    )
}
