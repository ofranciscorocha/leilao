'use client'

import { useState, useEffect } from "react"
import { Bot, Save, AlertCircle, CheckCircle, Phone, Instagram, Brain, Clock, Loader2 } from "lucide-react"
import Link from 'next/link'
import { getBotConfig, saveBotConfig } from "@/app/actions/bot"

const DEFAULT_CONFIG = {
    whatsappEnabled: true,
    whatsappGreeting: 'Olá {{name}}! 👋 Bem-vindo ao *Pátio Rocha Leilões*!\n\nComo posso te ajudar?\n\n1️⃣ Ver leilões disponíveis\n2️⃣ Habilitação para leilão\n3️⃣ Status do meu lote\n4️⃣ Falar com atendente\n5️⃣ Site oficial',
    whatsappAwayMsg: 'Olá! 👋 Estamos fora do horário de atendimento.\n\n⏰ Atendemos de *Segunda a Sexta, das 8h às 18h*.\n\nVocê pode acessar nosso site: https://patiorochaleiloes.com.br\n\nRetornaremos em breve! 😊',
    instagramEnabled: false,
    instagramGreeting: 'Olá! 😊 Obrigado por entrar em contato com o Pátio Rocha Leilões!',
    aiEnabled: false,
    aiPersonality: 'Você é um assistente virtual do Pátio Rocha Leilões. Seja sempre cordial, objetivo e profissional. Responda apenas sobre leilões, cadastro de arrematantes, habilitações e informações gerais da empresa. Nunca invente informações.',
    workingHours: JSON.stringify({
        seg: { start: '08:00', end: '18:00', active: true },
        ter: { start: '08:00', end: '18:00', active: true },
        qua: { start: '08:00', end: '18:00', active: true },
        qui: { start: '08:00', end: '18:00', active: true },
        sex: { start: '08:00', end: '18:00', active: true },
        sab: { start: '08:00', end: '18:00', active: false },
        dom: { start: '08:00', end: '18:00', active: false },
    }),
}

