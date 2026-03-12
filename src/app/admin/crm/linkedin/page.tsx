'use client'

import { useState, useCallback } from "react"
import {
    Linkedin, Search, Sparkles, Mail, Plus, CheckSquare, Square,
    Loader2, AlertCircle, Info, ChevronLeft, ChevronRight,
    Building, MapPin, Briefcase, Tag, BarChart2, ListPlus, Send,
    ExternalLink, X, CheckCircle2, Users
} from "lucide-react"
import Link from 'next/link'
import { bulkCreateLeads } from "@/app/actions/leads"

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface SearchLead {
    _uid: string // client-side only
    name: string
    headline: string
    position: string
    company: string
    location: string
    linkedinUrl: string
    snippet: string
    mock?: boolean
    // Enrichment
    aiScore?: number
    aiSummary?: string
    aiApproach?: string
    aiTags?: string[]
    aiSegment?: string
    aiLeadType?: string
    aiLoading?: boolean
    email?: string
    emailLoading?: boolean
    emailError?: string
    addedToCRM?: boolean
}

interface SearchForm {
    campaignName: string
    keywords: string
    jobTitle: string
    company: string
    location: string
    industry: string
    segment: string
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function uid() {
    return Math.random().toString(36).slice(2, 10)
}

function scoreColor(score?: number) {
    if (!score) return '#aaa'
    if (score >= 80) return '#00a65a'
    if (score >= 60) return '#f39c12'
    return '#dd4b39'
}

function leadTypeBadge(type?: string) {
    switch (type) {
        case 'COMITENTE': return { label: 'Comitente', color: '#3c8dbc' }
        case 'ARREMATANTE': return { label: 'Arrematante', color: '#00a65a' }
        case 'PARCEIRO': return { label: 'Parceiro', color: '#8e44ad' }
        default: return { label: 'Prospect B2B', color: '#f39c12' }
    }
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function LinkedInHunterPage() {
    const [form, setForm] = useState<SearchForm>({
        campaignName: '',
        keywords: '',
        jobTitle: 'Diretor de Patrimônio',
        company: 'DETRAN',
        location: 'São Paulo',
        industry: 'Governo',
        segment: 'B2B',
    })
    const [leads, setLeads] = useState<SearchLead[]>([])
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [searching, setSearching] = useState(false)
    const [pageNum, setPageNum] = useState(0)
    const [warning, setWarning] = useState<string>('')
    const [searchError, setSearchError] = useState<string>('')
    const [bulkLoading, setBulkLoading] = useState<'email' | 'ai' | 'crm' | null>(null)
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3500)
    }

    // ─── SEARCH ──────────────────────────────────────────────────────────────

    const handleSearch = useCallback(async (page = 0) => {
        setSearching(true)
        setSearchError('')
        setWarning('')
        setPageNum(page)

        try {
            const res = await fetch('/api/crm/linkedin-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keywords: form.keywords,
                    jobTitle: form.jobTitle,
                    company: form.company,
                    location: form.location,
                    industry: form.industry,
                    pageNum: page,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setSearchError(data.error || 'Erro ao buscar leads')
                return
            }

            if (data.warning) setWarning(data.warning)

            const newLeads: SearchLead[] = (data.leads || []).map((l: any) => ({
                ...l,
                _uid: uid(),
            }))

            setLeads(page === 0 ? newLeads : prev => [...prev, ...newLeads])
            setSelected(new Set())
        } catch (err) {
            setSearchError('Erro de conexão. Verifique sua internet.')
        } finally {
            setSearching(false)
        }
    }, [form])

    // ─── AI QUALIFY (single) ────────────────────────────────────────────────

