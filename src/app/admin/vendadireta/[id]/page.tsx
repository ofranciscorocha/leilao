'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from 'next/link'
import {
  getVendaDireta,
  updateVendaDireta,
  updateVendaDiretaStatus,
  publishToSelect,
  unpublishFromSelect,
} from "@/app/actions/vendadireta"
import {
  ArrowLeft,
  Car,
  Tag,
  Globe,
  GlobeLock,
  Save,
  CheckCircle,
  Clock,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react"

const STATUSES = ['EM_PREPARACAO', 'DISPONIVEL', 'RESERVADO', 'VENDIDO', 'RETIRADO']
const STATUS_LABELS: Record<string, string> = {
  EM_PREPARACAO: 'Em Preparação',
  DISPONIVEL: 'Disponível',
  RESERVADO: 'Reservado',
  VENDIDO: 'Vendido',
  RETIRADO: 'Retirado',
}

function fmt(val: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  )
}

function Input({ name, defaultValue, type = 'text', placeholder }: any) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  )
}

function Select({ name, defaultValue, children }: any) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ''}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    >
      {children}
    </select>
  )
}

export default function VendaDiretaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [venda, setVenda] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pubLoading, setPubLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadVenda()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function loadVenda() {
    setLoading(true)
    try {
      const data = await getVendaDireta(id)
      setVenda(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const fd = new FormData(e.currentTarget)
      await updateVendaDireta(id, fd)
      setMessage({ type: 'success', text: 'Salvo com sucesso!' })
      await loadVenda()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(status: string) {
    setStatusLoading(true)
    try {
      await updateVendaDiretaStatus(id, status)
      await loadVenda()
    } finally {
      setStatusLoading(false)
    }
  }

  async function handlePublish() {
    setPubLoading(true)
    try {
      await publishToSelect(id)
      await loadVenda()
    } finally {
      setPubLoading(false)
    }
  }

  async function handleUnpublish() {
    setPubLoading(true)
    try {
      await unpublishFromSelect(id)
      await loadVenda()
    } finally {
      setPubLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center py-32 text-gray-400">
        <RefreshCw className="animate-spin mr-2" size={20} />
        Carregando...
      </div>
    )
  }

  if (!venda) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle size={18} />
          Veículo não encontrado.
        </div>
        <Link href="/admin/vendadireta" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline text-sm">
          <ArrowLeft size={14} /> Voltar
        </Link>
      </div>
    )
  }

  const currentStatusIdx = STATUSES.indexOf(venda.status)

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vendadireta"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Car size={22} className="text-blue-600" />
            {venda.title}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {venda.plate && <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs font-bold mr-2">{venda.plate}</span>}
            {venda.year} · ID: {venda.id.slice(0, 8)}...
          </p>
        </div>
        {/* Publish Toggle */}
        <button
          onClick={venda.publishedToSelect ? handleUnpublish : handlePublish}
          disabled={pubLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            venda.publishedToSelect
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white'
          }`}
        >
          {pubLoading ? <RefreshCw size={14} className="animate-spin" /> : venda.publishedToSelect ? <Globe size={14} /> : <GlobeLock size={14} />}
          {venda.publishedToSelect ? 'Publicado no Rocha Select' : 'Publicar no Rocha Select'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Status Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
          <Clock size={14} />
          Status do Veículo
        </h2>
        <div className="flex items-center gap-0">
          {STATUSES.map((s, idx) => (
            <div key={s} className="flex items-center flex-1">
              <button
                onClick={() => handleStatusChange(s)}
                disabled={statusLoading}
                className={`flex-1 text-center py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  venda.status === s
                    ? 'bg-blue-600 text-white shadow'
                    : idx < currentStatusIdx
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
              {idx < STATUSES.length - 1 && (
                <div className={`h-0.5 w-4 ${idx < currentStatusIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Vehicle Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Car size={14} />
                Dados do Veículo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Título">
                  <Input name="title" defaultValue={venda.title} />
                </Field>
                <Field label="Placa">
                  <Input name="plate" defaultValue={venda.plate} placeholder="ABC-1234" />
                </Field>
                <Field label="Fabricante">
                  <Input name="manufacturer" defaultValue={venda.manufacturer} placeholder="Toyota" />
                </Field>
                <Field label="Modelo">
                  <Input name="model" defaultValue={venda.model} placeholder="Corolla" />
                </Field>
                <Field label="Ano">
                  <Input name="year" defaultValue={venda.year} placeholder="2020" />
                </Field>
                <Field label="Cor">
                  <Input name="color" defaultValue={venda.color} placeholder="Prata" />
                </Field>
                <Field label="Combustível">
                  <Select name="fuel" defaultValue={venda.fuel}>
                    <option value="">Selecionar</option>
                    <option value="GASOLINA">Gasolina</option>
                    <option value="ETANOL">Etanol</option>
                    <option value="FLEX">Flex</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELETRICO">Elétrico</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="GNV">GNV</option>
                  </Select>
                </Field>
                <Field label="KM">
                  <Input name="mileage" type="number" defaultValue={venda.mileage} placeholder="0" />
                </Field>
                <Field label="Chassi">
                  <Input name="chassis" defaultValue={venda.chassis} />
                </Field>
                <Field label="Renavam">
                  <Input name="renavam" defaultValue={venda.renavam} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Local / Pátio">
                    <Input name="location" defaultValue={venda.location} placeholder="Setor A, Vaga 12" />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Foto Principal (URL)">
                    <Input name="mainImage" defaultValue={venda.mainImage} placeholder="https://..." />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Descrição">
                    <textarea
                      name="description"
                      defaultValue={venda.description ?? ''}
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Condition */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Condição & Itens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Condição Geral">
                  <Select name="condition" defaultValue={venda.condition}>
                    <option value="">Selecionar</option>
                    <option value="EXCELENTE">Excelente</option>
                    <option value="BOM">Bom</option>
                    <option value="REGULAR">Regular</option>
                    <option value="SUCATA">Sucata</option>
                  </Select>
                </Field>
                <Field label="Com Chave?">
                  <Select name="hasKeys" defaultValue={String(venda.hasKeys)}>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </Select>
                </Field>
                <Field label="Com Manual?">
                  <Select name="hasManual" defaultValue={String(venda.hasManual)}>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </Select>
                </Field>
                <Field label="Chave Reserva?">
                  <Select name="hasSpareKey" defaultValue={String(venda.hasSpareKey)}>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </Select>
                </Field>
              </div>
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <FileText size={14} />
                Documentação
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Status do Documento">
                  <Select name="documentStatus" defaultValue={venda.documentStatus}>
                    <option value="">Selecionar</option>
                    <option value="COMPLETO">Completo</option>
                    <option value="PENDENTE">Pendente</option>
                    <option value="SINISTRADO">Sinistrado</option>
                    <option value="RECUPERADO">Recuperado</option>
                  </Select>
                </Field>
                <Field label="IPVA">
                  <Select name="ipvaStatus" defaultValue={venda.ipvaStatus}>
                    <option value="">Selecionar</option>
                    <option value="QUITADO">Quitado</option>
                    <option value="PENDENTE">Pendente</option>
                    <option value="ISENTO">Isento</option>
                  </Select>
                </Field>
                <Field label="Multas">
                  <Select name="multasStatus" defaultValue={venda.multasStatus}>
                    <option value="">Selecionar</option>
                    <option value="SEM_MULTAS">Sem Multas</option>
                    <option value="COM_MULTAS">Com Multas</option>
                  </Select>
                </Field>
                <Field label="Débitos">
                  <Select name="debitoStatus" defaultValue={venda.debitoStatus}>
                    <option value="">Selecionar</option>
                    <option value="QUITADO">Quitado</option>
                    <option value="COM_DEBITO">Com Débito</option>
                  </Select>
                </Field>
              </div>
            </div>

            {/* Images Gallery (display only) */}
            {venda.images && venda.images.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <ImageIcon size={14} />
                  Galeria de Imagens ({venda.images.length})
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {venda.images.map((img: any) => (
                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Pricing & Notes */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Tag size={14} />
                Precificação
              </h2>
              <div className="space-y-4">
                <Field label="Preço Mínimo (R$)">
                  <Input name="minimumPrice" type="number" defaultValue={venda.minimumPrice} placeholder="0.00" />
                </Field>
                <Field label="Preço Sugerido (R$)">
                  <Input name="suggestedPrice" type="number" defaultValue={venda.suggestedPrice} placeholder="0.00" />
                </Field>
                <Field label="Comissão Pátio (%)">
                  <Input name="commission" type="number" defaultValue={venda.commission} placeholder="5.0" />
                </Field>
              </div>
              {venda.minimumPrice > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-blue-600 font-semibold mb-1">Resumo Financeiro</div>
                  <div className="text-sm text-blue-900">
                    Mínimo: <span className="font-bold">{fmt(venda.minimumPrice)}</span>
                  </div>
                  {venda.commission > 0 && (
                    <div className="text-sm text-blue-900">
                      Comissão: <span className="font-bold">{fmt(venda.minimumPrice * (venda.commission / 100))}</span>
                    </div>
                  )}
                  {venda.soldPrice && (
                    <div className="text-sm text-green-700 font-bold">
                      Vendido por: {fmt(venda.soldPrice)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comitente */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Comitente</h2>
              <Field label="Nome do Comitente">
                <Input name="comitenteNome" defaultValue={venda.comitenteNome} placeholder="Nome do comitente" />
              </Field>
            </div>

            {/* Lot Link */}
            {venda.lot && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-amber-700 mb-2">Vinculado ao Lote</div>
                <div className="text-sm font-bold text-amber-900">#{venda.lot.lotNumber} — {venda.lot.title}</div>
                <Link
                  href={`/admin/lots/${venda.lot.id}`}
                  className="text-xs text-amber-600 hover:underline mt-1 inline-block"
                >
                  Ver lote na logística →
                </Link>
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Observações</h2>
              <div className="space-y-3">
                <Field label="Observações (visível ao comprador)">
                  <textarea
                    name="observations"
                    defaultValue={venda.observations ?? ''}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                  />
                </Field>
                <Field label="Notas Internas">
                  <textarea
                    name="internalNotes"
                    defaultValue={venda.internalNotes ?? ''}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                  />
                </Field>
              </div>
            </div>

            {/* Buyer Info (when sold) */}
            {venda.status === 'VENDIDO' && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Dados da Venda</h2>
                <div className="space-y-3">
                  <Field label="Nome do Comprador">
                    <Input name="buyerName" defaultValue={venda.buyerName} />
                  </Field>
                  <Field label="Contato do Comprador">
                    <Input name="buyerContact" defaultValue={venda.buyerContact} />
                  </Field>
                  <Field label="Preço de Venda (R$)">
                    <Input name="soldPrice" type="number" defaultValue={venda.soldPrice} />
                  </Field>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
              <div>Criado: {new Date(venda.createdAt).toLocaleString('pt-BR')}</div>
              <div>Atualizado: {new Date(venda.updatedAt).toLocaleString('pt-BR')}</div>
              {venda.publishedAt && (
                <div className="text-green-600">Publicado: {new Date(venda.publishedAt).toLocaleString('pt-BR')}</div>
              )}
              {venda.soldAt && (
                <div className="text-blue-600">Vendido em: {new Date(venda.soldAt).toLocaleString('pt-BR')}</div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/vendadireta"
            className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
