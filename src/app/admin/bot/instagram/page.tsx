'use client'

import { useState, useEffect } from "react"
import {
    Instagram,
    Save,
    CheckCircle,
    AlertCircle,
    Brain,
    MessageCircle,
    User,
    Loader2,
    ExternalLink
} from "lucide-react"
import Link from 'next/link'
import { getBotConfig, saveBotConfig } from "@/app/actions/bot"

export default function InstagramBotPage() {
    const [instagramEnabled, setInstagramEnabled] = useState(false)
    const [instagramUsername, setInstagramUsername] = useState('')
    const [instagramGreeting, setInstagramGreeting] = useState(
        'Olá! 😊 Obrigado por entrar em contato com o Pátio Rocha Leilões!\n\nComo podemos ajudar você?\n\n1️⃣ Leilões disponíveis\n2️⃣ Como participar\n3️⃣ Falar com atendente'
    )
    const [aiEnabled, setAiEnabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        getBotConfig().then(res => {
            if (res.success && res.data) {
                const d = res.data
                setInstagramEnabled(d.instagramEnabled ?? false)
                setInstagramUsername(d.instagramUsername ?? '')
                setInstagramGreeting(d.instagramGreeting ?? instagramGreeting)
                setAiEnabled(d.aiEnabled ?? false)
            }
            setLoading(false)
        })
    }, [])

    const save = async () => {
        setSaving(true)
        setError('')
        const result = await saveBotConfig({
            instagramEnabled,
            instagramUsername,
            instagramGreeting,
            aiEnabled,
        })
        setSaving(false)
        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } else {
            setError('Erro ao salvar. Tente novamente.')
        }
    }

    // Preview message lines
    const previewLines = instagramGreeting.split('\n').filter(Boolean)

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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Instagram className="h-[22px] w-[22px] text-pink-600" />
                    <h1 className="text-[24px] font-normal m-0">Robô Instagram</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/bot" className="text-[#3c8dbc] hover:underline">Robô</Link> &gt; Instagram
                </div>
            </div>

            {saved && (
                <div className="bg-green-50 border border-green-200 rounded-sm p-3 flex items-center gap-2 text-green-700 text-sm">
                    <CheckCircle size={16} />
                    Configurações do Instagram salvas com sucesso!
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-sm p-3 flex items-center gap-2 text-red-700 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: config */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main toggle card */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                        <div
                            className="flex items-center gap-3 p-4 border-b border-[#f4f4f4]"
                            style={{ borderTopColor: '#E1306C', borderTopWidth: 3 }}
                        >
                            <Instagram size={20} className="text-pink-600" />
                            <div className="flex-1">
                                <h3 className="font-bold text-[#333]">Instagram DM Bot</h3>
                                <p className="text-xs text-[#777]">Responde automaticamente mensagens diretas no Instagram</p>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-[#777]">{instagramEnabled ? 'Ativo' : 'Inativo'}</span>
                                <div
                                    onClick={() => setInstagramEnabled(v => !v)}
                                    className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${instagramEnabled ? 'bg-pink-500' : 'bg-gray-300'} relative`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${instagramEnabled ? 'left-5' : 'left-0.5'}`} />
                                </div>
                            </label>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Token warning */}
                            <div className="p-3 bg-[#fff8e1] border border-[#ffe082] rounded text-xs text-[#7d5a00] flex items-start gap-2">
                                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                <span>
                                    Para ativar o robô, configure o token de acesso do Instagram em{' '}
                                    <Link href="/admin/settings/integrations" className="text-[#3c8dbc] hover:underline font-bold">
                                        Configurações → Integrações
                                    </Link>
                                    . Você precisa de uma conta Business ou Creator conectada a uma Página do Facebook.{' '}
                                    <a href="https://developers.facebook.com/docs/messenger-platform/instagram" target="_blank" rel="noopener noreferrer" className="text-[#3c8dbc] hover:underline inline-flex items-center gap-1">
                                        Saiba mais <ExternalLink size={10} />
                                    </a>
                                </span>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="text-xs font-bold text-[#555] uppercase">Usuário do Instagram</label>
                                <p className="text-[10px] text-[#999] mb-1">Ex: patiorochaleiloes (sem o @)</p>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border border-r-0 border-[#d2d6de] rounded-l bg-[#f4f4f4] text-[#777] text-sm">@</span>
                                    <input
                                        type="text"
                                        value={instagramUsername}
                                        onChange={e => setInstagramUsername(e.target.value)}
                                        placeholder="patiorochaleiloes"
                                        className="flex-1 border border-[#d2d6de] rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#E1306C]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Greeting message */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 p-4 border-b border-[#f4f4f4]" style={{ borderLeftColor: '#E1306C', borderLeftWidth: 4 }}>
                            <MessageCircle size={18} className="text-pink-600" />
                            <div>
                                <h3 className="font-bold text-[#333]">Mensagem de Boas-Vindas</h3>
                                <p className="text-xs text-[#777]">Enviada automaticamente quando alguém envia um DM pela primeira vez</p>
                            </div>
                        </div>
                        <div className="p-4">
                            <label className="text-xs font-bold text-[#555] uppercase">Texto da Mensagem</label>
                            <p className="text-[10px] text-[#999] mb-2 mt-0.5">
                                Use {'{{name}}'} para o nome do usuário. Emojis são suportados.
                            </p>
                            <textarea
                                value={instagramGreeting}
                                onChange={e => setInstagramGreeting(e.target.value)}
                                rows={8}
                                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#E1306C]"
                                placeholder="Digite a mensagem de boas-vindas..."
                            />
                            <p className="text-[10px] text-[#999] mt-1">{instagramGreeting.length} caracteres</p>
                        </div>
                    </div>

                    {/* AI Toggle */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 p-4 border-b border-[#f4f4f4]" style={{ borderLeftColor: '#8e44ad', borderLeftWidth: 4 }}>
                            <Brain size={18} className="text-purple-600" />
                            <div className="flex-1">
                                <h3 className="font-bold text-[#333]">Respostas com IA</h3>
                                <p className="text-xs text-[#777]">Usa IA para responder perguntas além do menu inicial</p>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-[#777]">{aiEnabled ? 'Ativo' : 'Inativo'}</span>
                                <div
                                    onClick={() => setAiEnabled(v => !v)}
                                    className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${aiEnabled ? 'bg-purple-500' : 'bg-gray-300'} relative`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${aiEnabled ? 'left-5' : 'left-0.5'}`} />
                                </div>
                            </label>
                        </div>
                        <div className="p-4">
                            {aiEnabled ? (
                                <div className="p-3 bg-purple-50 border border-purple-200 rounded text-xs text-purple-800 flex items-start gap-2">
                                    <Brain size={14} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        IA ativada. Configure a personalidade do robô em{' '}
                                        <Link href="/admin/bot/config" className="text-[#3c8dbc] hover:underline font-bold">
                                            Configuração Geral
                                        </Link>
                                        .
                                    </span>
                                </div>
                            ) : (
                                <div className="p-3 bg-[#f3e8ff] border border-[#d8b4fe] rounded text-xs text-[#6b21a8] flex items-start gap-2">
                                    <Brain size={14} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                        Com IA desativada, o robô envia apenas a mensagem de boas-vindas e encaminha para atendimento humano após o menu.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column: preview */}
                <div className="space-y-4">
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden sticky top-4">
                        <div className="p-4 border-b border-[#f4f4f4]" style={{ borderTopColor: '#E1306C', borderTopWidth: 3 }}>
                            <h3 className="font-bold text-[#333] text-sm flex items-center gap-2">
                                <MessageCircle size={15} className="text-pink-600" />
                                Prévia da Conversa
                            </h3>
                            <p className="text-[11px] text-[#777] mt-0.5">Como aparece no DM do Instagram</p>
                        </div>

                        {/* Instagram DM mockup */}
                        <div className="p-4">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f4f4f4]">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">PR</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#333]">
                                        {instagramUsername ? `@${instagramUsername}` : '@patiorochaleiloes'}
                                    </p>
                                    <p className="text-[10px] text-[#777]">Pátio Rocha Leilões</p>
                                </div>
                            </div>

                            {/* Chat bubbles */}
                            <div className="space-y-3">
                                {/* User message */}
                                <div className="flex justify-end">
                                    <div className="bg-[#0095f6] text-white rounded-[18px] rounded-tr-[4px] px-3 py-2 max-w-[80%] text-xs">
                                        Olá, quero participar de um leilão!
                                    </div>
                                </div>

                                {/* Bot greeting */}
                                <div className="flex justify-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0 flex items-center justify-center mt-auto">
                                        <span className="text-white" style={{ fontSize: 8, fontWeight: 'bold' }}>PR</span>
                                    </div>
                                    <div className="bg-[#efefef] rounded-[18px] rounded-tl-[4px] px-3 py-2 max-w-[85%]">
                                        {previewLines.length > 0 ? (
                                            previewLines.map((line, i) => (
                                                <p key={i} className="text-xs text-[#333] leading-relaxed">
                                                    {line.replace('{{name}}', 'João')}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-xs text-[#999] italic">Nenhuma mensagem configurada</p>
                                        )}
                                    </div>
                                </div>

                                {/* User reply */}
                                <div className="flex justify-end">
                                    <div className="bg-[#0095f6] text-white rounded-[18px] rounded-tr-[4px] px-3 py-2 max-w-[80%] text-xs">
                                        1
                                    </div>
                                </div>

                                {/* Bot with AI or menu */}
                                <div className="flex justify-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex-shrink-0 flex items-center justify-center mt-auto">
                                        <span className="text-white" style={{ fontSize: 8, fontWeight: 'bold' }}>PR</span>
                                    </div>
                                    <div className="bg-[#efefef] rounded-[18px] rounded-tl-[4px] px-3 py-2 max-w-[85%]">
                                        {aiEnabled ? (
                                            <p className="text-xs text-[#333]">
                                                ✨ <em>Resposta gerada pela IA com base no contexto...</em>
                                            </p>
                                        ) : (
                                            <p className="text-xs text-[#333]">
                                                📋 Aguarde um momento, estamos encaminhando para um de nossos atendentes! 😊
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status indicator */}
                            <div className="mt-4 pt-3 border-t border-[#f4f4f4]">
                                <div className={`flex items-center gap-1.5 text-[11px] font-bold ${instagramEnabled ? 'text-green-600' : 'text-[#999]'}`}>
                                    <span className={`w-2 h-2 rounded-full ${instagramEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                                    {instagramEnabled ? 'Robô ativo' : 'Robô inativo'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                        <div className="p-3 border-b border-[#f4f4f4]">
                            <h4 className="text-xs font-bold text-[#555] uppercase">Dicas de Configuração</h4>
                        </div>
                        <div className="p-3 space-y-2">
                            {[
                                'Mantenha a mensagem objetiva e com no máximo 300 caracteres para melhor leitura no mobile.',
                                'Use emojis para tornar a mensagem mais amigável e visualmente organizada.',
                                'Inclua as opções numeradas para facilitar a interação do cliente.',
                                'Com IA ativada, respostas são mais inteligentes mas consomem créditos da API.',
                            ].map((tip, i) => (
                                <div key={i} className="flex items-start gap-2 text-[11px] text-[#777]">
                                    <span className="text-[#E1306C] font-bold flex-shrink-0">•</span>
                                    {tip}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#E1306C] text-white font-bold rounded hover:bg-[#c2185b] transition-colors disabled:opacity-60"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Salvando...' : 'Salvar Configurações Instagram'}
                </button>
            </div>
        </div>
    )
}
