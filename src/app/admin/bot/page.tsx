'use client'

import { useState } from "react"
import { Bot, MessageSquare, Clock, User, Send, CheckCheck, Search, Circle, ArrowRight, Phone, Link2, Settings, Plus, RefreshCw } from "lucide-react"
import Link from 'next/link'

interface Message {
    id: string
    role: 'USER' | 'BOT' | 'HUMAN'
    content: string
    createdAt: string
}

interface Conversation {
    id: string
    contactId: string
    contactName: string
    contactPhone: string
    status: 'OPEN' | 'CLOSED' | 'TRANSFERRED'
    lastMessage: string
    lastAt: string
    unread: number
    messages: Message[]
}

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        contactId: '5511999990001',
        contactName: 'João Silva',
        contactPhone: '5511999990001',
        status: 'OPEN',
        lastMessage: 'Quero saber mais sobre o leilão de março',
        lastAt: '2026-03-11T10:30',
        unread: 2,
        messages: [
            { id: '1', role: 'USER', content: 'Olá, tudo bem?', createdAt: '2026-03-11T10:20' },
            { id: '2', role: 'BOT', content: 'Olá! 👋 Bem-vindo ao Pátio Rocha Leilões! Como posso te ajudar hoje?\n\n1️⃣ Ver leilões disponíveis\n2️⃣ Habilitação\n3️⃣ Falar com atendente', createdAt: '2026-03-11T10:20' },
            { id: '3', role: 'USER', content: 'Quero saber mais sobre o leilão de março', createdAt: '2026-03-11T10:30' },
        ]
    },
    {
        id: '2',
        contactId: '5511988880002',
        contactName: 'Maria Santos',
        contactPhone: '5511988880002',
        status: 'TRANSFERRED',
        lastMessage: 'Preciso de ajuda com meu cadastro',
        lastAt: '2026-03-11T09:15',
        unread: 0,
        messages: [
            { id: '1', role: 'USER', content: 'Preciso de ajuda com meu cadastro', createdAt: '2026-03-11T09:10' },
            { id: '2', role: 'BOT', content: 'Vou transferir para um de nossos atendentes. Aguarde um momento...', createdAt: '2026-03-11T09:10' },
            { id: '3', role: 'HUMAN', content: 'Olá Maria! Pode me contar o problema com seu cadastro?', createdAt: '2026-03-11T09:15' },
        ]
    },
    {
        id: '3',
        contactId: '5511977770003',
        contactName: 'Carlos Oliveira',
        contactPhone: '5511977770003',
        status: 'CLOSED',
        lastMessage: 'Ok, obrigado!',
        lastAt: '2026-03-10T16:45',
        unread: 0,
        messages: [
            { id: '1', role: 'USER', content: 'Quando é o próximo leilão?', createdAt: '2026-03-10T16:40' },
            { id: '2', role: 'BOT', content: 'Nosso próximo leilão está agendado para *15/03/2026* às *14h00*. Para se habilitar acesse: https://patiorocha.com.br', createdAt: '2026-03-10T16:40' },
            { id: '3', role: 'USER', content: 'Ok, obrigado!', createdAt: '2026-03-10T16:45' },
        ]
    },
]

const STATUS_CONFIG = {
    OPEN: { label: 'Aberta', color: 'text-green-600', dot: 'bg-green-500' },
    CLOSED: { label: 'Encerrada', color: 'text-gray-500', dot: 'bg-gray-400' },
    TRANSFERRED: { label: 'Transferida', color: 'text-blue-600', dot: 'bg-blue-500' },
}