export default function BotConfigPage() {
    const [config, setConfig] = useState<any>(DEFAULT_CONFIG)
    const [workingHoursEnabled, setWorkingHoursEnabled] = useState(true)
    const [workingStart, setWorkingStart] = useState('08:00')
    const [workingEnd, setWorkingEnd] = useState('18:00')
    const [workingDays, setWorkingDays] = useState('seg,ter,qua,qui,sex')
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getBotConfig().then(res => {
            if (res.success && res.data) {
                const d = res.data
                setConfig({
                    whatsappEnabled: d.whatsappEnabled ?? DEFAULT_CONFIG.whatsappEnabled,
                    whatsappGreeting: d.whatsappGreeting ?? DEFAULT_CONFIG.whatsappGreeting,
                    whatsappAwayMsg: d.whatsappAwayMsg ?? DEFAULT_CONFIG.whatsappAwayMsg,
                    instagramEnabled: d.instagramEnabled ?? DEFAULT_CONFIG.instagramEnabled,
                    instagramGreeting: d.instagramGreeting ?? DEFAULT_CONFIG.instagramGreeting,
                    aiEnabled: d.aiEnabled ?? DEFAULT_CONFIG.aiEnabled,
                    aiPersonality: d.aiPersonality ?? DEFAULT_CONFIG.aiPersonality,
                })
                // Parse workingHours JSON into simple fields
                if (d.workingHours) {
                    try {
                        const wh = JSON.parse(d.workingHours)
                        const activeDays = Object.entries(wh)
                            .filter(([, v]: any) => v.active)
                            .map(([k]) => k)
                            .join(',')
                        setWorkingDays(activeDays)
                        const firstActive: any = Object.values(wh).find((v: any) => v.active)
                        if (firstActive) {
                            setWorkingStart(firstActive.start)
                            setWorkingEnd(firstActive.end)
                        }
                        setWorkingHoursEnabled(activeDays.length > 0)
                    } catch {}
                }
            }
            setLoading(false)
        })
    }, [])

    const save = async () => {
        setSaving(true)
        // Rebuild workingHours JSON from simple fields
        const days: Record<string, any> = {}
        const allDays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
        const activeDayList = workingDays.split(',').filter(Boolean)
        for (const d of allDays) {
            days[d] = {
                start: workingStart,
                end: workingEnd,
                active: workingHoursEnabled && activeDayList.includes(d)
            }
        }
        const result = await saveBotConfig({
            ...config,
            workingHours: JSON.stringify(days),
        })
        setSaving(false)
        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
    }

    const set = (k: string, v: any) => setConfig((p: any) => ({ ...p, [k]: v }))

    if (loading) {
        return (
            <div className="flex items-center justify-center h-48 text-[#777]">
                <Loader2 className="animate-spin mr-2" size={20} />
                Carregando configurações...
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Bot className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Configuração do Robô</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/bot" className="text-[#3c8dbc] hover:underline">Robô</Link> &gt; Configuração
                </div>
            </div>

            {saved && (
                <div className="bg-green-50 border border-green-200 rounded-sm p-3 flex items-center gap-2 text-green-700 text-sm">
                    <CheckCircle size={16} />
                    Configurações salvas com sucesso!
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WhatsApp */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-[#f4f4f4]" style={{ borderLeftColor: '#25D366', borderLeftWidth: 4 }}>
                        <Phone size={20} className="text-green-600" />
                        <div className="flex-1">
                            <h3 className="font-bold text-[#333]">WhatsApp Bot</h3>
                            <p className="text-xs text-[#777]">Respostas automáticas via WhatsApp</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-[#777]">{config.whatsappEnabled ? 'Ativo' : 'Inativo'}</span>
                            <div
                                onClick={() => set('whatsappEnabled', !config.whatsappEnabled)}
                                className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${config.whatsappEnabled ? 'bg-green-500' : 'bg-gray-300'} relative`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${config.whatsappEnabled ? 'left-5' : 'left-0.5'}`} />
                            </div>
                        </label>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Mensagem de Boas-Vindas</label>
                            <p className="text-[10px] text-[#999] mb-1">Enviada quando o cliente envia a primeira mensagem. Use {'{{name}}'} para o nome.</p>
                            <textarea
                                value={config.whatsappGreeting ?? ''}
                                onChange={e => set('whatsappGreeting', e.target.value)}
                                rows={8}
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none font-mono text-xs focus:outline-none focus:border-[#25D366]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Mensagem Fora do Horário</label>
                            <textarea
                                value={config.whatsappAwayMsg ?? ''}
                                onChange={e => set('whatsappAwayMsg', e.target.value)}
                                rows={5}
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none font-mono text-xs focus:outline-none focus:border-[#25D366]"
                            />
                        </div>
                    </div>
                </div>

                {/* Instagram */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-[#f4f4f4]" style={{ borderLeftColor: '#E1306C', borderLeftWidth: 4 }}>
                        <Instagram size={20} className="text-pink-600" />
                        <div className="flex-1">
                            <h3 className="font-bold text-[#333]">Instagram Bot</h3>
                            <p className="text-xs text-[#777]">Respostas automáticas no Instagram DM</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-[#777]">{config.instagramEnabled ? 'Ativo' : 'Inativo'}</span>
                            <div
                                onClick={() => set('instagramEnabled', !config.instagramEnabled)}
                                className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${config.instagramEnabled ? 'bg-pink-500' : 'bg-gray-300'} relative`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${config.instagramEnabled ? 'left-5' : 'left-0.5'}`} />
                            </div>
                        </label>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="p-3 bg-[#fff8e1] border border-[#ffe082] rounded text-xs text-[#7d5a00] flex items-start gap-2">
                            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                            Configure o token do Instagram em <Link href="/admin/settings#integrations" className="text-[#3c8dbc] hover:underline font-bold">Configurações → Integrações</Link> para ativar.
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Mensagem de Boas-Vindas</label>
                            <textarea
                                value={config.instagramGreeting ?? ''}
                                onChange={e => set('instagramGreeting', e.target.value)}
                                rows={4}
                                className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#E1306C]"
                            />
                        </div>
                    </div>
                </div>

                {/* AI */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-[#f4f4f4]" style={{ borderLeftColor: '#8e44ad', borderLeftWidth: 4 }}>
                        <Brain size={20} className="text-purple-600" />
                        <div className="flex-1">
                            <h3 className="font-bold text-[#333]">Respostas com IA</h3>
                            <p className="text-xs text-[#777]">Usa ChatGPT/Gemini para responder dúvidas complexas</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-xs text-[#777]">{config.aiEnabled ? 'Ativo' : 'Inativo'}</span>
                            <div
                                onClick={() => set('aiEnabled', !config.aiEnabled)}
                                className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${config.aiEnabled ? 'bg-purple-500' : 'bg-gray-300'} relative`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${config.aiEnabled ? 'left-5' : 'left-0.5'}`} />
                            </div>
                        </label>
                    </div>
                    <div className="p-4 space-y-4">
                        {!config.aiEnabled && (
                            <div className="p-3 bg-[#f3e8ff] border border-[#d8b4fe] rounded text-xs text-[#6b21a8] flex items-start gap-2">
                                <Brain size={14} className="flex-shrink-0 mt-0.5" />
                                Configure sua chave de API da OpenAI ou Gemini em <Link href="/admin/settings#ai" className="text-[#3c8dbc] hover:underline font-bold">Configurações → IA</Link> para usar este recurso.
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Personalidade / Instruções da IA</label>
                            <p className="text-[10px] text-[#999] mb-1">Define como a IA deve se comportar e quais informações pode responder.</p>
                            <textarea
                                value={config.aiPersonality ?? ''}
                                onChange={e => set('aiPersonality', e.target.value)}
                                rows={5}
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#8e44ad]"
                            />
                        </div>
                    </div>
                </div>

                {/* Working hours */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 p-4 border-b border-[#f4f4f4]" style={{ borderLeftColor: '#3c8dbc', borderLeftWidth: 4 }}>
                        <Clock size={20} className="text-blue-600" />
                        <div>
                            <h3 className="font-bold text-[#333]">Horário de Atendimento</h3>
                            <p className="text-xs text-[#777]">Fora deste horário, envia mensagem automática</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={workingHoursEnabled} onChange={e => setWorkingHoursEnabled(e.target.checked)} />
                            <span className="text-sm text-[#555]">Ativar controle de horário</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Início</label>
                                <input type="time" value={workingStart} onChange={e => setWorkingStart(e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Fim</label>
                                <input type="time" value={workingEnd} onChange={e => setWorkingEnd(e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Dias de Atendimento</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {[['seg', 'Seg'], ['ter', 'Ter'], ['qua', 'Qua'], ['qui', 'Qui'], ['sex', 'Sex'], ['sab', 'Sáb'], ['dom', 'Dom']].map(([key, label]) => {
                                    const days = workingDays.split(',')
                                    const active = days.includes(key)
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                const d = days.includes(key) ? days.filter(x => x !== key) : [...days, key]
                                                setWorkingDays(d.join(','))
                                            }}
                                            className={`w-10 h-10 rounded-full text-xs font-bold border transition-colors ${active ? 'bg-[#3c8dbc] text-white border-[#3c8dbc]' : 'bg-white text-[#777] border-[#d2d6de] hover:bg-[#f4f4f4]'}`}
                                        >
                                            {label}
                                        </button>
                                    )
                                })}
                            </div>
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
                    {saving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
            </div>
        </div>
    )
}
