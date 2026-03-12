'use client'

import { useState } from 'react'
import { Users, Plus, Trash2, Edit2, Upload, Download, Mail, Phone, Search } from 'lucide-react'
import Link from 'next/link'

interface ContactList {
    id: string
    name: string
    description?: string
    type: 'EMAIL' | 'WHATSAPP' | 'BOTH'
    count: number
    createdAt: string
}

interface Contact {
    id: string
    listId: string
    name: string
    email: string
    phone?: string
    tags?: string
    active: boolean
}

const MOCK_LISTS: ContactList[] = [
    { id: '1', name: 'Arrematantes Ativos', description: 'Clientes que participaram de leilões', type: 'EMAIL', count: 1250, createdAt: '2026-01-15' },
    { id: '2', name: 'Newsletter Geral', description: 'Todos os inscritos na newsletter', type: 'BOTH', count: 3480, createdAt: '2025-06-01' },
    { id: '3', name: 'Clientes VIP', description: 'Maiores compradores', type: 'EMAIL', count: 87, createdAt: '2026-02-10' },
]

const MOCK_CONTACTS: Contact[] = [
    { id: '1', listId: '1', name: 'João Silva', email: 'joao@email.com', phone: '11999990001', tags: 'veiculos,imoveis', active: true },
    { id: '2', listId: '1', name: 'Maria Santos', email: 'maria@email.com', phone: '11999990002', tags: 'veiculos', active: true },
    { id: '3', listId: '1', name: 'Carlos Oliveira', email: 'carlos@email.com', tags: 'imoveis', active: false },
]