export default function BotPage() {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
    const [selected, setSelected] = useState<Conversation | null>(MOCK_CONVERSATIONS[0])
    const [search, setSearch] = useState('')
    const [reply, setReply] = useState('')
    const [filterStatus, setFilterStatus] = useState('ALL')

    const filtered = conversations.filter(c => {
        if (filterStatus !== 'ALL' && c.status !== filterStatus) return false
        if (search && !c.contactName.toLowerCase().includes(search.toLowerCase()) && !c.contactPhone.includes(search)) return false
        return true
    })

    const sendReply = () => {
        if (!reply.trim() || !selected) return
        const msg: Message = {
            id: crypto.randomUUID(), role: 'HUMAN', content: reply,
            createdAt: new Date().toISOString()
        }
        setConversations(p => p.map(c => c.id === selected.id ? {
            ...c, messages: [...c.messages, msg], lastMessage: reply, lastAt: msg.createdAt
        } : c))
        setSelected(p => p ? { ...p, messages: [...p.messages, msg], lastMessage: reply } : null)
        setReply('')
    }

    const totalOpen = conversations.filter(c => c.status === 'OPEN').length
    const totalToday = conversations.filter(c => c.lastAt.startsWith('2026-03-11')).length

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Bot className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Robô WhatsApp</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/bot/flows" className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1"><ArrowRight size={12} />Fluxos</Link>
                    <Link href="/admin/bot/config" className="text-xs text-[#3c8dbc] hover:underline flex items-center gap-1"><Settings size={12} />Configurar</Link>
                    <div className="text-[12px] text-[#777]">Home &gt; Robô</div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Conversas Abertas" value={totalOpen} color="#00a65a" icon={<Circle size={20} />} />
                <StatCard label="Hoje" value={totalToday} color="#3c8dbc" icon={<Clock size={20} />} />
                <StatCard label="Total" value={conversations.length} color="#8e44ad" icon={<MessageSquare size={20} />} />
                <StatCard label="Robô Ativo" value="SIM" color="#00a65a" icon={<Bot size={20} />} />
            </div>

            {/* Main chat interface */}
            <div className="grid grid-cols-3 gap-0 bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden" style={{ height: '600px' }}>
                {/* Conversations list */}
                <div className="border-r border-[#f4f4f4] flex flex-col">
                    <div className="p-3 border-b border-[#f4f4f4]">
                        <div className="flex items-center gap-1.5 border border-[#d2d6de] rounded px-2 py-1.5">
                            <Search size={14} className="text-[#999]" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar conversas..." className="text-sm outline-none w-full" />
                        </div>
                        <div className="flex gap-1 mt-2">
                            {(['ALL', 'OPEN', 'TRANSFERRED', 'CLOSED'] as const).map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} className={`text-[10px] font-bold px-2 py-1 rounded ${filterStatus === s ? 'bg-[#3c8dbc] text-white' : 'bg-[#f4f4f4] text-[#777]'}`}>
                                    {s === 'ALL' ? 'Todas' : s === 'OPEN' ? 'Abertas' : s === 'TRANSFERRED' ? 'Transfer.' : 'Encerradas'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filtered.map(c => {
                            const sc = STATUS_CONFIG[c.status]
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => setSelected(c)}
                                    className={`p-3 border-b border-[#f4f4f4] cursor-pointer hover:bg-[#f9f9f9] ${selected?.id === c.id ? 'bg-[#dce8f3]' : ''}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
                                            <span className="font-semibold text-sm text-[#333]">{c.contactName}</span>
                                        </div>
                                        {c.unread > 0 && (
                                            <span className="w-5 h-5 bg-[#00a65a] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{c.unread}</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-[#777] line-clamp-1">{c.lastMessage}</div>
                                    <div className="text-[10px] text-[#aaa] mt-1">
                                        {new Date(c.lastAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Chat area */}
                <div className="col-span-2 flex flex-col">
                    {selected ? (
                        <>
                            {/* Chat header */}
                            <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4] bg-[#f9f9f9]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold">
                                        {selected.contactName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#333]">{selected.contactName}</div>
                                        <div className="text-xs text-[#777]">+{selected.contactPhone}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${selected.status === 'OPEN' ? 'bg-green-100 text-green-600' : selected.status === 'TRANSFERRED' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {STATUS_CONFIG[selected.status].label}
                                    </span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5]">
                                {selected.messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.role === 'USER' ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${msg.role === 'USER' ? 'bg-white text-[#333]' : msg.role === 'BOT' ? 'bg-[#dcf8c6] text-[#333]' : 'bg-[#3c8dbc] text-white'}`}>
                                            {msg.role !== 'USER' && (
                                                <div className={`text-[10px] font-bold mb-1 ${msg.role === 'BOT' ? 'text-[#00a65a]' : 'text-blue-200'}`}>
                                                    {msg.role === 'BOT' ? '🤖 Bot' : '👤 Atendente'}
                                                </div>
                                            )}
                                            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                                            <div className={`text-[10px] mt-1 text-right ${msg.role === 'USER' ? 'text-[#aaa]' : msg.role === 'HUMAN' ? 'text-blue-200' : 'text-[#777]'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply box */}
                            <div className="p-3 border-t border-[#f4f4f4] bg-white">
                                <div className="flex items-end gap-2">
                                    <textarea
                                        value={reply}
                                        onChange={e => setReply(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendReply())}
                                        placeholder="Digite uma mensagem como atendente... (Enter para enviar)"
                                        rows={2}
                                        className="flex-1 border border-[#d2d6de] rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#3c8dbc]"
                                    />
                                    <button
                                        onClick={sendReply}
                                        disabled={!reply.trim()}
                                        className="p-3 rounded-full text-white flex-shrink-0 disabled:opacity-50 transition-colors"
                                        style={{ backgroundColor: '#25D366' }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <div className="text-[10px] text-[#aaa] mt-1">Mensagens enviadas como atendente humano</div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[#aaa]">
                            <div className="text-center">
                                <MessageSquare size={40} className="mx-auto mb-3 opacity-50" />
                                <p>Selecione uma conversa</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, color, icon }: any) {
    return (
        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-4 flex items-center gap-3">
            <div style={{ color, opacity: 0.8 }}>{icon}</div>
            <div>
                <div className="text-lg font-bold" style={{ color }}>{value}</div>
                <div className="text-xs text-[#777]">{label}</div>
            </div>
        </div>
    )
}
