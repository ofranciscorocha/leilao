'use client'

import { useState, useTransition, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Users, Plus, Search, Edit2, Trash2, X, Linkedin,
  Phone, Mail, Building, ChevronRight, Kanban, Activity, UserCheck
} from "lucide-react"
import Link from 'next/link'
import {
  createCrmContact,
  updateCrmContact,
  deleteCrmContact,
} from "@/app/actions/crm"

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'NOVO' | 'CONTATO' | 'QUALIFICADO' | 'PROPOSTA' | 'NEGOCIACAO' | 'GANHO' | 'PERDIDO'
type Priority = 'HIGH' | 'NORMAL' | 'LOW'
type ContactType = 'LEAD' | 'PROSPECT' | 'CLIENT' | 'PARTNER'

interface Contact {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  mobile?: string | null
  company?: string | null
  position?: string | null
  linkedinUrl?: string | null
  type: string
  source?: string | null
  tags?: string | null
  stage: Stage
  priority: Priority
  estimatedValue?: number | null
  notes?: string | null
  createdAt: string | Date
  _count?: { activities: number }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGES: { key: Stage; label: string; color: string; bg: string }[] = [
  { key: 'NOVO',        label: 'Novo',             color: '#6c757d', bg: '#f8f9fa' },
  { key: 'CONTATO',     label: 'Contato',          color: '#3c8dbc', bg: '#dce8f3' },
  { key: 'QUALIFICADO', label: 'Qualificado',      color: '#8e44ad', bg: '#f3e8ff' },
  { key: 'PROPOSTA',    label: 'Proposta',         color: '#f39c12', bg: '#fff3cd' },
  { key: 'NEGOCIACAO',  label: 'Negociação',       color: '#e67e22', bg: '#fde8cc' },
  { key: 'GANHO',       label: 'Ganho',            color: '#00a65a', bg: '#d4f4e2' },
  { key: 'PERDIDO',     label: 'Perdido',          color: '#dd4b39', bg: '#fde8e6' },
]

const TYPES: { key: ContactType; label: string }[] = [
  { key: 'LEAD',     label: 'Lead'     },
  { key: 'PROSPECT', label: 'Prospect' },
  { key: 'CLIENT',   label: 'Cliente'  },
  { key: 'PARTNER',  label: 'Parceiro' },
]

const SOURCES = [
  { value: 'SITE',        label: 'Site'        },
  { value: 'LINKEDIN',    label: 'LinkedIn'    },
  { value: 'INDICACAO',   label: 'Indicação'   },
  { value: 'EVENTO',      label: 'Evento'      },
  { value: 'WHATSAPP',    label: 'WhatsApp'    },
  { value: 'EMAIL',       label: 'E-mail'      },
  { value: 'TELEFONE',    label: 'Telefone'    },
  { value: 'OUTRO',       label: 'Outro'       },
]

const PRIORITIES: { key: Priority; label: string; color: string }[] = [
  { key: 'HIGH',   label: 'Alta',   color: '#dd4b39' },
  { key: 'NORMAL', label: 'Normal', color: '#3c8dbc' },
  { key: 'LOW',    label: 'Baixa',  color: '#6c757d' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stageStyle(stage: string) {
  const s = STAGES.find(x => x.key === stage)
  return s ? { color: s.color, background: s.bg, border: `1px solid ${s.color}33` } : {}
}

function stageLabel(stage: string) {
  return STAGES.find(x => x.key === stage)?.label ?? stage
}

function priorityStyle(priority: string) {
  const p = PRIORITIES.find(x => x.key === priority)
  return p ? { color: p.color, background: `${p.color}18`, border: `1px solid ${p.color}44` } : {}
}

function priorityLabel(priority: string) {
  return PRIORITIES.find(x => x.key === priority)?.label ?? priority
}

function typeLabel(type: string) {
  return TYPES.find(x => x.key === type)?.label ?? type
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

const AVATAR_COLORS = ['#3c8dbc', '#8e44ad', '#e67e22', '#00a65a', '#dd4b39', '#f39c12', '#1abc9c']

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// ─── Modal Form ───────────────────────────────────────────────────────────────

interface ModalProps {
  contact: Partial<Contact> | null
  onClose: () => void
  onSave: (fd: FormData) => void
  isPending: boolean
}

function ContactModal({ contact, onClose, onSave, isPending }: ModalProps) {
  const isEdit = !!contact?.id

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    onSave(fd)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d2d6de]">
          <h3 className="text-base font-bold text-[#333]">
            {isEdit ? 'Editar Contato' : 'Novo Contato'}
          </h3>
          <button onClick={onClose} className="text-[#999] hover:text-[#333]">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Row 1: name + company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#777] mb-1">Nome *</label>
              <input
                name="name"
                defaultValue={contact?.name ?? ''}
                required
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-xs text-[#777] mb-1">Empresa</label>
              <input
                name="company"
                defaultValue={contact?.company ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          {/* Row 2: email + phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#777] mb-1">E-mail</label>
              <input
                name="email"
                type="email"
                defaultValue={contact?.email ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs text-[#777] mb-1">Telefone / WhatsApp</label>
              <input
                name="phone"
                defaultValue={contact?.phone ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="(11) 99999-0000"
              />
            </div>
          </div>

          {/* Row 3: position + linkedinUrl */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#777] mb-1">Cargo</label>
              <input
                name="position"
                defaultValue={contact?.position ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="Ex: Diretor Operacional"
              />
            </div>
            <div>
              <label className="block text-xs text-[#777] mb-1">LinkedIn URL</label>
              <input
                name="linkedinUrl"
                defaultValue={contact?.linkedinUrl ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          {/* Row 4: source + type + stage + priority */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-[#777] mb-1">Origem</label>
              <select
                name="source"
                defaultValue={contact?.source ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
              >
                <option value="">Selecionar</option>
                {SOURCES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#777] mb-1">Tipo</label>
              <select
                name="type"
                defaultValue={contact?.type ?? 'LEAD'}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
              >
                {TYPES.map(t => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#777] mb-1">Estágio</label>
              <select
                name="stage"
                defaultValue={contact?.stage ?? 'NOVO'}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
              >
                {STAGES.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#777] mb-1">Prioridade</label>
              <select
                name="priority"
                defaultValue={contact?.priority ?? 'NORMAL'}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
              >
                {PRIORITIES.map(p => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: estimatedValue + tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#777] mb-1">Valor Estimado (R$)</label>
              <input
                name="estimatedValue"
                type="number"
                step="0.01"
                min="0"
                defaultValue={contact?.estimatedValue ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="block text-xs text-[#777] mb-1">Tags (separadas por vírgula)</label>
              <input
                name="tags"
                defaultValue={contact?.tags ?? ''}
                className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                placeholder="leilão, veículos, governo"
              />
            </div>
          </div>

          {/* Row 6: notes */}
          <div>
            <label className="block text-xs text-[#777] mb-1">Observações</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={contact?.notes ?? ''}
              className="w-full border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc] resize-none"
              placeholder="Notas internas sobre este contato..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#555] border border-[#d2d6de] rounded hover:bg-[#f4f4f4]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-sm font-bold text-white bg-[#3c8dbc] rounded hover:bg-[#367fa9] disabled:opacity-60"
            >
              {isPending ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar Contato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CrmContactsClient({ initialContacts }: { initialContacts: any[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [contacts, setContacts] = useState<Contact[]>(initialContacts as Contact[])
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [modalContact, setModalContact] = useState<Partial<Contact> | null>(null)
  const [showModal, setShowModal] = useState(false)

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return contacts.filter(c => {
      if (stageFilter && c.stage !== stageFilter) return false
      if (typeFilter && c.type !== typeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          (c.email ?? '').toLowerCase().includes(q) ||
          (c.phone ?? '').toLowerCase().includes(q) ||
          (c.company ?? '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [contacts, search, stageFilter, typeFilter])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openCreate() {
    setModalContact({ stage: 'NOVO', priority: 'NORMAL', type: 'LEAD' })
    setShowModal(true)
  }

  function openEdit(c: Contact) {
    setModalContact(c)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setModalContact(null)
  }

  function handleSave(fd: FormData) {
    if (modalContact?.id) {
      const id = modalContact.id
      startTransition(async () => {
        await updateCrmContact(id, fd)
        router.refresh()
        closeModal()
      })
    } else {
      startTransition(async () => {
        await createCrmContact(fd)
        router.refresh()
        closeModal()
      })
    }
  }

  function handleDelete(id: string) {
    if (!confirm('Excluir este contato? Esta ação não pode ser desfeita.')) return
    // Optimistic remove
    setContacts(prev => prev.filter(c => c.id !== id))
    startTransition(async () => {
      await deleteCrmContact(id)
      router.refresh()
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[#333]">
          <Users className="h-[22px] w-[22px] text-[#3c8dbc]" />
          <h1 className="text-[24px] font-normal m-0">CRM — Contatos</h1>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/admin/crm" className="flex items-center gap-1 text-[#3c8dbc] hover:underline">
            <Kanban size={13} /> Pipeline
          </Link>
          <Link href="/admin/crm/activities" className="flex items-center gap-1 text-[#3c8dbc] hover:underline">
            <Activity size={13} /> Atividades
          </Link>
          <Link href="/admin/crm/linkedin" className="flex items-center gap-1 text-[#3c8dbc] hover:underline">
            <Linkedin size={13} /> LinkedIn Hunter
          </Link>
          <span className="text-[#aaa]">Home &gt; CRM &gt; Contatos</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-1.5 border border-[#d2d6de] rounded px-2 py-1.5 flex-1 min-w-[180px]">
          <Search size={14} className="text-[#999] flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, email, telefone, empresa..."
            className="text-sm outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#bbb] hover:text-[#777]">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Stage filter */}
        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
          className="border border-[#d2d6de] rounded px-3 py-1.5 text-sm text-[#555] focus:outline-none focus:border-[#3c8dbc]"
        >
          <option value="">Todos os estágios</option>
          {STAGES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border border-[#d2d6de] rounded px-3 py-1.5 text-sm text-[#555] focus:outline-none focus:border-[#3c8dbc]"
        >
          <option value="">Todos os tipos</option>
          {TYPES.map(t => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>

        <span className="text-xs text-[#999] ml-auto">
          {filtered.length} de {contacts.length} contatos
        </span>

        {/* New button */}
        <button
          onClick={openCreate}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#3c8dbc] rounded hover:bg-[#367fa9] disabled:opacity-60"
        >
          <Plus size={15} />
          Novo Contato
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#d2d6de]">
                <th className="text-left px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Empresa</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Contato</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Estágio</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Prioridade</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Valor Est.</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Atividades</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-[#555] uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#bbb]">
                    <UserCheck size={32} className="mx-auto mb-2 opacity-40" />
                    <div>Nenhum contato encontrado</div>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#f4f4f4] hover:bg-[#f9f9f9] transition-colors"
                  >
                    {/* Nome + initials avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none"
                          style={{ background: avatarColor(c.name) }}
                        >
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#333]">{c.name}</div>
                          {c.position && (
                            <div className="text-[11px] text-[#999]">{c.position}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Empresa */}
                    <td className="px-4 py-3">
                      {c.company ? (
                        <div className="flex items-center gap-1 text-[#555]">
                          <Building size={12} className="text-[#aaa] flex-shrink-0" />
                          <span>{c.company}</span>
                        </div>
                      ) : (
                        <span className="text-[#ccc]">—</span>
                      )}
                    </td>

                    {/* Contato: email + phone + linkedin */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {c.email && (
                          <div className="flex items-center gap-1 text-[11px] text-[#555]">
                            <Mail size={11} className="text-[#aaa]" />
                            <a href={`mailto:${c.email}`} className="hover:text-[#3c8dbc] hover:underline truncate max-w-[160px]">
                              {c.email}
                            </a>
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-[#555]">
                            <Phone size={11} className="text-[#aaa]" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.linkedinUrl && (
                          <div className="flex items-center gap-1 text-[11px]">
                            <Linkedin size={11} className="text-[#0077b5]" />
                            <a href={c.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#0077b5] hover:underline">
                              LinkedIn
                            </a>
                          </div>
                        )}
                        {!c.email && !c.phone && !c.linkedinUrl && (
                          <span className="text-[#ccc] text-[11px]">—</span>
                        )}
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#555]">{typeLabel(c.type)}</span>
                    </td>

                    {/* Estágio badge */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={stageStyle(c.stage)}
                      >
                        {stageLabel(c.stage)}
                      </span>
                    </td>

                    {/* Prioridade badge */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={priorityStyle(c.priority)}
                      >
                        {priorityLabel(c.priority)}
                      </span>
                    </td>

                    {/* Valor estimado */}
                    <td className="px-4 py-3 text-right">
                      {c.estimatedValue ? (
                        <span className="text-sm font-semibold text-[#00a65a]">
                          {c.estimatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      ) : (
                        <span className="text-[#ccc]">—</span>
                      )}
                    </td>

                    {/* Atividades count */}
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/crm/activities?contactId=${c.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#3c8dbc] hover:underline"
                      >
                        <Activity size={12} />
                        {c._count?.activities ?? 0}
                      </Link>
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          title="Editar contato"
                          className="p-1.5 text-[#3c8dbc] hover:text-[#367fa9] hover:bg-[#dce8f3] rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          title="Excluir contato"
                          className="p-1.5 text-[#dd4b39] hover:text-[#c0392b] hover:bg-[#fde8e6] rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ContactModal
          contact={modalContact}
          onClose={closeModal}
          onSave={handleSave}
          isPending={isPending}
        />
      )}
    </div>
  )
}