export default function MarketingListsPage() {
    const [lists, setLists] = useState<ContactList[]>(MOCK_LISTS)
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS)
    const [selectedList, setSelectedList] = useState<ContactList | null>(null)
    const [search, setSearch] = useState('')
    const [showNewList, setShowNewList] = useState(false)
    const [showNewContact, setShowNewContact] = useState(false)
    const [newListName, setNewListName] = useState('')
    const [newListType, setNewListType] = useState<'EMAIL' | 'WHATSAPP' | 'BOTH'>('EMAIL')
    const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', tags: '' })

    const listContacts = selectedList ? contacts.filter(c => c.listId === selectedList.id) : []
    const filtered = listContacts.filter(c =>
        !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    )

    const createList = () => {
        if (!newListName.trim()) return
        setLists(p => [...p, {
            id: crypto.randomUUID(), name: newListName, type: newListType, count: 0,
            createdAt: new Date().toISOString().split('T')[0]
        }])
        setNewListName('')
        setShowNewList(false)
    }

    const addContact = () => {
        if (!newContact.name || !newContact.email || !selectedList) return
        setContacts(p => [...p, { id: crypto.randomUUID(), listId: selectedList.id, ...newContact, active: true }])
        setNewContact({ name: '', email: '', phone: '', tags: '' })
        setShowNewContact(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <Users className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Listas de Contatos</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/marketing" className="text-[#3c8dbc] hover:underline">Marketing</Link> &gt; Listas
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lists sidebar */}
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                        <h3 className="font-bold text-[#333] text-sm">Listas</h3>
                        <button onClick={() => setShowNewList(!showNewList)} className="p-1.5 bg-[#3c8dbc] text-white rounded hover:bg-[#367fa9]">
                            <Plus size={14} />
                        </button>
                    </div>
                    {showNewList && (
                        <div className="p-3 border-b bg-[#f9f9f9] space-y-2">
                            <input value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="Nome da lista *" className="w-full border border-[#d2d6de] rounded px-2 py-1.5 text-sm" />
                            <select value={newListType} onChange={e => setNewListType(e.target.value as any)} className="w-full border border-[#d2d6de] rounded px-2 py-1.5 text-sm">
                                <option value="EMAIL">Email</option>
                                <option value="WHATSAPP">WhatsApp</option>
                                <option value="BOTH">Ambos</option>
                            </select>
                            <button onClick={createList} className="w-full bg-[#00a65a] text-white text-sm font-bold rounded py-1.5 hover:bg-[#008d4c]">Criar Lista</button>
                        </div>
                    )}
                    <div>
                        {lists.map(l => (
                            <button key={l.id} onClick={() => setSelectedList(l)} className={`w-full text-left p-4 border-b border-[#f4f4f4] hover:bg-[#f9f9f9] transition-colors ${selectedList?.id === l.id ? 'bg-[#dce8f3] border-l-4 border-l-[#3c8dbc]' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-[#333]">{l.name}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${l.type === 'EMAIL' ? 'bg-blue-100 text-blue-600' : l.type === 'WHATSAPP' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {l.type}
                                    </span>
                                </div>
                                <div className="text-xs text-[#777] mt-1">{l.count.toLocaleString('pt-BR')} contatos</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contacts panel */}
                <div className="lg:col-span-2 bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    {selectedList ? (
                        <>
                            <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                                <h3 className="font-bold text-[#333]">{selectedList.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 border border-[#d2d6de] rounded px-2 py-1.5">
                                        <Search size={14} className="text-[#999]" />
                                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="text-sm outline-none w-28" />
                                    </div>
                                    <button title="Importar CSV" className="p-1.5 border border-[#d2d6de] rounded text-[#555] hover:bg-[#f4f4f4]"><Upload size={14} /></button>
                                    <button title="Exportar" className="p-1.5 border border-[#d2d6de] rounded text-[#555] hover:bg-[#f4f4f4]"><Download size={14} /></button>
                                    <button onClick={() => setShowNewContact(!showNewContact)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#00a65a] rounded hover:bg-[#008d4c]">
                                        <Plus size={14} />
                                        Contato
                                    </button>
                                </div>
                            </div>
                            {showNewContact && (
                                <div className="p-4 border-b bg-[#f9f9f9]">
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} placeholder="Nome *" className="border border-[#d2d6de] rounded px-2 py-1.5 text-sm" />
                                        <input value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} placeholder="Email *" className="border border-[#d2d6de] rounded px-2 py-1.5 text-sm" />
                                        <input value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} placeholder="WhatsApp (55XXXXXXXXXX)" className="border border-[#d2d6de] rounded px-2 py-1.5 text-sm" />
                                        <input value={newContact.tags} onChange={e => setNewContact(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (separadas por vírgula)" className="border border-[#d2d6de] rounded px-2 py-1.5 text-sm" />
                                    </div>
                                    <button onClick={addContact} className="px-4 py-1.5 bg-[#3c8dbc] text-white text-sm font-bold rounded hover:bg-[#367fa9]">Adicionar Contato</button>
                                </div>
                            )}
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#f9f9f9] border-b border-[#f4f4f4]">
                                        <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Nome</th>
                                        <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Email</th>
                                        <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">WhatsApp</th>
                                        <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Tags</th>
                                        <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Status</th>
                                        <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(c => (
                                        <tr key={c.id} className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9]">
                                            <td className="p-3 font-medium text-[#333]">{c.name}</td>
                                            <td className="p-3 text-xs text-[#777]">{c.email}</td>
                                            <td className="p-3 text-xs text-[#777]">{c.phone || '—'}</td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {c.tags?.split(',').filter(Boolean).map(tag => (
                                                        <span key={tag} className="text-[10px] bg-[#f4f4f4] text-[#555] px-1.5 py-0.5 rounded-full">{tag.trim()}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {c.active ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button className="p-1.5 bg-[#3c8dbc] text-white rounded-sm"><Edit2 size={12} /></button>
                                                    <button onClick={() => setContacts(p => p.filter(x => x.id !== c.id))} className="p-1.5 bg-[#dd4b39] text-white rounded-sm"><Trash2 size={12} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-[#aaa]">
                            <Users size={40} className="mb-3 opacity-50" />
                            <p className="text-sm">Selecione uma lista para ver os contatos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
