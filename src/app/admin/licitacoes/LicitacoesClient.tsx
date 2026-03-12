'use client'

import { useState, useTransition } from 'react'
import {
    FileSearch, Plus, Eye, Edit2, Trash2, ExternalLink,
    Search, Trophy, X, TrendingUp, FileText
} from 'lucide-react'
import { createLicitacao, updateLicitacao, deleteLicitacao } from '@/app/actions/licitacoes'
import { useRouter } from 'next/navigation'

type Status = 'MONITORANDO' | 'PARTICIPANDO' | 'VENCEMOS' | 'PERDEMOS' | 'SUSPENSO' | 'CANCELADO'
type Modalidade = 'PREGAO_ELETRONICO' | 'CONCORRENCIA' | 'TOMADA_PRECOS' | 'CONVITE' | 'LEILAO'

interface Licitacao {
    id: string
    numero: string
    orgao: string
    objeto: string
    modalidade: Modalidade
    valorEstimado?: number | null
    valorProposta?: number | null
    valorVencedor?: number | null
    status: Status
    dataPublicacao?: Date | string | null
    dataAbertura?: Date | string | null
    dataEncerramento?: Date | string | null
    editalUrl?: string | null
    portalUrl?: string | null
    descricao?: string | null
    observacoes?: string | null
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: any; borderColor: string }> = {
    MONITORANDO: { label: 'Monitorando', color: 'text-blue-600', bg: 'bg-blue-50', icon: Eye, borderColor: '#3c8dbc' },
    PARTICIPANDO: { label: 'Participando', color: 'text-orange-600', bg: 'bg-orange-50', icon: TrendingUp, borderColor: '#f39c12' },
    VENCEMOS: { label: 'Vencemos!', color: 'text-green-600', bg: 'bg-green-50', icon: Trophy, borderColor: '#00a65a' },
    PERDEMOS: { label: 'Perdemos', color: 'text-red-600', bg: 'bg-red-50', icon: X, borderColor: '#dd4b39' },
    SUSPENSO: { label: 'Suspenso', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: FileText, borderColor: '#f39c12' },
    CANCELADO: { label: 'Cancelado', color: 'text-gray-500', bg: 'bg-gray-50', icon: X, borderColor: '#999' },
}

const MODALIDADE_LABELS: Record<Modalidade, string> = {
    PREGAO_ELETRONICO: 'Pregão Eletrônico',
    CONCORRENCIA: 'Concorrência',
    TOMADA_PRECOS: 'Tomada de Preços',
    CONVITE: 'Convite',
    LEILAO: 'Leilão',
}

function formatCurrency(v?: number | null) {
    if (!v) return '—'
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(d?: Date | string | null) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('pt-BR')
}

function toInputDate(d?: Date | string | null) {
    if (!d) return ''
    return new Date(d).toISOString().split('T')[0]
}

