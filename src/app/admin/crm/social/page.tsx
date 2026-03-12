'use client'

import { useState, useRef } from 'react'
import {
    Instagram, Facebook, Search, Loader2, AlertCircle, CheckCircle2,
    Upload, Users, User, ExternalLink, Sparkles, Mail, Plus,
    Info, FileText, X, Tag, Building, Link2
} from 'lucide-react'
import Link from 'next/link'
import { bulkCreateLeads } from '@/app/actions/leads'

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface InstagramLead {
    _uid: string
    instagramHandle: string
    fullName: string
    biography: string
    followersCount: number
    isVerified: boolean
    engagementType?: string
    sourceProfile?: string
    // Enrichment
    email?: string
    emailLoading?: boolean
    aiScore?: number
    aiSummary?: string
    aiLoading?: boolean
    addedToCRM?: boolean
}

interface TargetProfile {
    instagramHandle: string
    fullName: string
    biography: string
    followersCount: number
    followingCount: number
    postsCount: number
    isVerified: boolean
    category: string
    website: string
}

function uid() {
    return Math.random().toString(36).slice(2, 10)
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function SocialMediaPage() {
    const [activeTab, setActiveTab] = useState<'instagram' | 'facebook'>('instagram')
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    return (
        <div className="space-y-4">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white text-sm flex items-center gap-2 ${toast.type === 'success' ? 'bg-[#00a65a]' : 'bg-[#dd4b39]'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Instagram className="h-[22px] w-[22px] text-[#c13584]" />
                    <h1 className="text-[24px] font-normal m-0">Social Media — Coleta de Leads</h1>
                </div>
                <div className="text-[12px] text-[#777]">Home &gt; CRM &gt; Social Media</div>
            </div>

            {/* CRM Nav */}
            <CRMNav active="social" />

            {/* Tips */}
            <div className="bg-[#d9edf7] border border-[#bce8f1] rounded-sm px-4 py-3 flex gap-3 text-sm text-[#31708f]">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                    <strong>Como usar:</strong> Insira o @ de um concorrente (ex: @leilaoautoshow) para coletar as pessoas que engajam com ele.
                    Esses são potenciais <strong>arrematantes (B2C)</strong> interessados em leilões de veículos.
                    Analisamos comentaristas e curtidores dos posts recentes.
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm">
                <div className="flex border-b border-[#d2d6de]">
                    <button
                        onClick={() => setActiveTab('instagram')}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${activeTab === 'instagram' ? 'border-[#c13584] text-[#c13584]' : 'border-transparent text-[#777] hover:text-[#333]'}`}
                    >
                        <Instagram size={16} /> Instagram
                    </button>
                    <button
                        onClick={() => setActiveTab('facebook')}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${activeTab === 'facebook' ? 'border-[#3b5998] text-[#3b5998]' : 'border-transparent text-[#777] hover:text-[#333]'}`}
                    >
                        <Facebook size={16} /> Facebook
                    </button>
                </div>

                <div className="p-5">
                    {activeTab === 'instagram' && (
                        <InstagramTab showToast={showToast} />
                    )}
                    {activeTab === 'facebook' && (
                        <FacebookTab showToast={showToast} />
                    )}
                </div>
            </div>

            {/* Manual Import */}
            <ManualImportSection showToast={showToast} />
        </div>
    )
}

// ─── INSTAGRAM TAB ─────────────────────────────────────────────────────────────

function InstagramTab({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) {
    const [username, setUsername] = useState('')
    const [maxLeads, setMaxLeads] = useState(20)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [targetProfile, setTargetProfile] = useState<TargetProfile | null>(null)
    const [leads, setLeads] = useState<InstagramLead[]>([])
    const [note, setNote] = useState('')

    const handleCollect = async () => {
        if (!username.trim()) return
        setLoading(true)
        setError('')
        setLeads([])
        setTargetProfile(null)
        setNote('')

        try {
            const res = await fetch('/api/crm/instagram-scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.replace(/^@/, ''), maxLeads }),
            })
            const data = await res.json()

            if (!res.ok || data.error) {
                setError(data.error || 'Erro ao coletar leads')
                return
            }

            if (data.targetProfile) setTargetProfile(data.targetProfile)
            if (data.note) setNote(data.note)

            const newLeads: InstagramLead[] = (data.leads || []).map((l: any) => ({
                ...l,
                _uid: uid(),
            }))
            setLeads(newLeads)
        } catch {
            setError('Erro de conexão. Verifique sua internet.')
        } finally {
            setLoading(false)
        }
    }

    const analyzeAll = async () => {
        if (leads.length === 0) return
        setLeads(prev => prev.map(l => ({ ...l, aiLoading: true })))

        try {
            const res = await fetch('/api/crm/ai-qualify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leads: leads.map(l => ({
                        name: l.fullName || l.instagramHandle,
                        headline: l.biography,
                        source: 'INSTAGRAM',
                        location: 'Brasil',
                    })),
                }),
            })
            const data = await res.json()
            const results: any[] = data.results || []
            setLeads(prev => prev.map((l, i) => {
                const r = results[i]
                return r ? { ...l, aiScore: r.score, aiSummary: r.summary, aiLoading: false } : { ...l, aiLoading: false }
            }))
            showToast(`${results.length} leads qualificados com IA!`)
        } catch {
            setLeads(prev => prev.map(l => ({ ...l, aiLoading: false })))
            showToast('Erro na análise IA', 'error')
        }
    }

    const addAllToCRM = async () => {
        const toAdd = leads.filter(l => !l.addedToCRM)
        if (toAdd.length === 0) { showToast('Todos já foram adicionados', 'error'); return }

        const result = await bulkCreateLeads(toAdd.map(l => ({
            name: l.fullName || l.instagramHandle,
            instagramHandle: l.instagramHandle,
            source: 'INSTAGRAM',
            segment: 'B2C',
            leadType: 'ARREMATANTE',
            aiScore: l.aiScore,
            aiSummary: l.aiSummary,
            notes: l.biography ? `Bio: ${l.biography}` : undefined,
        })))

        if (result.success) {
            setLeads(prev => prev.map(l => ({ ...l, addedToCRM: true })))
            showToast(`${result.count} leads adicionados ao CRM!`)
        } else {
            showToast('Erro ao importar', 'error')
        }
    }

    return (
        <div className="space-y-5">
            {/* Search controls */}
            <div className="flex gap-3 items-end">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-[#555] mb-1">Username do Concorrente</label>
                    <div className="flex items-center border border-[#d2d6de] rounded overflow-hidden">
                        <span className="px-3 py-2 bg-[#f9f9f9] text-[#777] text-sm border-r border-[#d2d6de]">@</span>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value.replace(/^@/, ''))}
                            placeholder="leilaoautoshow"
                            className="flex-1 px-3 py-2 text-sm outline-none"
                            onKeyDown={e => e.key === 'Enter' && handleCollect()}
                        />
                    </div>
                    <div className="text-[11px] text-[#aaa] mt-1">Ex: leilaoautoshow, leilaodeveiculos, patiodeveiculos</div>
                </div>
                <div className="w-36">
                    <label className="block text-xs font-bold text-[#555] mb-1">Máx. de Leads</label>
                    <select
                        value={maxLeads}
                        onChange={e => setMaxLeads(Number(e.target.value))}
                        className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm"
                    >
                        {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} leads</option>)}
                    </select>
                </div>
                <button
                    onClick={handleCollect}
                    disabled={loading || !username.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-[#c13584] text-white font-bold text-sm rounded hover:bg-[#a52d6f] disabled:opacity-60"
                >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Instagram size={15} />}
                    {loading ? 'Coletando...' : 'Coletar Leads'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-[#f2dede] border border-[#ebccd1] rounded-sm px-4 py-3 text-sm text-[#a94442] flex gap-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Target profile card */}
            {targetProfile && (
                <div className="bg-[#fafafa] border border-[#d2d6de] rounded-sm p-4">
                    <div className="text-xs font-bold text-[#777] uppercase mb-3">Perfil Analisado</div>
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c13584] to-[#f56040] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {(targetProfile.fullName || targetProfile.instagramHandle).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-[#333] flex items-center gap-2">
                                @{targetProfile.instagramHandle}
                                {targetProfile.isVerified && <CheckCircle2 size={14} className="text-[#3c8dbc]" />}
                            </div>
                            <div className="text-sm text-[#555]">{targetProfile.fullName}</div>
                            {targetProfile.category && <div className="text-xs text-[#777]">{targetProfile.category}</div>}
                            {targetProfile.biography && <div className="text-xs text-[#555] mt-1 max-w-md">{targetProfile.biography}</div>}
                            <div className="flex gap-4 mt-2 text-sm">
                                <Stat label="Seguidores" value={targetProfile.followersCount.toLocaleString()} />
                                <Stat label="Seguindo" value={targetProfile.followingCount.toLocaleString()} />
                                <Stat label="Posts" value={targetProfile.postsCount.toLocaleString()} />
                            </div>
                        </div>
                        {targetProfile.website && (
                            <a href={targetProfile.website} target="_blank" rel="noreferrer" className="text-sm text-[#3c8dbc] flex items-center gap-1 hover:underline">
                                <ExternalLink size={13} /> Site
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Note */}
            {note && (
                <div className="bg-[#dff0d8] border border-[#d6e9c6] rounded-sm px-4 py-2 text-sm text-[#3c763d]">
                    {note}
                </div>
            )}

            {/* Leads results */}
            {leads.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-sm text-[#333]">{leads.length} Leads Coletados</div>
                        <div className="flex gap-2">
                            <button
                                onClick={analyzeAll}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#8e44ad] text-white rounded hover:bg-[#7d3c98]"
                            >
                                <Sparkles size={12} /> Analisar todos com IA
                            </button>
                            <button
                                onClick={addAllToCRM}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#00a65a] text-white rounded hover:bg-[#008d4c]"
                            >
                                <Plus size={12} /> Adicionar todos ao CRM
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {leads.map(lead => (
                            <InstagramLeadCard key={lead._uid} lead={lead} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state after search */}
            {!loading && !error && leads.length === 0 && targetProfile && (
                <div className="text-center py-8 text-[#aaa]">
                    <Users size={32} className="mx-auto mb-2 opacity-40" />
                    <div className="text-sm">Nenhum engajador encontrado nos posts recentes.</div>
                    <div className="text-xs mt-1">Para coletar seguidores diretamente, é necessário autenticação com cookie de sessão.</div>
                </div>
            )}
        </div>
    )
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center">
            <div className="font-bold text-[#333]">{value}</div>
            <div className="text-[10px] text-[#aaa]">{label}</div>
        </div>
    )
}

function InstagramLeadCard({ lead }: { lead: InstagramLead }) {
    return (
        <div className={`bg-white border border-[#d2d6de] rounded-sm p-3 ${lead.addedToCRM ? 'border-[#00a65a] bg-[#f9fff9]' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c13584] to-[#f56040] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(lead.fullName || lead.instagramHandle).charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className="font-semibold text-sm text-[#333] flex items-center gap-1.5">
                        @{lead.instagramHandle}
                        {lead.isVerified && <CheckCircle2 size={12} className="text-[#3c8dbc]" />}
                        {lead.addedToCRM && <span className="text-[9px] bg-[#d4f4e2] text-[#00a65a] px-1.5 py-0.5 rounded-full font-bold">NO CRM</span>}
                    </div>
                    {lead.fullName && <div className="text-xs text-[#777]">{lead.fullName}</div>}
                </div>
            </div>
            {lead.biography && <div className="text-xs text-[#555] mb-2 line-clamp-2">{lead.biography}</div>}
            {lead.engagementType && (
                <span className="text-[10px] bg-[#f4f4f4] text-[#666] px-2 py-0.5 rounded-full">
                    {lead.engagementType === 'COMMENTER' ? 'Comentou' : 'Curtiu'}
                </span>
            )}
            {lead.aiLoading && (
                <div className="flex items-center gap-1 mt-2 text-xs text-[#8e44ad]">
                    <Loader2 size={12} className="animate-spin" /> Analisando...
                </div>
            )}
            {lead.aiScore != null && (
                <div className="mt-2 text-xs text-[#555]">
                    Score: <strong style={{ color: lead.aiScore >= 70 ? '#00a65a' : lead.aiScore >= 50 ? '#f39c12' : '#dd4b39' }}>{lead.aiScore}</strong>
                    {lead.aiSummary && <span className="ml-1 text-[#777]">— {lead.aiSummary}</span>}
                </div>
            )}
        </div>
    )
}

// ─── FACEBOOK TAB ──────────────────────────────────────────────────────────────

function FacebookTab({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) {
    const [pageUrl, setPageUrl] = useState('')
    const [csvText, setCsvText] = useState('')
    const [importing, setImporting] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = ev => {
            const text = (ev.target?.result as string) || ''
            setCsvText(text)
        }
        reader.readAsText(file)
    }

    const handleImportCSV = async () => {
        if (!csvText.trim()) { showToast('Cole ou carregue um CSV primeiro', 'error'); return }

        setImporting(true)
        try {
            // Parse CSV: expect columns: name, email, phone (first row = header)
            const lines = csvText.trim().split('\n')
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
            const nameIdx = headers.findIndex(h => ['name', 'nome'].includes(h))
            const emailIdx = headers.findIndex(h => ['email', 'e-mail'].includes(h))
            const phoneIdx = headers.findIndex(h => ['phone', 'telefone', 'celular', 'whatsapp'].includes(h))

            if (nameIdx === -1) {
                showToast('Coluna "name" ou "nome" não encontrada no CSV', 'error')
                return
            }

            const leads = lines.slice(1).filter(Boolean).map(line => {
                const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
                return {
                    name: cols[nameIdx] || 'Desconhecido',
                    email: emailIdx !== -1 ? (cols[emailIdx] || undefined) : undefined,
                    phone: phoneIdx !== -1 ? (cols[phoneIdx] || undefined) : undefined,
                    source: 'FACEBOOK' as const,
                    segment: 'B2C',
                    leadType: 'ARREMATANTE',
                }
            }).filter(l => l.name && l.name !== 'Desconhecido')

            if (leads.length === 0) { showToast('Nenhum lead válido encontrado no CSV', 'error'); return }

            const result = await bulkCreateLeads(leads)
            if (result.success) {
                showToast(`${result.count} leads importados do Facebook/CSV!`)
                setCsvText('')
            } else {
                showToast(result.error || 'Erro ao importar', 'error')
            }
        } finally {
            setImporting(false)
        }
    }

    return (
        <div className="space-y-5">
            {/* Page URL input */}
            <div>
                <label className="block text-xs font-bold text-[#555] mb-1">URL da Página / Grupo do Facebook</label>
                <div className="flex gap-2">
                    <input
                        value={pageUrl}
                        onChange={e => setPageUrl(e.target.value)}
                        placeholder="https://www.facebook.com/groups/leilaodeveiculos"
                        className="flex-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3b5998]"
                    />
                </div>
                <div className="mt-2 bg-[#fcf8e3] border border-[#faebcc] rounded-sm px-4 py-3 flex gap-2 text-sm text-[#8a6d3b]">
                    <Info size={15} className="flex-shrink-0 mt-0.5" />
                    <div>
                        A API pública do Facebook foi descontinuada. Para coleta avançada, use o módulo de importação de planilha abaixo.
                        Você pode exportar membros de grupos via ferramentas de extensão (Phantombuster, etc.) e importar o CSV aqui.
                    </div>
                </div>
            </div>

            {/* CSV Import */}
            <div className="border border-[#d2d6de] rounded-sm p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-[#333]">
                    <Upload size={16} className="text-[#3b5998]" />
                    Importar CSV / Planilha
                </div>

                <div className="text-xs text-[#777]">
                    Colunas aceitas: <code className="bg-[#f4f4f4] px-1 rounded">name</code> (ou <code className="bg-[#f4f4f4] px-1 rounded">nome</code>),{' '}
                    <code className="bg-[#f4f4f4] px-1 rounded">email</code>,{' '}
                    <code className="bg-[#f4f4f4] px-1 rounded">phone</code> (ou <code className="bg-[#f4f4f4] px-1 rounded">telefone</code>)
                </div>

                <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-[#d2d6de] rounded text-sm text-[#555] hover:bg-[#f4f4f4]"
                >
                    <FileText size={15} /> Escolher arquivo CSV/XLSX
                </button>
                <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />

                <textarea
                    value={csvText}
                    onChange={e => setCsvText(e.target.value)}
                    placeholder={`Cole o conteúdo do CSV aqui:\nname,email,phone\nJoão Silva,joao@email.com,11999990001\n...`}
                    rows={6}
                    className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#3b5998] resize-y"
                />

                <button
                    onClick={handleImportCSV}
                    disabled={importing || !csvText.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3b5998] text-white font-bold text-sm rounded hover:bg-[#2d4680] disabled:opacity-60"
                >
                    {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                    {importing ? 'Importando...' : 'Importar Leads'}
                </button>
            </div>
        </div>
    )
}

// ─── MANUAL IMPORT SECTION ─────────────────────────────────────────────────────

function ManualImportSection({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) {
    const [urls, setUrls] = useState('')
    const [importing, setImporting] = useState(false)

    const handleImport = async () => {
        if (!urls.trim()) return
        setImporting(true)

        const lines = urls.trim().split('\n').filter(Boolean)
        const leads = lines.map(line => {
            line = line.trim()
            let source = 'MANUAL'
            let linkedinUrl: string | undefined
            let instagramHandle: string | undefined

            if (line.includes('linkedin.com')) {
                source = 'LINKEDIN'
                linkedinUrl = line
            } else if (line.includes('instagram.com') || line.startsWith('@')) {
                source = 'INSTAGRAM'
                instagramHandle = line.replace(/.*instagram\.com\//, '').replace(/^@/, '').replace(/\/.*$/, '')
            }

            // Extract a name attempt from URL
            const namePart = line
                .replace(/https?:\/\/(www\.)?(linkedin\.com\/in\/|instagram\.com\/)/, '')
                .replace(/[@/].*/, '')
                .replace(/-/g, ' ')
                .replace(/[^a-zA-Z\s]/g, '')
                .trim()

            const name = namePart.length > 2
                ? namePart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                : 'Lead Importado'

            return { name, linkedinUrl, instagramHandle, source, segment: 'B2B', leadType: 'PROSPECT_B2B' }
        })

        const result = await bulkCreateLeads(leads)
        if (result.success) {
            showToast(`${result.count} leads importados manualmente!`)
            setUrls('')
        } else {
            showToast(result.error || 'Erro ao importar', 'error')
        }
        setImporting(false)
    }

    return (
        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm">
            <div className="bg-[#f9f9f9] px-4 py-3 border-b border-[#d2d6de] rounded-t-sm">
                <div className="flex items-center gap-2 font-bold text-sm text-[#333]">
                    <Link2 size={16} className="text-[#777]" />
                    Importação Manual de Perfis
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="text-sm text-[#777]">
                    Cole URLs de perfis do LinkedIn ou Instagram (um por linha). O sistema tentará extrair o nome e importar como lead.
                </div>
                <textarea
                    value={urls}
                    onChange={e => setUrls(e.target.value)}
                    placeholder={`https://linkedin.com/in/joao-silva\nhttps://www.instagram.com/maria.compras\n@pedro_revendas\nhttps://linkedin.com/in/ana-gestora-detran`}
                    rows={5}
                    className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#3c8dbc] resize-y"
                />
                <button
                    onClick={handleImport}
                    disabled={importing || !urls.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3c8dbc] text-white font-bold text-sm rounded hover:bg-[#367fa9] disabled:opacity-60"
                >
                    {importing ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                    {importing ? 'Enriquecendo e Importando...' : 'Enriquecer e Importar'}
                </button>
            </div>
        </div>
    )
}

// ─── CRM NAV ──────────────────────────────────────────────────────────────────

function CRMNav({ active }: { active: string }) {
    const tabs = [
        { key: 'pipeline', label: 'Pipeline', href: '/admin/crm' },
        { key: 'linkedin', label: 'LinkedIn Hunter', href: '/admin/crm/linkedin' },
        { key: 'social', label: 'Social Media', href: '/admin/crm/social' },
        { key: 'contacts', label: 'Contatos', href: '/admin/crm/contacts' },
        { key: 'activities', label: 'Atividades', href: '/admin/crm/activities' },
    ]

    return (
        <div className="flex gap-0 border-b border-[#d2d6de] bg-white">
            {tabs.map(t => (
                <Link
                    key={t.key}
                    href={t.href}
                    className={`px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${active === t.key
                        ? 'border-[#3c8dbc] text-[#3c8dbc]'
                        : 'border-transparent text-[#777] hover:text-[#333] hover:border-[#aaa]'
                        }`}
                >
                    {t.label}
                </Link>
            ))}
        </div>
    )
}
