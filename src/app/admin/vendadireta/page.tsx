'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  getVendasDiretas,
  updateVendaDiretaStatus,
  publishToSelect,
  unpublishFromSelect,
  deleteVendaDireta,
} from '@/app/actions/vendaDireta'
import {
  Tag,
  Plus,
  Search,
  Eye,
  Trash2,
  Globe,
  GlobeLock,
  ToggleLeft,
  TrendingUp,
  Car,
  CheckCircle,
  Clock,
  DollarSign,
  RefreshCw,
} from 'lucide-react'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  EM_PREPARACAO: { label: 'Em Preparação', color: 'bg-yellow-100 text-yellow-800' },
  DISPONIVEL: { label: 'Disponível', color: 'bg-green-100 text-green-800' },
  RESERVADO: { label: 'Reservado', color: 'bg-blue-100 text-blue-800' },
  VENDIDO: { label: 'Vendido', color: 'bg-gray-100 text-gray-800' },
  RETIRADO: { label: 'Retirado', color: 'bg-red-100 text-red-800' },
}

const CONDITION_LABELS: Record<string, string> = {
  EXCELENTE: 'Excelente',
  BOM: 'Bom',
  REGULAR: 'Regular',
  SUCATA: 'Sucata',
}

function fmt(val: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

export default function VendaDiretaPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getVendasDiretas(statusFilter || undefined)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const filtered = items.filter(v => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      v.plate?.toLowerCase().includes(q) ||
      v.manufacturer?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      v.title?.toLowerCase().includes(q)
    )
  })

  const stats = {
    emPreparacao: items.filter(i => i.status === 'EM_PREPARACAO').length,
    disponivel: items.filter(i => i.status === 'DISPONIVEL').length,
    reservado: items.filter(i => i.status === 'RESERVADO').length,
    vendido: items.filter(i => i.status === 'VENDIDO').length,
    faturado: items.filter(i => i.soldPrice).reduce((s, i) => s + (i.soldPrice || 0), 0),
  }

  async function handleStatusChange(id: string, status: string) {
    setActionLoading(id + '-status')
    try {
      await updateVendaDiretaStatus(id, status)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  async function handlePublish(id: string) {
    setActionLoading(id + '-pub')
    try {
      await publishToSelect(id)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  async function handleUnpublish(id: string) {
    setActionLoading(id + '-pub')
    try {
      await unpublishFromSelect(id)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(id: string) {
    setActionLoading(id + '-del')
    try {
      await deleteVendaDireta(id)
      setShowDeleteId(null)
      await load()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="text-blue-600" size={26} />
            Venda Direta
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Veículos disponíveis para venda direta via Rocha Select
          </p>
        </div>
        <Link
          href="/admin/vendadireta/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Novo Veículo
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <Clock size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Em Preparação</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.emPreparacao}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Disponível</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.disponivel}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Car size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Reservado</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.reservado}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Vendido</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.vendido}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <DollarSign size={16} />
            <span className="text-xs font-semibold uppercase tracking-wide">Faturado</span>
          </div>
          <div className="text-lg font-bold text-gray-900">{fmt(stats.faturado)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por placa, marca, modelo..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="EM_PREPARACAO">Em Preparação</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="RESERVADO">Reservado</option>
          <option value="VENDIDO">Vendido</option>
          <option value="RETIRADO">Retirado</option>
        </select>
        <button
          onClick={load}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 border border-gray-200 rounded-lg"
        >
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
            <p>Carregando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Car className="mx-auto mb-2 opacity-30" size={40} />
            <p className="font-medium">Nenhum veículo encontrado</p>
            <p className="text-sm mt-1">
              <Link href="/admin/vendadireta/create" className="text-blue-500 hover:underline">
                Adicionar primeiro veículo
              </Link>
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-16">Foto</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Veículo</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Placa</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Ano</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Condição</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Preço Mínimo</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Comissão</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Publicado</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const mainImg = item.mainImage || item.images?.[0]?.url
                  const statusInfo = STATUS_LABELS[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-800' }
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      {/* Foto */}
                      <td className="px-4 py-3">
                        {mainImg ? (
                          <img
                            src={mainImg}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <Car size={20} />
                          </div>
                        )}
                      </td>
                      {/* Veículo */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{item.title}</div>
                        {item.manufacturer && (
                          <div className="text-xs text-gray-500">{item.manufacturer} {item.model}</div>
                        )}
                      </td>
                      {/* Placa */}
                      <td className="px-4 py-3">
                        {item.plate ? (
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                            {item.plate}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      {/* Ano */}
                      <td className="px-4 py-3 text-gray-700">{item.year || '—'}</td>
                      {/* Condição */}
                      <td className="px-4 py-3">
                        {item.condition ? (
                          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {CONDITION_LABELS[item.condition] || item.condition}
                          </span>
                        ) : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      {/* Preço */}
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {fmt(item.minimumPrice)}
                      </td>
                      {/* Comissão */}
                      <td className="px-4 py-3 text-gray-700">{item.commission}%</td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <select
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer ${statusInfo.color}`}
                          value={item.status}
                          onChange={e => handleStatusChange(item.id, e.target.value)}
                          disabled={actionLoading === item.id + '-status'}
                        >
                          <option value="EM_PREPARACAO">Em Preparação</option>
                          <option value="DISPONIVEL">Disponível</option>
                          <option value="RESERVADO">Reservado</option>
                          <option value="VENDIDO">Vendido</option>
                          <option value="RETIRADO">Retirado</option>
                        </select>
                      </td>
                      {/* Publicado */}
                      <td className="px-4 py-3">
                        {item.publishedToSelect ? (
                          <button
                            onClick={() => handleUnpublish(item.id)}
                            disabled={actionLoading === item.id + '-pub'}
                            className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full hover:bg-green-100 transition-colors font-semibold"
                          >
                            <Globe size={12} />
                            Publicado
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(item.id)}
                            disabled={actionLoading === item.id + '-pub'}
                            className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors font-semibold"
                          >
                            <GlobeLock size={12} />
                            Publicar
                          </button>
                        )}
                      </td>
                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/vendadireta/${item.id}`}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Ver/Editar"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => setShowDeleteId(item.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja excluir este veículo da Venda Direta? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteId)}
                disabled={actionLoading === showDeleteId + '-del'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === showDeleteId + '-del' ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