function LicitacaoModal({
    item, onClose, onSave
}: {
    item?: Licitacao | null
    onClose: () => void
    onSave: (fd: FormData, id?: string) => void
}) {
    const [pending, startTransition] = useTransition()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(() => {
            onSave(fd, item?.id)
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-lg font-bold text-[#333]">{item ? 'Editar Licitação' : 'Nova Licitação'}</h2>
                    <button type="button" onClick={onClose}><X size={20} className="text-[#777]" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Número *</label>
                                <input name="numero" defaultValue={item?.numero || ''} required className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Ex: PE 001/2026" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Modalidade</label>
                                <select name="modalidade" defaultValue={item?.modalidade || 'PREGAO_ELETRONICO'} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm">
                                    {Object.entries(MODALIDADE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Órgão Licitante *</label>
                            <input name="orgao" defaultValue={item?.orgao || ''} required className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Objeto</label>
                            <textarea name="objeto" defaultValue={item?.objeto || ''} rows={3} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Valor Estimado</label>
                                <input name="valorEstimado" type="number" step="0.01" defaultValue={item?.valorEstimado || ''} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Nossa Proposta</label>
                                <input name="valorProposta" type="number" step="0.01" defaultValue={item?.valorProposta || ''} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Valor Vencedor</label>
                                <input name="valorVencedor" type="number" step="0.01" defaultValue={item?.valorVencedor || ''} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Publicação</label>
                                <input name="dataPublicacao" type="date" defaultValue={toInputDate(item?.dataPublicacao)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Abertura</label>
                                <input name="dataAbertura" type="date" defaultValue={toInputDate(item?.dataAbertura)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Encerramento</label>
                                <input name="dataEncerramento" type="date" defaultValue={toInputDate(item?.dataEncerramento)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Link do Edital</label>
                                <input name="editalUrl" defaultValue={item?.editalUrl || ''} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Status</label>
                                <select name="status" defaultValue={item?.status || 'MONITORANDO'} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm">
                                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Observações</label>
                            <textarea name="observacoes" defaultValue={item?.observacoes || ''} rows={3} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-5 border-t bg-[#f9f9f9]">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#777]">Cancelar</button>
                        <button type="submit" disabled={pending} className="px-6 py-2 text-sm font-bold text-white bg-[#3c8dbc] rounded hover:bg-[#367fa9] disabled:opacity-60">
                            {pending ? 'Salvando...' : item ? 'Salvar Alterações' : 'Cadastrar Licitação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function LicitacoesClient({ initialItems }: { initialItems: Licitacao[] }) {
    const router = useRouter()
    const [items, setItems] = useState<Licitacao[]>(initialItems)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState<Licitacao | null>(null)
    const [, startTransition] = useTransition()

    const filtered = items.filter(l => {
        if (filterStatus !== 'ALL' && l.status !== filterStatus) return false
        if (search && !l.numero.toLowerCase().includes(search.toLowerCase())
            && !l.orgao.toLowerCase().includes(search.toLowerCase())
            && !(l.objeto || '').toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const vencemos = items.filter(l => l.status === 'VENCEMOS').length
    const participando = items.filter(l => l.status === 'PARTICIPANDO').length
    const monitorando = items.filter(l => l.status === 'MONITORANDO').length
    const totalContratos = items.filter(l => l.status === 'VENCEMOS').reduce((s, l) => s + (l.valorVencedor || 0), 0)

    const handleSave = (fd: FormData, id?: string) => {
        if (id) {
            updateLicitacao(id, fd).then(() => {
                router.refresh()
                setShowModal(false)
                setEditItem(null)
            })
        } else {
            createLicitacao(fd).then(() => {
                router.refresh()
                setShowModal(false)
            })
        }
    }

    const handleDelete = (id: string) => {
        if (!confirm('Excluir esta licitação?')) return
        startTransition(() => {
            deleteLicitacao(id).then(() => {
                setItems(p => p.filter(x => x.id !== id))
            })
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <FileSearch className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Licitações</h1>
                </div>
                <div className="text-[12px] text-[#777]">Home &gt; Licitações</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total" value={items.length} color="#3c8dbc" icon={<FileSearch size={22} />} />
                <StatCard label="Monitorando" value={monitorando} color="#f39c12" icon={<Eye size={22} />} />
                <StatCard label="Participando" value={participando} color="#8e44ad" icon={<TrendingUp size={22} />} />
                <StatCard label="Vencemos" value={vencemos} color="#00a65a" icon={<Trophy size={22} />} />
            </div>

            {totalContratos > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-sm p-4 flex items-center gap-3">
                    <Trophy size={24} className="text-green-600" />
                    <div>
                        <div className="font-bold text-green-700">Total em Contratos Ganhos</div>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalContratos)}</div>
                    </div>
                </div>
            )}

            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                    <h3 className="text-[16px] font-normal text-[#333]">Licitações Cadastradas</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 border border-[#d2d6de] rounded px-2 py-1.5">
                            <Search size={14} className="text-[#999]" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="text-sm outline-none w-40" />
                        </div>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs border border-[#d2d6de] rounded px-2 py-1.5 text-[#555]">
                            <option value="ALL">Todos os status</option>
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        <button onClick={() => { setEditItem(null); setShowModal(true) }} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#3c8dbc] rounded hover:bg-[#367fa9]">
                            <Plus size={14} />
                            Nova Licitação
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#f9f9f9] border-b border-[#f4f4f4]">
                                <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Número</th>
                                <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Órgão</th>
                                <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Objeto</th>
                                <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Modalidade</th>
                                <th className="text-right p-3 text-xs font-bold text-[#555] uppercase">Val. Estimado</th>
                                <th className="text-right p-3 text-xs font-bold text-[#555] uppercase">Nossa Proposta</th>
                                <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Abertura</th>
                                <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Status</th>
                                <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(l => {
                                const s = STATUS_CONFIG[l.status]
                                const StatusIcon = s.icon
                                return (
                                    <tr key={l.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]" style={{ borderLeftColor: s.borderColor, borderLeftWidth: 3 }}>
                                        <td className="p-3 font-mono font-bold text-[#3c8dbc] text-xs">{l.numero}</td>
                                        <td className="p-3 text-[#555] max-w-[180px]">
                                            <div className="truncate" title={l.orgao}>{l.orgao}</div>
                                        </td>
                                        <td className="p-3 max-w-[220px]">
                                            <div className="line-clamp-2 text-xs text-[#555]" title={l.objeto}>{l.objeto}</div>
                                        </td>
                                        <td className="p-3 text-xs text-[#777]">{MODALIDADE_LABELS[l.modalidade]}</td>
                                        <td className="p-3 text-right text-xs font-semibold text-[#555]">{formatCurrency(l.valorEstimado)}</td>
                                        <td className="p-3 text-right text-xs font-bold text-[#3c8dbc]">{formatCurrency(l.valorProposta)}</td>
                                        <td className="p-3 text-center text-xs text-[#777]">{formatDate(l.dataAbertura)}</td>
                                        <td className="p-3 text-center">
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${s.bg} ${s.color}`}>
                                                <StatusIcon size={11} />
                                                {s.label}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => { setEditItem(l); setShowModal(true) }} className="p-1.5 bg-[#3c8dbc] text-white rounded-sm" title="Editar"><Edit2 size={12} /></button>
                                                {l.editalUrl && (
                                                    <a href={l.editalUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-[#605ca8] text-white rounded-sm" title="Ver Edital"><ExternalLink size={12} /></a>
                                                )}
                                                <button onClick={() => handleDelete(l.id)} className="p-1.5 bg-[#dd4b39] text-white rounded-sm" title="Excluir"><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="text-center py-12 text-[#aaa]">
                                        <FileSearch size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Nenhuma licitação encontrada</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <LicitacaoModal
                    item={editItem}
                    onClose={() => { setShowModal(false); setEditItem(null) }}
                    onSave={handleSave}
                />
            )}
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
