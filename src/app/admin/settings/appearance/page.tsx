'use client'

import { useState, useEffect } from "react"
import { Settings, Save, Upload, Palette, Home, CheckCircle, AlertCircle, Loader2, Globe, Phone, Mail, MapPin, Search } from "lucide-react"
import Link from 'next/link'
import { getSystemSettings, updateSystemSettings } from "@/app/actions/settings"

export default function AppearanceSettingsPage() {
    const [config, setConfig] = useState({
        siteName: '',
        siteUrl: '',
        logoUrl: '',
        faviconUrl: '',
        seoTitle: '',
        seoDescription: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const set = (k: string, v: string) => setConfig(p => ({ ...p, [k]: v }))

    useEffect(() => {
        async function load() {
            setLoading(true)
            const result = await getSystemSettings()
            if (result.success && result.data) {
                const d = result.data as any
                setConfig(prev => ({
                    ...prev,
                    siteName: d.siteName ?? prev.siteName,
                    siteUrl: d.siteUrl ?? prev.siteUrl,
                    logoUrl: d.logoUrl ?? prev.logoUrl,
                    faviconUrl: d.faviconUrl ?? prev.faviconUrl,
                    seoTitle: d.seoTitle ?? prev.seoTitle,
                    seoDescription: d.seoDescription ?? prev.seoDescription,
                    contactEmail: d.contactEmail ?? prev.contactEmail,
                    contactPhone: d.contactPhone ?? prev.contactPhone,
                    address: d.address ?? prev.address,
                }))
            }
            setLoading(false)
        }
        load()
    }, [])

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message })
        setTimeout(() => setToast(null), 4000)
    }

    const save = async () => {
        setSaving(true)
        const result = await updateSystemSettings({
            siteName: config.siteName,
            siteUrl: config.siteUrl,
            logoUrl: config.logoUrl,
            faviconUrl: config.faviconUrl,
            seoTitle: config.seoTitle,
            seoDescription: config.seoDescription,
            contactEmail: config.contactEmail,
            contactPhone: config.contactPhone,
            address: config.address,
        })
        setSaving(false)
        if (result.success) {
            showToast('success', result.message ?? 'Aparência salva com sucesso!')
        } else {
            showToast('error', result.message ?? 'Erro ao salvar configurações.')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#3c8dbc]" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#333]">
                    <Palette className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0 flex items-center gap-2">
                        Aparência e Cores
                    </h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin" className="text-[#3c8dbc] hover:underline">Home</Link> &gt; <Link href="/admin/settings" className="text-[#3c8dbc] hover:underline">Configurações</Link> &gt; Aparência
                </div>
            </div>

            {toast && (
                <div className={`border rounded-sm p-3 flex items-center gap-2 text-sm ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            {/* Site Identity */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="border-b border-[#f4f4f4] p-4 flex items-center gap-2" style={{ borderLeftColor: '#3c8dbc', borderLeftWidth: 4 }}>
                    <Globe size={16} className="text-[#3c8dbc]" />
                    <h3 className="font-bold text-[#333]">Identidade do Site</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Nome do Site</label>
                        <input
                            value={config.siteName}
                            onChange={e => set('siteName', e.target.value)}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            placeholder="Pátio Rocha Leilões"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">URL do Site</label>
                        <input
                            value={config.siteUrl}
                            onChange={e => set('siteUrl', e.target.value)}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            placeholder="https://www.patiorocha.com.br"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">URL do Logotipo</label>
                        <input
                            value={config.logoUrl}
                            onChange={e => set('logoUrl', e.target.value)}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            placeholder="https://cdn.exemplo.com/logo.png"
                        />
                        <p className="text-[10px] text-[#aaa] mt-1">URL pública da imagem do logotipo</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">URL do Favicon</label>
                        <input
                            value={config.faviconUrl}
                            onChange={e => set('faviconUrl', e.target.value)}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            placeholder="https://cdn.exemplo.com/favicon.ico"
                        />
                        <p className="text-[10px] text-[#aaa] mt-1">URL pública do favicon (ICO ou PNG 32x32)</p>
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="border-b border-[#f4f4f4] p-4 flex items-center gap-2" style={{ borderLeftColor: '#00a65a', borderLeftWidth: 4 }}>
                    <Search size={16} className="text-[#00a65a]" />
                    <h3 className="font-bold text-[#333]">SEO (Mecanismos de Busca)</h3>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Título SEO</label>
                        <input
                            value={config.seoTitle}
                            onChange={e => set('seoTitle', e.target.value)}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00a65a]"
                            placeholder="Pátio Rocha Leilões — Leilões de Veículos e Imóveis"
                        />
                        <p className="text-[10px] text-[#aaa] mt-1">Aparece na aba do navegador e no Google (máx. 60 caracteres)</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Descrição SEO</label>
                        <textarea
                            value={config.seoDescription}
                            onChange={e => set('seoDescription', e.target.value)}
                            rows={3}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00a65a] resize-none"
                            placeholder="Participe dos leilões de veículos, imóveis e muito mais com o Pátio Rocha."
                        />
                        <p className="text-[10px] text-[#aaa] mt-1">Resumo exibido nos resultados de busca (máx. 160 caracteres)</p>
                    </div>
                </div>
            </div>

            {/* Contact */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="border-b border-[#f4f4f4] p-4 flex items-center gap-2" style={{ borderLeftColor: '#f39c12', borderLeftWidth: 4 }}>
                    <Phone size={16} className="text-[#f39c12]" />
                    <h3 className="font-bold text-[#333]">Informações de Contato</h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Email de Contato</label>
                        <div className="relative mt-1">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
                            <input
                                value={config.contactEmail}
                                onChange={e => set('contactEmail', e.target.value)}
                                className="w-full border border-[#d2d6de] rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#f39c12]"
                                placeholder="contato@patiorocha.com.br"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Telefone</label>
                        <div className="relative mt-1">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
                            <input
                                value={config.contactPhone}
                                onChange={e => set('contactPhone', e.target.value)}
                                className="w-full border border-[#d2d6de] rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#f39c12]"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-[#555] uppercase">Endereço</label>
                        <div className="relative mt-1">
                            <MapPin size={14} className="absolute left-3 top-3 text-[#aaa]" />
                            <textarea
                                value={config.address}
                                onChange={e => set('address', e.target.value)}
                                rows={2}
                                className="w-full border border-[#d2d6de] rounded pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#f39c12] resize-none"
                                placeholder="Rua Exemplo, 123 — Bairro, Cidade — SP, 01234-567"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Colors (existing UI, no DB binding yet) */}
            <div className="bg-white border-t-4 border-[#3c8dbc] border border-[#d2d6de] rounded-sm shadow-sm">
                <div className="border-b border-[#f4f4f4] p-4">
                    <h3 className="text-[18px] text-[#333] m-0 font-normal">Personalização Visual</h3>
                </div>

                <div className="p-6 space-y-8">
                    {/* Cores */}
                    <div>
                        <h4 className="text-lg font-medium text-[#333] mb-4 border-b pb-2">Cores Principais</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Cor Primária</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" defaultValue="#123456" className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                                    <input type="text" defaultValue="#123456" className="flex-1 px-3 py-2 border border-[#d2d6de] rounded-sm focus:border-[#3c8dbc] focus:ring-0 text-sm" />
                                </div>
                                <p className="text-xs text-[#777] mt-1">Usada em botões e destaques principais.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Cor Secundária</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" defaultValue="#D4AF37" className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                                    <input type="text" defaultValue="#D4AF37" className="flex-1 px-3 py-2 border border-[#d2d6de] rounded-sm focus:border-[#3c8dbc] focus:ring-0 text-sm" />
                                </div>
                                <p className="text-xs text-[#777] mt-1">Usada para elementos de atenção ou detalhes.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Cor de Destaque (Accent)</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" defaultValue="#e74c3c" className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                                    <input type="text" defaultValue="#e74c3c" className="flex-1 px-3 py-2 border border-[#d2d6de] rounded-sm focus:border-[#3c8dbc] focus:ring-0 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Cor de Fundo (Background)</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" defaultValue="#f4f6f9" className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                                    <input type="text" defaultValue="#f4f6f9" className="flex-1 px-3 py-2 border border-[#d2d6de] rounded-sm focus:border-[#3c8dbc] focus:ring-0 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo upload (visual only) */}
                    <div>
                        <h4 className="text-lg font-medium text-[#333] mb-4 border-b pb-2">Upload de Imagens</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Logotipo Principal</label>
                                <div className="border-2 border-dashed border-[#d2d6de] rounded-md p-6 flex flex-col items-center justify-center bg-[#f9fafc] hover:bg-[#f4f4f4] transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-[#999] mb-2" />
                                    <span className="text-sm text-[#555] font-medium">Clique para enviar uma imagem</span>
                                    <span className="text-xs text-[#777] mt-1">PNG, JPG, SVG. Máx 2MB.</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Favicon</label>
                                <div className="border-2 border-dashed border-[#d2d6de] rounded-md p-6 flex flex-col items-center justify-center bg-[#f9fafc] hover:bg-[#f4f4f4] transition-colors cursor-pointer">
                                    <Upload className="h-8 w-8 text-[#999] mb-2" />
                                    <span className="text-sm text-[#555] font-medium">Clique para enviar um ícone</span>
                                    <span className="text-xs text-[#777] mt-1">ICO ou PNG, 32x32px.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banners */}
                    <div>
                        <h4 className="text-lg font-medium text-[#333] mb-4 border-b pb-2">Banners e Fundos</h4>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Banner de Fundo (Home)</label>
                                <div className="border-2 border-dashed border-[#d2d6de] rounded-md p-6 flex flex-col items-center justify-center bg-[#f9fafc] hover:bg-[#f4f4f4] transition-colors cursor-pointer h-40">
                                    <Upload className="h-8 w-8 text-[#999] mb-2" />
                                    <span className="text-sm text-[#555] font-medium">Clique para enviar a imagem de fundo</span>
                                    <span className="text-xs text-[#777] mt-1">1920x1080px (Alta Qualidade). JPG ou PNG. Máx 5MB.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#00a65a] text-white font-bold rounded hover:bg-[#008d4c] transition-colors disabled:opacity-60"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </div>
    )
}
