'use client'

import { useState } from 'react'
import { Edit2, Plus, Trash2, Eye, Copy, Mail } from 'lucide-react'
import Link from 'next/link'

interface Template {
    id: string
    name: string
    subject: string
    preview: string
    category: string
    createdAt: string
}

const MOCK_TEMPLATES: Template[] = [
    {
        id: '1',
        name: 'Convite para Leilão',
        subject: '🔨 Convite: {{auction_name}} - {{auction_date}}',
        preview: 'Prezado(a) {{name}}, temos o prazer de convidá-lo(a) para nosso próximo leilão...',
        category: 'Leilões',
        createdAt: '2026-01-10',
    },
    {
        id: '2',
        name: 'Boas-vindas',
        subject: 'Bem-vindo(a) ao Pátio Rocha Leilões!',
        preview: 'Olá {{name}}, seja bem-vindo(a) à nossa plataforma de leilões...',
        category: 'Cadastro',
        createdAt: '2026-01-05',
    },
    {
        id: '3',
        name: 'Habilitação Aprovada',
        subject: '✅ Sua habilitação foi aprovada!',
        preview: 'Parabéns {{name}}! Sua habilitação para o leilão {{auction_name}} foi aprovada...',
        category: 'Operacional',
        createdAt: '2026-02-01',
    },
    {
        id: '4',
        name: 'Lance Superado',
        subject: '⚠️ Seu lance foi superado - {{lot_name}}',
        preview: 'Olá {{name}}, informamos que seu lance no lote {{lot_number}} foi superado...',
        category: 'Lances',
        createdAt: '2026-02-15',
    },
    {
        id: '5',
        name: 'Arrematação Confirmada',
        subject: '🎉 Parabéns! Você arrematou {{lot_name}}',
        preview: 'Parabéns {{name}}! Você arrematou com sucesso o lote {{lot_number}}...',
        category: 'Pós-Venda',
        createdAt: '2026-02-20',
    },
]

const VARIABLES = [
    '{{name}}', '{{email}}', '{{auction_name}}', '{{auction_date}}',
    '{{lot_number}}', '{{lot_name}}', '{{bid_value}}', '{{site_url}}'
]

export default function MarketingTemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES)
    const [selected, setSelected] = useState<Template | null>(null)
    const [editing, setEditing] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Mail className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Templates de Email</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/marketing" className="text-[#3c8dbc] hover:underline">Marketing</Link> &gt; Templates
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template list */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                        <h3 className="font-bold text-[#333] text-sm">Templates ({templates.length})</h3>
                        <button className="p-1.5 bg-[#3c8dbc] text-white rounded hover:bg-[#367fa9]">
                            <Plus size={14} />
                        </button>
                    </div>
                    {templates.map(t => (
                        <div
                            key={t.id}
                            onClick={() => { setSelected(t); setEditing(false) }}
                            className={`p-4 border-b border-[#f4f4f4] cursor-pointer hover:bg-[#f9f9f9] transition-colors ${selected?.id === t.id ? 'bg-[#dce8f3] border-l-4 border-l-[#3c8dbc]' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm text-[#333]">{t.name}</span>
                                <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">{t.category}</span>
                            </div>
                            <p className="text-xs text-[#777] line-clamp-2">{t.preview}</p>
                        </div>
                    ))}
                </div>

                {/* Preview/Editor */}
                <div className="lg:col-span-2">
                    {selected ? (
                        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                                <h3 className="font-bold text-[#333]">{selected.name}</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-[#3c8dbc] text-[#3c8dbc] rounded hover:bg-[#3c8dbc] hover:text-white transition-colors">
                                        <Edit2 size={13} />
                                        {editing ? 'Cancelar' : 'Editar'}
                                    </button>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#555] border border-[#d2d6de] rounded hover:bg-[#f4f4f4]">
                                        <Copy size={13} />
                                        Duplicar
                                    </button>
                                    <button onClick={() => { setTemplates(p => p.filter(x => x.id !== selected.id)); setSelected(null) }} className="p-1.5 bg-[#dd4b39] text-white rounded-sm"><Trash2 size={13} /></button>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-[#555] uppercase">Assunto</label>
                                    {editing ? (
                                        <input defaultValue={selected.subject} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                                    ) : (
                                        <div className="mt-1 p-3 bg-[#f9f9f9] rounded text-sm font-mono text-[#333]">{selected.subject}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#555] uppercase">Corpo do Email</label>
                                    {editing ? (
                                        <textarea defaultValue={selected.preview} rows={10} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none" />
                                    ) : (
                                        <div className="mt-1 p-4 bg-[#f9f9f9] rounded border border-[#eee] text-sm text-[#555]">
                                            <p className="whitespace-pre-wrap">{selected.preview}</p>
                                            <p className="mt-4 text-[#777]">...</p>
                                            <p className="mt-2 text-[#777] italic">Conteúdo completo do template. Clique em Editar para visualizar/alterar o HTML completo.</p>
                                        </div>
                                    )}
                                </div>
                                {/* Variables reference */}
                                <div className="p-4 bg-[#f0f0f0] rounded border border-[#e0e0e0]">
                                    <p className="text-xs font-bold text-[#555] uppercase mb-2">Variáveis disponíveis</p>
                                    <div className="flex flex-wrap gap-2">
                                        {VARIABLES.map(v => (
                                            <code key={v} className="text-[11px] bg-white border border-[#d2d6de] rounded px-2 py-0.5 text-[#3c8dbc] font-mono">{v}</code>
                                        ))}
                                    </div>
                                </div>
                                {editing && (
                                    <button className="w-full py-2 bg-[#00a65a] text-white font-bold rounded hover:bg-[#008d4c]">Salvar Template</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm flex items-center justify-center h-64 text-[#aaa]">
                            <div className="text-center">
                                <Mail size={40} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm">Selecione um template para visualizar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
