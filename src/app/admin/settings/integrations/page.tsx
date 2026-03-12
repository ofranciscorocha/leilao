'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, Instagram, Save, CheckCircle, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getSystemSettings, updateSystemSettings } from '@/app/actions/settings'

export default function IntegrationsSettingsPage() {
    const [config, setConfig] = useState({
        // WhatsApp
        whatsappApiUrl: '',
        whatsappApiKey: '',
        whatsappInstance: '',
        // Email SMTP
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPass: '',
        smtpFrom: '',
        // SendGrid
        sendgridApiKey: '',
        // Instagram
        instagramToken: '',
        instagramPageId: '',
    })
    const [showWA, setShowWA] = useState(false)
    const [showSMTP, setShowSMTP] = useState(false)
    const [showSG, setShowSG] = useState(false)
    const [showIG, setShowIG] = useState(false)
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
                    whatsappApiUrl: d.whatsappApiUrl ?? prev.whatsappApiUrl,
                    whatsappApiKey: d.whatsappApiKey ?? prev.whatsappApiKey,
                    whatsappInstance: d.whatsappInstance ?? prev.whatsappInstance,
                    smtpHost: d.smtpHost ?? prev.smtpHost,
                    smtpPort: d.smtpPort ?? prev.smtpPort,
                    smtpUser: d.smtpUser ?? prev.smtpUser,
                    smtpPass: d.smtpPass ?? prev.smtpPass,
                    smtpFrom: d.smtpFrom ?? prev.smtpFrom,
                    sendgridApiKey: d.sendgridApiKey ?? prev.sendgridApiKey,
                    instagramToken: d.instagramToken ?? prev.instagramToken,
                    instagramPageId: d.instagramPageId ?? prev.instagramPageId,
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
            whatsappApiUrl: config.whatsappApiUrl,
            whatsappApiKey: config.whatsappApiKey,
            whatsappInstance: config.whatsappInstance,
            smtpHost: config.smtpHost,
            smtpPort: config.smtpPort,
            smtpUser: config.smtpUser,
            smtpPass: config.smtpPass,
            smtpFrom: config.smtpFrom,
            sendgridApiKey: config.sendgridApiKey,
            instagramToken: config.instagramToken,
            instagramPageId: config.instagramPageId,
        })
        setSaving(false)
        if (result.success) {
            showToast('success', result.message ?? 'Integrações salvas com sucesso!')
        } else {
            showToast('error', result.message ?? 'Erro ao salvar integrações.')
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Phone className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Integrações</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/settings" className="text-[#3c8dbc] hover:underline">Configurações</Link> &gt; Integrações
                </div>
            </div>

            {toast && (
                <div className={`border rounded-sm p-3 flex items-center gap-2 text-sm ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WhatsApp */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b" style={{ borderLeftColor: '#25D366', borderLeftWidth: 4 }}>
                        <div className="flex items-center gap-2">
                            <Phone size={18} className="text-green-600" />
                            <h3 className="font-bold text-[#333]">WhatsApp API (Evolution API)</h3>
                        </div>
                        <p className="text-xs text-[#777] mt-1">Necessário para envio de mensagens e marketing</p>
                    </div>
                    <div className="p-5 space-y-3">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">URL da API</label>
                            <input value={config.whatsappApiUrl} onChange={e => set('whatsappApiUrl', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="https://sua-api.exemplo.com" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">API Key</label>
                            <div className="relative mt-1">
                                <input type={showWA ? 'text' : 'password'} value={config.whatsappApiKey} onChange={e => set('whatsappApiKey', e.target.value)} className="w-full border border-[#d2d6de] rounded px-3 py-2 pr-10 text-sm font-mono" placeholder="Sua chave secreta" />
                                <button onClick={() => setShowWA(!showWA)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
                                    {showWA ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Nome da Instância</label>
                            <input value={config.whatsappInstance} onChange={e => set('whatsappInstance', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="patio-rocha" />
                        </div>
                    </div>
                </div>

                {/* Email SMTP */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b" style={{ borderLeftColor: '#3c8dbc', borderLeftWidth: 4 }}>
                        <div className="flex items-center gap-2">
                            <Mail size={18} className="text-blue-600" />
                            <h3 className="font-bold text-[#333]">Email (SMTP)</h3>
                        </div>
                        <p className="text-xs text-[#777] mt-1">Para envio de emails transacionais e marketing</p>
                    </div>
                    <div className="p-5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Host SMTP</label>
                                <input value={config.smtpHost} onChange={e => set('smtpHost', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="smtp.gmail.com" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Porta</label>
                                <input value={config.smtpPort} onChange={e => set('smtpPort', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="587" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Usuário</label>
                            <input value={config.smtpUser} onChange={e => set('smtpUser', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="email@empresa.com" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Senha</label>
                            <div className="relative mt-1">
                                <input type={showSMTP ? 'text' : 'password'} value={config.smtpPass} onChange={e => set('smtpPass', e.target.value)} className="w-full border border-[#d2d6de] rounded px-3 py-2 pr-10 text-sm" />
                                <button onClick={() => setShowSMTP(!showSMTP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
                                    {showSMTP ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Email Remetente</label>
                            <input value={config.smtpFrom} onChange={e => set('smtpFrom', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Pátio Rocha <noreply@patiorocha.com.br>" />
                        </div>
                    </div>
                </div>

                {/* SendGrid */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b" style={{ borderLeftColor: '#1A82E2', borderLeftWidth: 4 }}>
                        <h3 className="font-bold text-[#333]">SendGrid (Marketing em massa)</h3>
                        <p className="text-xs text-[#777] mt-1">Alternativa ao SMTP para envios em grande escala</p>
                    </div>
                    <div className="p-5">
                        <label className="text-xs font-bold text-[#555] uppercase">SendGrid API Key</label>
                        <div className="relative mt-1">
                            <input type={showSG ? 'text' : 'password'} value={config.sendgridApiKey} onChange={e => set('sendgridApiKey', e.target.value)} className="w-full border border-[#d2d6de] rounded px-3 py-2 pr-10 text-sm font-mono" placeholder="SG.xxxxxxx" />
                            <button onClick={() => setShowSG(!showSG)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
                                {showSG ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-[#aaa] mt-1">Obtenha em: app.sendgrid.com/settings/api_keys</p>
                    </div>
                </div>

                {/* Instagram */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b" style={{ borderLeftColor: '#E1306C', borderLeftWidth: 4 }}>
                        <div className="flex items-center gap-2">
                            <Instagram size={18} className="text-pink-600" />
                            <h3 className="font-bold text-[#333]">Instagram / Facebook API</h3>
                        </div>
                        <p className="text-xs text-[#777] mt-1">Para robô de atendimento no Instagram DM</p>
                    </div>
                    <div className="p-5 space-y-3">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Page Access Token</label>
                            <div className="relative mt-1">
                                <input type={showIG ? 'text' : 'password'} value={config.instagramToken} onChange={e => set('instagramToken', e.target.value)} className="w-full border border-[#d2d6de] rounded px-3 py-2 pr-10 text-sm font-mono" placeholder="EAAxxxxxxxx..." />
                                <button onClick={() => setShowIG(!showIG)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
                                    {showIG ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Page ID</label>
                            <input value={config.instagramPageId} onChange={e => set('instagramPageId', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="123456789" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#3c8dbc] text-white font-bold rounded hover:bg-[#367fa9] transition-colors disabled:opacity-60"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Salvando...' : 'Salvar Integrações'}
                </button>
            </div>
        </div>
    )
}
