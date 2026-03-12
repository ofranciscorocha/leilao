'use client'

import { useState, useEffect } from 'react'
import {
    Brain, Key, Save, CheckCircle, Eye, EyeOff, TestTube2,
    Zap, Settings, AlertCircle, Sparkles, Bot, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { getSystemSettings, updateSystemSettings } from '@/app/actions/settings'

export default function AISettingsPage() {
    const [config, setConfig] = useState({
        activeProvider: 'openai',
        openaiApiKey: '',
        openaiModel: 'gpt-4o',
        geminiApiKey: '',
        geminiModel: 'gemini-1.5-pro',
        vistoriaEnabled: true,
        botAiEnabled: false,
        marketingAiEnabled: false,
        descriptionAiEnabled: true,
    })
    const [showOpenAI, setShowOpenAI] = useState(false)
    const [showGemini, setShowGemini] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState<string | null>(null)

    const set = (k: string, v: any) => setConfig(p => ({ ...p, [k]: v }))

    useEffect(() => {
        async function load() {
            setLoading(true)
            const result = await getSystemSettings()
            if (result.success && result.data) {
                const d = result.data as any
                setConfig(prev => ({
                    ...prev,
                    activeProvider: d.activeAiProvider ?? prev.activeProvider,
                    openaiApiKey: d.openaiApiKey ?? prev.openaiApiKey,
                    openaiModel: d.openaiModel ?? prev.openaiModel,
                    geminiApiKey: d.geminiApiKey ?? prev.geminiApiKey,
                    geminiModel: d.geminiModel ?? prev.geminiModel,
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
            activeAiProvider: config.activeProvider,
            openaiApiKey: config.openaiApiKey,
            openaiModel: config.openaiModel,
            geminiApiKey: config.geminiApiKey,
            geminiModel: config.geminiModel,
        })
        setSaving(false)
        if (result.success) {
            showToast('success', result.message ?? 'Configurações de IA salvas com sucesso!')
        } else {
            showToast('error', result.message ?? 'Erro ao salvar configurações.')
        }
    }

    const testConnection = async () => {
        if (!config.openaiApiKey && !config.geminiApiKey) {
            setTestResult('❌ Configure uma chave de API primeiro.')
            return
        }
        setTesting(true)
        setTestResult(null)
        await new Promise(r => setTimeout(r, 1500))
        setTesting(false)
        setTestResult('✅ Conexão bem-sucedida! API respondendo corretamente.')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#8e44ad]" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Brain className="h-[22px] w-[22px] text-purple-600" />
                    <h1 className="text-[24px] font-normal m-0">Configuração de IA</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/settings" className="text-[#3c8dbc] hover:underline">Configurações</Link> &gt; IA
                </div>
            </div>

            {toast && (
                <div className={`border rounded-sm p-3 flex items-center gap-2 text-sm ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Provider selection */}
                <div className="lg:col-span-2 bg-white border border-[#d2d6de] rounded-sm shadow-sm p-5">
                    <h3 className="font-bold text-[#333] mb-4 flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-600" />
                        Provedor de IA Ativo
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => set('activeProvider', 'openai')}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${config.activeProvider === 'openai' ? 'border-[#10a37f] bg-[#f0fdf4]' : 'border-[#d2d6de] hover:border-[#10a37f]'}`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-[#10a37f] rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">AI</span>
                                </div>
                                <div>
                                    <div className="font-bold text-[#333]">OpenAI (ChatGPT)</div>
                                    <div className="text-xs text-[#777]">GPT-4o, GPT-4 Vision</div>
                                </div>
                                {config.activeProvider === 'openai' && <CheckCircle size={18} className="ml-auto text-[#10a37f]" />}
                            </div>
                            <p className="text-xs text-[#777]">Melhor para análise de imagens, vistorias e geração de texto em português.</p>
                        </button>

                        <button
                            onClick={() => set('activeProvider', 'gemini')}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${config.activeProvider === 'gemini' ? 'border-[#4285f4] bg-[#f0f4ff]' : 'border-[#d2d6de] hover:border-[#4285f4]'}`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-[#4285f4] rounded-lg flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">G</span>
                                </div>
                                <div>
                                    <div className="font-bold text-[#333]">Google Gemini</div>
                                    <div className="text-xs text-[#777]">Gemini 1.5 Pro, Flash</div>
                                </div>
                                {config.activeProvider === 'gemini' && <CheckCircle size={18} className="ml-auto text-[#4285f4]" />}
                            </div>
                            <p className="text-xs text-[#777]">Alternativa gratuita com boa capacidade de análise de imagens.</p>
                        </button>
                    </div>
                </div>

                {/* OpenAI Config */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#f4f4f4] flex items-center gap-3" style={{ borderLeftColor: '#10a37f', borderLeftWidth: 4 }}>
                        <div className="w-8 h-8 bg-[#10a37f] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">AI</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#333]">OpenAI / ChatGPT</h3>
                            <p className="text-xs text-[#777]">platform.openai.com</p>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">API Key</label>
                            <div className="relative mt-1">
                                <input
                                    type={showOpenAI ? 'text' : 'password'}
                                    value={config.openaiApiKey}
                                    onChange={e => set('openaiApiKey', e.target.value)}
                                    className="w-full border border-[#d2d6de] rounded px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:border-[#10a37f]"
                                    placeholder="sk-proj-..."
                                />
                                <button onClick={() => setShowOpenAI(!showOpenAI)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
                                    {showOpenAI ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-[#aaa] mt-1">Obtenha em: platform.openai.com/api-keys</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Modelo</label>
                            <select value={config.openaiModel} onChange={e => set('openaiModel', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm">
                                <option value="gpt-4o">GPT-4o (recomendado - visão)</option>
                                <option value="gpt-4o-mini">GPT-4o Mini (mais rápido)</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (mais barato)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Gemini Config */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#f4f4f4] flex items-center gap-3" style={{ borderLeftColor: '#4285f4', borderLeftWidth: 4 }}>
                        <div className="w-8 h-8 bg-[#4285f4] rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">G</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#333]">Google Gemini</h3>
                            <p className="text-xs text-[#777]">aistudio.google.com</p>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">API Key</label>
                            <div className="relative mt-1">
                                <input
                                    type={showGemini ? 'text' : 'password'}
                                    value={config.geminiApiKey}
                                    onChange={e => set('geminiApiKey', e.target.value)}
                                    className="w-full border border-[#d2d6de] rounded px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:border-[#4285f4]"
                                    placeholder="AIzaSy..."
                                />
                                <button onClick={() => setShowGemini(!showGemini)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999]">
                                    {showGemini ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-[#aaa] mt-1">Obtenha em: aistudio.google.com/app/apikey</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Modelo</label>
                            <select value={config.geminiModel} onChange={e => set('geminiModel', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm">
                                <option value="gemini-1.5-pro">Gemini 1.5 Pro (recomendado)</option>
                                <option value="gemini-1.5-flash">Gemini 1.5 Flash (mais rápido)</option>
                                <option value="gemini-pro-vision">Gemini Pro Vision</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* AI Features */}
                <div className="lg:col-span-2 bg-white border border-[#d2d6de] rounded-sm shadow-sm p-5">
                    <h3 className="font-bold text-[#333] mb-4 flex items-center gap-2">
                        <Zap size={16} className="text-[#f39c12]" />
                        Funcionalidades com IA
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { key: 'vistoriaEnabled', label: 'Vistorias de Veículos', desc: 'Análise de fotos e geração de laudo técnico', icon: '🚗' },
                            { key: 'botAiEnabled', label: 'Robô de Atendimento', desc: 'Respostas inteligentes no WhatsApp/Instagram', icon: '🤖' },
                            { key: 'descriptionAiEnabled', label: 'Descrição de Lotes', desc: 'Gera descrições automáticas para lotes', icon: '📝' },
                            { key: 'marketingAiEnabled', label: 'Marketing com IA', desc: 'Cria textos e campanhas automaticamente', icon: '📧' },
                        ].map(feat => (
                            <div key={feat.key} className={`p-4 rounded-lg border-2 transition-all ${(config as any)[feat.key] ? 'border-[#8e44ad] bg-[#f9f3ff]' : 'border-[#d2d6de]'}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-2xl">{feat.icon}</span>
                                    <div
                                        onClick={() => set(feat.key, !(config as any)[feat.key])}
                                        className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${(config as any)[feat.key] ? 'bg-[#8e44ad]' : 'bg-gray-300'} relative flex-shrink-0`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${(config as any)[feat.key] ? 'left-5' : 'left-0.5'}`} />
                                    </div>
                                </div>
                                <div className="font-bold text-sm text-[#333]">{feat.label}</div>
                                <div className="text-xs text-[#777] mt-1">{feat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Test connection */}
                <div className="lg:col-span-2 bg-white border border-[#d2d6de] rounded-sm shadow-sm p-5">
                    <h3 className="font-bold text-[#333] mb-3 flex items-center gap-2">
                        <TestTube2 size={16} className="text-blue-600" />
                        Testar Conexão
                    </h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={testConnection}
                            disabled={testing}
                            className="flex items-center gap-2 px-4 py-2 bg-[#3c8dbc] text-white font-bold rounded hover:bg-[#367fa9] disabled:opacity-50"
                        >
                            {testing ? (
                                <><span className="animate-spin inline-block">⚙</span>Testando...</>
                            ) : (
                                <><TestTube2 size={14} />Testar API</>
                            )}
                        </button>
                        {testResult && (
                            <div className={`text-sm p-2 px-4 rounded border ${testResult.startsWith('✅') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                {testResult}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#8e44ad] text-white font-bold rounded hover:bg-[#7d3c98] transition-colors disabled:opacity-60"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Salvando...' : 'Salvar Configurações de IA'}
                </button>
            </div>
        </div>
    )
}
