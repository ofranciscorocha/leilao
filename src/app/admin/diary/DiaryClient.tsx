'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
    NotebookPen, Plus, ChevronLeft, ChevronRight, Calendar,
    Clock, Flag, Tag, CheckCircle2, Circle, X, Edit2, Trash2,
    Bell, Repeat, List, LayoutGrid, AlertTriangle, Target,
    Coffee, Users as UsersIcon, Phone as PhoneIcon, Search
} from 'lucide-react'
import {
    createDiaryEvent,
    updateDiaryEvent,
    toggleDiaryEvent,
    deleteDiaryEvent,
} from '@/app/actions/diary'

// --- Types ---
type Priority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW'
type EventType = 'TASK' | 'EVENT' | 'MEETING' | 'DEADLINE' | 'REMINDER'

export interface DiaryEvent {
    id: string
    title: string
    description?: string
    startDate: string
    endDate?: string
    allDay: boolean
    color: string
    priority: Priority
    label?: string
    type: EventType
    completed: boolean
    recurrence?: string
}

// --- Constants ---
const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
    URGENT: { label: 'Urgente', color: 'text-red-600', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
    HIGH: { label: 'Alta', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
    NORMAL: { label: 'Normal', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
    LOW: { label: 'Baixa', color: 'text-green-600', bg: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
}

const TYPE_CONFIG: Record<EventType, { label: string; icon: any; color: string }> = {
    TASK: { label: 'Tarefa', icon: CheckCircle2, color: '#3c8dbc' },
    EVENT: { label: 'Evento', icon: Calendar, color: '#8e44ad' },
    MEETING: { label: 'Reunião', icon: UsersIcon, color: '#27ae60' },
    DEADLINE: { label: 'Prazo', icon: AlertTriangle, color: '#e74c3c' },
    REMINDER: { label: 'Lembrete', icon: Bell, color: '#f39c12' },
}

const COLORS = [
    '#3c8dbc', '#e74c3c', '#27ae60', '#f39c12', '#8e44ad',
    '#16a085', '#d35400', '#2c3e50', '#c0392b', '#1abc9c'
]

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

// --- Helpers ---
function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay()
}
function toDateStr(date: Date) {
    return date.toISOString().split('T')[0]
}
function formatTime(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(dateStr: string) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Normalize a date value (Date object or ISO string) to 'YYYY-MM-DDTHH:mm' */
function normalizeDate(value: any): string {
    if (!value) return ''
    return new Date(value).toISOString().slice(0, 16)
}

/** Normalize raw events coming from the server (Date objects serialized as ISO strings) */
function normalizeEvents(raw: any[]): DiaryEvent[] {
    return raw.map(e => ({
        ...e,
        startDate: normalizeDate(e.startDate),
        endDate: e.endDate ? normalizeDate(e.endDate) : undefined,
        description: e.description ?? undefined,
        label: e.label ?? undefined,
        recurrence: e.recurrence ?? undefined,
    }))
}

// --- EventModal ---
function EventModal({ event, onSave, onClose, defaultDate }: {
    event?: DiaryEvent | null;
    onSave: (e: Omit<DiaryEvent, 'id'> & { id?: string }) => void;
    onClose: () => void;
    defaultDate?: string;
}) {
    const [form, setForm] = useState<Partial<DiaryEvent>>({
        title: '',
        description: '',
        startDate: defaultDate ? `${defaultDate}T09:00` : new Date().toISOString().slice(0, 16),
        endDate: defaultDate ? `${defaultDate}T10:00` : new Date().toISOString().slice(0, 16),
        allDay: false,
        color: '#3c8dbc',
        priority: 'NORMAL',
        label: '',
        type: 'TASK',
        completed: false,
        recurrence: 'NONE',
        ...event
    })

    const set = (k: keyof DiaryEvent, v: any) => setForm(p => ({ ...p, [k]: v }))

    const handleSave = () => {
        if (!form.title?.trim()) return
        onSave({
            id: event?.id,
            title: form.title!,
            description: form.description,
            startDate: form.startDate!,
            endDate: form.endDate,
            allDay: form.allDay!,
            color: form.color!,
            priority: form.priority as Priority,
            label: form.label,
            type: form.type as EventType,
            completed: form.completed!,
            recurrence: form.recurrence,
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b" style={{ borderLeftColor: form.color, borderLeftWidth: 4 }}>
                    <h2 className="text-lg font-bold text-[#333]">{event ? 'Editar Evento' : 'Novo Evento'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Título *</label>
                        <input
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                            placeholder="Título do evento..."
                            autoFocus
                        />
                    </div>

                    {/* Type & Priority */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Tipo</label>
                            <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]">
                                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Prioridade</label>
                            <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]">
                                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                                    <option key={k} value={k}>{v.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date/Time */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-[#555] uppercase">Data & Horário</label>
                            <label className="flex items-center gap-2 text-xs text-[#555] cursor-pointer">
                                <input type="checkbox" checked={form.allDay} onChange={e => set('allDay', e.target.checked)} className="rounded" />
                                Dia Inteiro
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-[#777] uppercase">Início</label>
                                <input
                                    type={form.allDay ? 'date' : 'datetime-local'}
                                    value={form.allDay ? form.startDate?.split('T')[0] : form.startDate}
                                    onChange={e => set('startDate', e.target.value)}
                                    className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-[#777] uppercase">Fim</label>
                                <input
                                    type={form.allDay ? 'date' : 'datetime-local'}
                                    value={form.allDay ? form.endDate?.split('T')[0] : form.endDate}
                                    onChange={e => set('endDate', e.target.value)}
                                    className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Observações</label>
                        <textarea
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            rows={3}
                            className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc] resize-none"
                            placeholder="Detalhes, anotações..."
                        />
                    </div>

                    {/* Label & Color */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Etiqueta</label>
                            <input
                                value={form.label}
                                onChange={e => set('label', e.target.value)}
                                className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]"
                                placeholder="Ex: urgente, leilão..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Cor</label>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => set('color', c)}
                                        className={`w-6 h-6 rounded-full border-2 transition-all ${form.color === c ? 'border-[#333] scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recurrence */}
                    <div>
                        <label className="text-xs font-bold text-[#555] uppercase">Recorrência</label>
                        <select value={form.recurrence} onChange={e => set('recurrence', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#3c8dbc]">
                            <option value="NONE">Não repete</option>
                            <option value="DAILY">Todos os dias</option>
                            <option value="WEEKLY">Toda semana</option>
                            <option value="MONTHLY">Todo mês</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t bg-[#f9f9f9]">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-[#777] hover:text-[#333] font-medium">Cancelar</button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 text-sm font-bold text-white rounded transition-colors"
                        style={{ backgroundColor: form.color }}
                    >
                        {event ? 'Salvar Alterações' : 'Criar Evento'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- EventCard ---
function EventCard({ ev, onToggle, onEdit, onDelete }: {
    ev: DiaryEvent;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const p = PRIORITY_CONFIG[ev.priority]
    const t = TYPE_CONFIG[ev.type]
    return (
        <div
            className={`group flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${ev.completed ? 'opacity-60' : ''}`}
            style={{ borderLeftColor: ev.color, borderLeftWidth: 3, backgroundColor: '#fff' }}
        >
            <button onClick={onToggle} className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-green-500 transition-colors">
                {ev.completed ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} />}
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${ev.completed ? 'line-through text-gray-400' : 'text-[#333]'}`}>
                        {ev.title}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${p.bg} ${p.color}`}>
                        {p.label}
                    </span>
                    {ev.label && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full border border-gray-200">
                            {ev.label}
                        </span>
                    )}
                </div>
                {ev.description && (
                    <p className="text-xs text-[#777] mt-1 line-clamp-2">{ev.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#999]">
                    <span className="flex items-center gap-1">
                        <t.icon size={11} style={{ color: t.color }} />
                        {t.label}
                    </span>
                    {!ev.allDay && (
                        <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {formatTime(ev.startDate)}
                            {ev.endDate && ` → ${formatTime(ev.endDate)}`}
                        </span>
                    )}
                    {ev.recurrence && ev.recurrence !== 'NONE' && (
                        <span className="flex items-center gap-1">
                            <Repeat size={11} />
                            Repete
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={onEdit} className="p-1 text-blue-400 hover:text-blue-600"><Edit2 size={14} /></button>
                <button onClick={onDelete} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
        </div>
    )
}

// --- StatWidget ---
function StatWidget({ label, value, sub, color, icon }: any) {
    return (
        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <div>
                    <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                    <div className="text-xs font-bold text-[#555] mt-0.5">{label}</div>
                    <div className="text-[10px] text-[#aaa]">{sub}</div>
                </div>
                <div style={{ color, opacity: 0.25 }}>{icon}</div>
            </div>
        </div>
    )
}

// --- Main Client Component ---
export default function DiaryClient({ initialEvents }: { initialEvents: any[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const today = new Date()
    const [currentDate, setCurrentDate] = useState(today)
    const [selectedDate, setSelectedDate] = useState(toDateStr(today))
    const [events, setEvents] = useState<DiaryEvent[]>(() => normalizeEvents(initialEvents))
    const [showModal, setShowModal] = useState(false)
    const [editEvent, setEditEvent] = useState<DiaryEvent | null>(null)
    const [search, setSearch] = useState('')
    const [filterPriority, setFilterPriority] = useState<string>('ALL')
    const [filterType, setFilterType] = useState<string>('ALL')

    const saveEvent = (ev: Omit<DiaryEvent, 'id'> & { id?: string }) => {
        setShowModal(false)
        setEditEvent(null)

        if (ev.id) {
            // Update optimistically
            setEvents(prev => prev.map(e => e.id === ev.id ? (ev as DiaryEvent) : e))
            startTransition(async () => {
                await updateDiaryEvent(ev.id!, {
                    title: ev.title,
                    description: ev.description,
                    startDate: ev.startDate + 'Z',
                    endDate: ev.endDate ? ev.endDate + 'Z' : undefined,
                    allDay: ev.allDay,
                    color: ev.color,
                    priority: ev.priority,
                    label: ev.label,
                    type: ev.type,
                    recurrence: ev.recurrence,
                    completed: ev.completed,
                })
                router.refresh()
            })
        } else {
            // Create optimistically with a temp id
            const tempId = crypto.randomUUID()
            const newEvent: DiaryEvent = { ...ev, id: tempId } as DiaryEvent
            setEvents(prev => [...prev, newEvent])
            startTransition(async () => {
                await createDiaryEvent({
                    title: ev.title,
                    description: ev.description,
                    startDate: ev.startDate + 'Z',
                    endDate: ev.endDate ? ev.endDate + 'Z' : undefined,
                    allDay: ev.allDay,
                    color: ev.color,
                    priority: ev.priority,
                    label: ev.label,
                    type: ev.type,
                    recurrence: ev.recurrence,
                })
                router.refresh()
            })
        }
    }

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id))
        startTransition(async () => {
            await deleteDiaryEvent(id)
            router.refresh()
        })
    }

    const toggleEvent = (id: string) => {
        const target = events.find(e => e.id === id)
        if (!target) return
        const newCompleted = !target.completed
        setEvents(prev => prev.map(e => e.id === id ? { ...e, completed: newCompleted } : e))
        startTransition(async () => {
            await toggleDiaryEvent(id, newCompleted)
            router.refresh()
        })
    }

    const openEdit = (ev: DiaryEvent) => {
        setEditEvent(ev)
        setShowModal(true)
    }

    // Calendar grid
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const prevMonthDays = getDaysInMonth(year, month - 1)

    const calendarCells: { date: string; day: number; currentMonth: boolean }[] = []
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = prevMonthDays - i
        const dt = new Date(year, month - 1, d)
        calendarCells.push({ date: toDateStr(dt), day: d, currentMonth: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d)
        calendarCells.push({ date: toDateStr(dt), day: d, currentMonth: true })
    }
    const remaining = 42 - calendarCells.length
    for (let d = 1; d <= remaining; d++) {
        const dt = new Date(year, month + 1, d)
        calendarCells.push({ date: toDateStr(dt), day: d, currentMonth: false })
    }

    const getEventsForDate = (date: string) =>
        events.filter(e => e.startDate.startsWith(date))

    const selectedEvents = getEventsForDate(selectedDate)

    // Stats
    const todayStr = toDateStr(today)
    const todayEvents = getEventsForDate(todayStr)
    const pendingTasks = events.filter(e => !e.completed && e.type === 'TASK').length
    const urgentEvents = events.filter(e => e.priority === 'URGENT' && !e.completed).length
    const upcomingDeadlines = events.filter(e => {
        const d = new Date(e.startDate)
        const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        return diff >= 0 && diff <= 7 && e.type === 'DEADLINE' && !e.completed
    }).length

    // Filtered events for list view
    const filteredEvents = events.filter(e => {
        if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false
        if (filterPriority !== 'ALL' && e.priority !== filterPriority) return false
        if (filterType !== 'ALL' && e.type !== filterType) return false
        return true
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <NotebookPen className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Diário & Agenda</h1>
                </div>
                <div className="text-[12px] text-[#777]">Home &gt; Diário</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatWidget label="Hoje" value={todayEvents.length} sub="eventos hoje" color="#3c8dbc" icon={<Calendar size={22} />} />
                <StatWidget label="Pendentes" value={pendingTasks} sub="tarefas abertas" color="#f39c12" icon={<Circle size={22} />} />
                <StatWidget label="Urgentes" value={urgentEvents} sub="prioridade urgente" color="#e74c3c" icon={<AlertTriangle size={22} />} />
                <StatWidget label="Prazos" value={upcomingDeadlines} sub="próximos 7 dias" color="#8e44ad" icon={<Target size={22} />} />
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Calendar */}
                <div className="lg:col-span-2 bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1.5 rounded hover:bg-[#f4f4f4] text-[#555]">
                                <ChevronLeft size={18} />
                            </button>
                            <h2 className="text-lg font-bold text-[#333]">
                                {MONTHS[month]} {year}
                            </h2>
                            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1.5 rounded hover:bg-[#f4f4f4] text-[#555]">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => { setCurrentDate(today); setSelectedDate(todayStr) }} className="px-3 py-1.5 text-xs font-bold text-[#3c8dbc] border border-[#3c8dbc] rounded hover:bg-[#3c8dbc] hover:text-white transition-colors">
                                Hoje
                            </button>
                            <button
                                onClick={() => { setShowModal(true); setEditEvent(null) }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#00a65a] rounded hover:bg-[#008d4c] transition-colors"
                            >
                                <Plus size={14} />
                                Novo
                            </button>
                        </div>
                    </div>

                    {/* Weekdays header */}
                    <div className="grid grid-cols-7 border-b border-[#f4f4f4]">
                        {WEEKDAYS.map(d => (
                            <div key={d} className="text-center py-2 text-[11px] font-bold text-[#777] uppercase">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7">
                        {calendarCells.map((cell, idx) => {
                            const cellEvents = getEventsForDate(cell.date)
                            const isToday = cell.date === todayStr
                            const isSelected = cell.date === selectedDate
                            const hasUrgent = cellEvents.some(e => e.priority === 'URGENT' && !e.completed)

                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedDate(cell.date)}
                                    className={`min-h-[80px] p-1.5 border-b border-r border-[#f4f4f4] cursor-pointer transition-all ${cell.currentMonth ? 'bg-white hover:bg-[#f9f9f9]' : 'bg-[#f9f9f9]'}
                                        ${isSelected ? 'ring-2 ring-inset ring-[#3c8dbc]' : ''}`}
                                >
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-colors
                                        ${isToday ? 'bg-[#3c8dbc] text-white' : cell.currentMonth ? 'text-[#333] hover:bg-[#eee]' : 'text-[#bbb]'}`}>
                                        {cell.day}
                                    </div>
                                    <div className="space-y-0.5">
                                        {cellEvents.slice(0, 3).map(ev => (
                                            <div
                                                key={ev.id}
                                                className={`text-[10px] px-1 py-0.5 rounded truncate font-medium text-white ${ev.completed ? 'opacity-50' : ''}`}
                                                style={{ backgroundColor: ev.color }}
                                                title={ev.title}
                                            >
                                                {ev.title}
                                            </div>
                                        ))}
                                        {cellEvents.length > 3 && (
                                            <div className="text-[9px] text-[#777] font-bold px-1">
                                                +{cellEvents.length - 3} mais
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right panel: selected day events */}
                <div className="space-y-4">
                    {/* Selected day */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-[#f4f4f4] flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold text-[#777] uppercase">
                                    {new Date(selectedDate + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                                </div>
                                <div className="text-lg font-bold text-[#333]">
                                    {new Date(selectedDate + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                </div>
                            </div>
                            <button
                                onClick={() => { setShowModal(true); setEditEvent(null) }}
                                className="p-2 text-[#00a65a] hover:bg-green-50 rounded transition-colors"
                                title="Adicionar evento neste dia"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                            {selectedEvents.length === 0 ? (
                                <div className="text-center py-6 text-[#aaa]">
                                    <Calendar size={28} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-xs">Nenhum evento neste dia</p>
                                    <button onClick={() => { setShowModal(true); setEditEvent(null) }} className="mt-2 text-xs text-[#3c8dbc] hover:underline">
                                        + Adicionar
                                    </button>
                                </div>
                            ) : (
                                selectedEvents.sort((a, b) => a.startDate.localeCompare(b.startDate)).map(ev => (
                                    <EventCard
                                        key={ev.id}
                                        ev={ev}
                                        onToggle={() => toggleEvent(ev.id)}
                                        onEdit={() => openEdit(ev)}
                                        onDelete={() => deleteEvent(ev.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Priority legend */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-4">
                        <h3 className="text-xs font-bold text-[#555] uppercase mb-3">Legenda de Prioridades</h3>
                        <div className="space-y-2">
                            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                                <div key={k} className="flex items-center gap-2 text-xs">
                                    <div className={`w-3 h-3 rounded-full ${v.dot}`} />
                                    <span className="text-[#555]">{v.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#f4f4f4]">
                            <h3 className="text-xs font-bold text-[#555] uppercase mb-3">Tipos</h3>
                            <div className="space-y-2">
                                {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                                    <div key={k} className="flex items-center gap-2 text-xs">
                                        <v.icon size={12} style={{ color: v.color }} />
                                        <span className="text-[#555]">{v.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-[#f4f4f4]">
                    <h3 className="text-[16px] font-normal text-[#333]">Todos os Eventos</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-[#f4f4f4] rounded px-2 py-1.5">
                            <Search size={14} className="text-[#999]" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar..."
                                className="bg-transparent text-sm outline-none w-32 text-[#333]"
                            />
                        </div>
                        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="text-xs border border-[#d2d6de] rounded px-2 py-1.5 text-[#555]">
                            <option value="ALL">Todas prioridades</option>
                            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-xs border border-[#d2d6de] rounded px-2 py-1.5 text-[#555]">
                            <option value="ALL">Todos os tipos</option>
                            {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-8 text-[#aaa]">
                            <NotebookPen size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum evento encontrado</p>
                        </div>
                    ) : (
                        filteredEvents.map(ev => (
                            <div key={ev.id}>
                                <div className="text-[10px] font-bold text-[#aaa] uppercase mb-1">
                                    {formatDate(ev.startDate)}
                                </div>
                                <EventCard
                                    ev={ev}
                                    onToggle={() => toggleEvent(ev.id)}
                                    onEdit={() => openEdit(ev)}
                                    onDelete={() => deleteEvent(ev.id)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <EventModal
                    event={editEvent}
                    defaultDate={selectedDate}
                    onSave={saveEvent}
                    onClose={() => { setShowModal(false); setEditEvent(null) }}
                />
            )}
        </div>
    )
}