    const analyzeOne = async (lead: SearchLead) => {
        setLeads(prev => prev.map(l => l._uid === lead._uid ? { ...l, aiLoading: true } : l))

        try {
            const res = await fetch('/api/crm/ai-qualify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leads: [{ name: lead.name, headline: lead.headline, company: lead.company, position: lead.position, industry: form.industry, location: lead.location }] }),
            })
            const data = await res.json()
            const result = data.results?.[0]

            if (result) {
                setLeads(prev => prev.map(l => l._uid === lead._uid ? {
                    ...l,
                    aiScore: result.score,
                    aiSummary: result.summary,
                    aiApproach: result.approach,
                    aiTags: result.tags,
                    aiSegment: result.segment,
                    aiLeadType: result.leadType,
                    aiLoading: false,
                } : l))
            }
        } catch {
            setLeads(prev => prev.map(l => l._uid === lead._uid ? { ...l, aiLoading: false } : l))
            showToast('Erro ao analisar lead com IA', 'error')
        }
    }

    // ─── FETCH EMAIL (single) ───────────────────────────────────────────────

    const fetchEmailOne = async (lead: SearchLead) => {
        setLeads(prev => prev.map(l => l._uid === lead._uid ? { ...l, emailLoading: true, emailError: undefined } : l))

        try {
            const res = await fetch('/api/crm/rocketreach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: lead.name, company: lead.company, linkedinUrl: lead.linkedinUrl }),
            })
            const data = await res.json()

            if (data.error) {
                setLeads(prev => prev.map(l => l._uid === lead._uid ? { ...l, emailLoading: false, emailError: data.error } : l))
                return
            }

            setLeads(prev => prev.map(l => l._uid === lead._uid ? {
                ...l,
                email: data.email || undefined,
                emailLoading: false,
                emailError: !data.email ? 'Email não encontrado' : undefined,
            } : l))
        } catch {
            setLeads(prev => prev.map(l => l._uid === lead._uid ? { ...l, emailLoading: false, emailError: 'Erro de conexão' } : l))
        }
    }

    // ─── ADD TO CRM (single) ─────────────────────────────────────────────────

    const addToCRM = async (lead: SearchLead) => {
        const result = await bulkCreateLeads([{
            name: lead.name,
            headline: lead.headline,
            company: lead.company,
            position: lead.position,
            location: lead.location,
            linkedinUrl: lead.linkedinUrl,
            email: lead.email,
            source: 'LINKEDIN',
            segment: lead.aiSegment || (form.segment === 'B2B' ? 'B2B' : 'B2C'),
            leadType: lead.aiLeadType || (form.segment === 'B2B' ? 'PROSPECT_B2B' : 'ARREMATANTE'),
            aiScore: lead.aiScore,
            aiSummary: lead.aiSummary,
            aiAnalysis: lead.aiApproach ? JSON.stringify({ approach: lead.aiApproach, tags: lead.aiTags }) : undefined,
        }])

        if (result.success) {
            setLeads(prev => prev.map(l => l._uid === lead._uid ? { ...l, addedToCRM: true } : l))
            showToast(`${lead.name} adicionado ao CRM!`)
        } else {
            showToast('Erro ao adicionar ao CRM', 'error')
        }
    }

    // ─── BULK ACTIONS ─────────────────────────────────────────────────────────

    const bulkAI = async () => {
        const targets = leads.filter(l => selected.has(l._uid) && !l.aiScore)
        if (targets.length === 0) { showToast('Selecione leads sem análise IA', 'error'); return }

        setBulkLoading('ai')
        try {
            const res = await fetch('/api/crm/ai-qualify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leads: targets.map(l => ({ name: l.name, headline: l.headline, company: l.company, position: l.position, location: l.location })),
                }),
            })
            const data = await res.json()
            const results: any[] = data.results || []

            setLeads(prev => prev.map(l => {
                const idx = targets.findIndex(t => t._uid === l._uid)
                if (idx === -1) return l
                const r = results[idx]
                return r ? { ...l, aiScore: r.score, aiSummary: r.summary, aiApproach: r.approach, aiTags: r.tags, aiSegment: r.segment, aiLeadType: r.leadType } : l
            }))
            showToast(`${results.length} leads analisados pela IA!`)
        } catch {
            showToast('Erro na análise em massa', 'error')
        } finally {
            setBulkLoading(null)
        }
    }

    const bulkEmail = async () => {
        const targets = leads.filter(l => selected.has(l._uid) && !l.email)
        if (targets.length === 0) { showToast('Selecione leads sem email', 'error'); return }

        setBulkLoading('email')
        for (const lead of targets) {
            await fetchEmailOne(lead)
        }
        setBulkLoading(null)
        showToast(`Busca de emails concluída para ${targets.length} leads`)
    }

    const bulkAddCRM = async () => {
        const targets = leads.filter(l => selected.has(l._uid) && !l.addedToCRM)
        if (targets.length === 0) { showToast('Selecione leads não adicionados', 'error'); return }

        setBulkLoading('crm')
        const result = await bulkCreateLeads(targets.map(l => ({
            name: l.name,
            headline: l.headline,
            company: l.company,
            position: l.position,
            location: l.location,
            linkedinUrl: l.linkedinUrl,
            email: l.email,
            source: 'LINKEDIN',
            segment: l.aiSegment || (form.segment === 'B2B' ? 'B2B' : 'B2C'),
            leadType: l.aiLeadType || (form.segment === 'B2B' ? 'PROSPECT_B2B' : 'ARREMATANTE'),
            aiScore: l.aiScore,
            aiSummary: l.aiSummary,
        })))

        if (result.success) {
            const uids = new Set(targets.map(l => l._uid))
            setLeads(prev => prev.map(l => uids.has(l._uid) ? { ...l, addedToCRM: true } : l))
            showToast(`${result.count} leads adicionados ao CRM!`)
        } else {
            showToast('Erro ao importar em massa', 'error')
        }
        setBulkLoading(null)
    }

    // ─── SELECTION ────────────────────────────────────────────────────────────

    const toggleSelect = (uid: string) => {
        setSelected(prev => {
            const n = new Set(prev)
            if (n.has(uid)) n.delete(uid); else n.add(uid)
            return n
        })
    }

    const toggleSelectAll = () => {
        if (selected.size === leads.length) setSelected(new Set())
        else setSelected(new Set(leads.map(l => l._uid)))
    }

    // ─── RENDER ───────────────────────────────────────────────────────────────

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
                    <Linkedin className="h-[22px] w-[22px] text-[#0077b5]" />
                    <h1 className="text-[24px] font-normal m-0">LinkedIn Lead Hunter</h1>
                </div>
                <div className="text-[12px] text-[#777]">Home &gt; CRM &gt; LinkedIn Hunter</div>
            </div>

            {/* CRM Nav */}
            <CRMNav active="linkedin" />

            {/* Tips box */}
            <div className="bg-[#d9edf7] border border-[#bce8f1] rounded-sm px-4 py-3 flex gap-3 text-sm text-[#31708f]">
                <Info size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                    <strong>Dicas de busca B2B:</strong>{' '}
                    Cargo=&quot;Diretor de Patrimônio&quot;, Empresa=&quot;DETRAN&quot;, Local=&quot;São Paulo&quot; |{' '}
                    Cargo=&quot;Chefe de Setor&quot;, Empresa=&quot;Prefeitura&quot; |{' '}
                    Cargo=&quot;Gerente de Frota&quot;, Setor=&quot;Logística&quot;{' '}
                    — Configure a <strong>chave SerpAPI</strong> em <Link href="/admin/settings" className="underline">Configurações</Link> para resultados reais.
                </div>
            </div>

            {/* Main layout */}
            <div className="flex gap-4 items-start">
                {/* LEFT PANEL — Search Form */}
                <div className="w-[300px] flex-shrink-0 bg-white border border-[#d2d6de] rounded-sm shadow-sm">
                    <div className="bg-[#3c8dbc] text-white px-4 py-3 rounded-t-sm">
                        <div className="flex items-center gap-2 font-bold text-sm">
                            <Search size={16} />
                            Parâmetros de Busca
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <FormField label="Nome da Campanha">
                            <input
                                value={form.campaignName}
                                onChange={e => setForm(p => ({ ...p, campaignName: e.target.value }))}
                                placeholder="Ex: DETRAN SP — Março 2026"
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            />
                        </FormField>

                        <FormField label="Palavras-chave">
                            <input
                                value={form.keywords}
                                onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))}
                                placeholder="Ex: veículos, frota, licitação"
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            />
                        </FormField>

                        <FormField label="Cargo / Título">
                            <input
                                value={form.jobTitle}
                                onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))}
                                placeholder="Ex: Diretor de Patrimônio"
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            />
                        </FormField>

                        <FormField label="Empresa / Tipo">
                            <input
                                value={form.company}
                                onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                                placeholder="Ex: DETRAN, Prefeitura, Transportadora"
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            />
                        </FormField>

                        <FormField label="Localização">
                            <input
                                value={form.location}
                                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                                placeholder="Ex: São Paulo, SP"
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            />
                        </FormField>

                        <FormField label="Setor / Indústria">
                            <input
                                value={form.industry}
                                onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                                placeholder="Ex: Governo, Logística, Seguros"
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            />
                        </FormField>

                        <FormField label="Segmento Alvo">
                            <select
                                value={form.segment}
                                onChange={e => setForm(p => ({ ...p, segment: e.target.value }))}
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            >
                                <option value="B2B">B2B — Comitentes (organizações)</option>
                                <option value="B2C">B2C — Arrematantes (compradores)</option>
                            </select>
                        </FormField>

                        <button
                            onClick={() => handleSearch(0)}
                            disabled={searching}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-sm rounded disabled:opacity-60"
                        >
                            {searching ? <Loader2 size={15} className="animate-spin" /> : <Linkedin size={15} />}
                            {searching ? 'Buscando...' : 'Buscar no LinkedIn'}
                        </button>

                        {/* Preset examples */}
                        <div className="border-t border-[#d2d6de] pt-3">
                            <div className="text-[11px] text-[#777] mb-2 font-bold uppercase">Exemplos Rápidos</div>
                            {[
                                { label: 'DETRAN (B2B)', v: { jobTitle: 'Diretor', company: 'DETRAN', location: 'São Paulo', industry: 'Governo', segment: 'B2B' } },
                                { label: 'Tribunais (B2B)', v: { jobTitle: 'Diretor Administrativo', company: 'Tribunal de Justiça', location: 'São Paulo', industry: 'Judiciário', segment: 'B2B' } },
                                { label: 'Frotas Corp. (B2B)', v: { jobTitle: 'Gerente de Frota', company: '', location: 'São Paulo', industry: 'Logística', segment: 'B2B' } },
                                { label: 'Arrematantes (B2C)', v: { jobTitle: 'Revendedor', company: '', location: 'São Paulo', industry: 'Automóveis', segment: 'B2C' } },
                            ].map(ex => (
                                <button
                                    key={ex.label}
                                    onClick={() => setForm(p => ({ ...p, ...ex.v }))}
                                    className="w-full text-left text-xs text-[#3c8dbc] hover:underline py-0.5"
                                >
                                    → {ex.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL — Results */}
                <div className="flex-1 min-w-0">
                    {/* Warning */}
                    {warning && (
                        <div className="mb-3 bg-[#fcf8e3] border border-[#faebcc] rounded-sm px-4 py-2 text-sm text-[#8a6d3b] flex gap-2 items-start">
                            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                            {warning}
                        </div>
                    )}
                    {searchError && (
                        <div className="mb-3 bg-[#f2dede] border border-[#ebccd1] rounded-sm px-4 py-2 text-sm text-[#a94442] flex gap-2 items-start">
                            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                            {searchError}
                        </div>
                    )}

                    {leads.length === 0 && !searching && !searchError && (
                        <div className="bg-white border border-[#d2d6de] rounded-sm p-12 text-center text-[#aaa]">
                            <Linkedin size={48} className="mx-auto mb-3 text-[#0077b5] opacity-30" />
                            <div className="text-lg font-bold mb-1">Nenhum resultado ainda</div>
                            <div className="text-sm">Preencha os parâmetros e clique em <strong>Buscar no LinkedIn</strong></div>
                        </div>
                    )}

                    {leads.length > 0 && (
                        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm">
                            {/* Table header + bulk actions */}
                            <div className="px-4 py-3 border-b border-[#d2d6de] flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-3">
                                    <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-sm text-[#555] hover:text-[#333]">
                                        {selected.size === leads.length ? <CheckSquare size={16} className="text-[#3c8dbc]" /> : <Square size={16} />}
                                        {selected.size > 0 ? `${selected.size} selecionado(s)` : 'Selecionar todos'}
                                    </button>
                                    <span className="text-[#d2d6de]">|</span>
                                    <span className="text-sm text-[#777]">{leads.length} leads encontrados</span>
                                </div>

                                {selected.size > 0 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={bulkAI}
                                            disabled={bulkLoading !== null}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#8e44ad] text-white rounded hover:bg-[#7d3c98] disabled:opacity-60"
                                        >
                                            {bulkLoading === 'ai' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                            Analisar em Massa
                                        </button>
                                        <button
                                            onClick={bulkEmail}
                                            disabled={bulkLoading !== null}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#f39c12] text-white rounded hover:bg-[#e08e0b] disabled:opacity-60"
                                        >
                                            {bulkLoading === 'email' ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                                            Buscar Emails
                                        </button>
                                        <button
                                            onClick={bulkAddCRM}
                                            disabled={bulkLoading !== null}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#00a65a] text-white rounded hover:bg-[#008d4c] disabled:opacity-60"
                                        >
                                            {bulkLoading === 'crm' ? <Loader2 size={12} className="animate-spin" /> : <ListPlus size={12} />}
                                            Adicionar ao CRM
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[#f9f9f9] text-[#777] text-left text-xs uppercase border-b border-[#d2d6de]">
                                            <th className="px-3 py-2 w-8"></th>
                                            <th className="px-3 py-2">Nome / Cargo</th>
                                            <th className="px-3 py-2">Empresa</th>
                                            <th className="px-3 py-2">Localização</th>
                                            <th className="px-3 py-2 text-center">Score IA</th>
                                            <th className="px-3 py-2">Email</th>
                                            <th className="px-3 py-2 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f4f4f4]">
                                        {leads.map(lead => (
                                            <LeadRow
                                                key={lead._uid}
                                                lead={lead}
                                                selected={selected.has(lead._uid)}
                                                onSelect={() => toggleSelect(lead._uid)}
                                                onAnalyze={() => analyzeOne(lead)}
                                                onFetchEmail={() => fetchEmailOne(lead)}
                                                onAddCRM={() => addToCRM(lead)}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-4 py-3 border-t border-[#d2d6de] flex items-center justify-between">
                                <span className="text-xs text-[#777]">Página {pageNum + 1}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSearch(pageNum - 1)}
                                        disabled={pageNum === 0 || searching}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs border border-[#d2d6de] rounded hover:bg-[#f4f4f4] disabled:opacity-40"
                                    >
                                        <ChevronLeft size={13} /> Anterior
                                    </button>
                                    <button
                                        onClick={() => handleSearch(pageNum + 1)}
                                        disabled={searching}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs border border-[#d2d6de] rounded hover:bg-[#f4f4f4] disabled:opacity-40"
                                    >
                                        Próxima <ChevronRight size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── LEAD ROW ──────────────────────────────────────────────────────────────────

function LeadRow({ lead, selected, onSelect, onAnalyze, onFetchEmail, onAddCRM }: {
    lead: SearchLead
    selected: boolean
    onSelect: () => void
    onAnalyze: () => void
    onFetchEmail: () => void
    onAddCRM: () => void
}) {
    const [showApproach, setShowApproach] = useState(false)
    const badge = lead.aiLeadType ? leadTypeBadge(lead.aiLeadType) : null

    return (
        <>
            <tr className={`hover:bg-[#f9f9f9] transition-colors ${selected ? 'bg-[#eff8ff]' : ''} ${lead.mock ? 'opacity-75' : ''}`}>
                {/* Checkbox */}
                <td className="px-3 py-3">
                    <button onClick={onSelect}>
                        {selected ? <CheckSquare size={16} className="text-[#3c8dbc]" /> : <Square size={16} className="text-[#ccc]" />}
                    </button>
                </td>

                {/* Name / Position */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#3c8dbc] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-semibold text-[#333] text-sm flex items-center gap-1.5">
                                {lead.name}
                                {lead.mock && <span className="text-[9px] bg-[#fcf8e3] border border-[#faebcc] text-[#8a6d3b] px-1.5 py-0.5 rounded">DEMO</span>}
                                {lead.addedToCRM && <CheckCircle2 size={14} className="text-[#00a65a]" />}
                            </div>
                            <div className="text-[11px] text-[#777] truncate max-w-[180px]">{lead.headline || lead.position}</div>
                            {lead.linkedinUrl && !lead.mock && (
                                <a href={lead.linkedinUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#0077b5] flex items-center gap-0.5 hover:underline">
                                    <ExternalLink size={10} /> LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                    {/* AI Summary */}
                    {lead.aiSummary && (
                        <div className="mt-1.5 flex items-start gap-1.5">
                            {badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full text-white font-bold flex-shrink-0" style={{ backgroundColor: badge.color }}>
                                    {badge.label}
                                </span>
                            )}
                            <div className="text-[10px] text-[#555]">{lead.aiSummary}</div>
                            {lead.aiApproach && (
                                <button onClick={() => setShowApproach(p => !p)} className="flex-shrink-0 text-[10px] text-[#3c8dbc] hover:underline">
                                    {showApproach ? 'Fechar' : 'Abordagem'}
                                </button>
                            )}
                        </div>
                    )}
                    {lead.aiTags && lead.aiTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {lead.aiTags.slice(0, 3).map(t => (
                                <span key={t} className="text-[9px] bg-[#f4f4f4] text-[#666] px-1.5 py-0.5 rounded-full">{t}</span>
                            ))}
                        </div>
                    )}
                </td>

                {/* Company */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-1 text-sm text-[#555]">
                        <Building size={13} className="text-[#aaa]" />
                        {lead.company || <span className="text-[#ccc]">—</span>}
                    </div>
                </td>

                {/* Location */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-1 text-sm text-[#555]">
                        <MapPin size={13} className="text-[#aaa]" />
                        {lead.location || <span className="text-[#ccc]">—</span>}
                    </div>
                </td>

                {/* AI Score */}
                <td className="px-3 py-3 text-center">
                    {lead.aiLoading ? (
                        <Loader2 size={16} className="animate-spin text-[#8e44ad] mx-auto" />
                    ) : lead.aiScore != null ? (
                        <div className="inline-flex flex-col items-center">
                            <span className="text-lg font-bold" style={{ color: scoreColor(lead.aiScore) }}>{lead.aiScore}</span>
                            <div className="w-12 h-1.5 bg-[#f4f4f4] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${lead.aiScore}%`, backgroundColor: scoreColor(lead.aiScore) }} />
                            </div>
                        </div>
                    ) : (
                        <span className="text-[#ccc] text-xs">—</span>
                    )}
                </td>

                {/* Email */}
                <td className="px-3 py-3">
                    {lead.emailLoading ? (
                        <Loader2 size={14} className="animate-spin text-[#f39c12]" />
                    ) : lead.email ? (
                        <a href={`mailto:${lead.email}`} className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1">
                            <Mail size={12} /> {lead.email}
                        </a>
                    ) : lead.emailError ? (
                        <span className="text-[10px] text-[#dd4b39]">{lead.emailError}</span>
                    ) : (
                        <span className="text-[#ddd] text-xs">—</span>
                    )}
                </td>

                {/* Actions */}
                <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                        <button
                            onClick={onAnalyze}
                            disabled={!!lead.aiLoading}
                            title="Analisar com IA"
                            className="p-1.5 rounded text-[#8e44ad] hover:bg-[#f3e8ff] disabled:opacity-40"
                        >
                            <Sparkles size={15} />
                        </button>
                        <button
                            onClick={onFetchEmail}
                            disabled={!!lead.emailLoading}
                            title="Buscar Email (RocketReach)"
                            className="p-1.5 rounded text-[#f39c12] hover:bg-[#fff3cd] disabled:opacity-40"
                        >
                            <Mail size={15} />
                        </button>
                        {lead.addedToCRM ? (
                            <span title="Já no CRM" className="p-1.5 text-[#00a65a]">
                                <CheckCircle2 size={15} />
                            </span>
                        ) : (
                            <button
                                onClick={onAddCRM}
                                title="Adicionar ao CRM"
                                className="p-1.5 rounded text-[#00a65a] hover:bg-[#d4f4e2]"
                            >
                                <Plus size={15} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>

            {/* Approach message expanded */}
            {showApproach && lead.aiApproach && (
                <tr className="bg-[#f9f3ff]">
                    <td colSpan={7} className="px-6 py-3">
                        <div className="flex items-start gap-2">
                            <Send size={14} className="text-[#8e44ad] flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="text-[11px] text-[#777] font-bold mb-1">Mensagem de Abordagem Sugerida:</div>
                                <div className="text-sm text-[#333] italic">&ldquo;{lead.aiApproach}&rdquo;</div>
                            </div>
                            <button onClick={() => setShowApproach(false)} className="ml-auto text-[#aaa] hover:text-[#555]">
                                <X size={14} />
                            </button>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-bold text-[#555] mb-1">{label}</label>
            {children}
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
