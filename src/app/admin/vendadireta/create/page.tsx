'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from 'next/link'
import { createVendaDireta, sendLotToVendaDireta } from "@/app/actions/vendadireta"
import {
  ArrowLeft,
  Car,
  Search,
  Plus,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Truck,
} from "lucide-react"

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ name, defaultValue, type = 'text', placeholder, required }: any) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      required={required}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  )
}

function Select({ name, defaultValue, children, required }: any) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? ''}
      required={required}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    >
      {children}
    </select>
  )
}

export default function CreateVendaDiretaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lotSearch, setLotSearch] = useState('')
  const [lotLoading, setLotLoading] = useState(false)
  const [lotFound, setLotFound] = useState<any>(null)
  const [lotError, setLotError] = useState<string | null>(null)
  const [mode, setMode] = useState<'search' | 'manual'>('search')

  async function searchLot() {
    if (!lotSearch.trim()) return
    setLotLoading(true)
    setLotError(null)
    setLotFound(null)
    try {
      const res = await fetch(`/api/lots/search?q=${encodeURIComponent(lotSearch)}`)
      if (!res.ok) throw new Error('Erro ao buscar lote')
      const data = await res.json()
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setLotError('Nenhum lote encontrado com essa placa/número.')
      } else {
        const lot = Array.isArray(data) ? data[0] : data
        setLotFound(lot)
      }
    } catch (err: any) {
      setLotError('Erro ao buscar no servidor. Preencha manualmente.')
    } finally {
      setLotLoading(false)
    }
  }

  async function handleImportLot() {
    if (!lotFound) return
    setLotLoading(true)
    try {
      const venda = await sendLotToVendaDireta(lotFound.id)
      router.push(`/admin/vendadireta/${venda.id}`)
    } catch (err: any) {
      setLotError(err.message || 'Erro ao importar lote')
    } finally {
      setLotLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData(e.currentTarget)
      const venda = await createVendaDireta(fd)
      router.push(`/admin/vendadireta/${venda.id}`)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar veículo')
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vendadireta"
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Plus size={22} className="text-blue-600" />
            Novo Veículo para Venda Direta
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Importe da logística ou cadastre manualmente
          </p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setMode('search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            mode === 'search' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          }`}
        >
          <Truck size={16} />
          Importar da Logística
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            mode === 'manual' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          }`}
        >
          <Car size={16} />
          Cadastro Manual
        </button>
      </div>

      {/* Import from Logistics */}
      {mode === 'search' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search size={16} className="text-blue-600" />
            Buscar Lote na Logística
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Digite a placa ou número do lote (ex: ABC1234, 42)"
              value={lotSearch}
              onChange={e => setLotSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), searchLot())}
            />
            <button
              type="button"
              onClick={searchLot}
              disabled={lotLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {lotLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
              Buscar
            </button>
          </div>

          {lotError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle size={14} />
              {lotError}
            </div>
          )}

          {lotFound && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                    <CheckCircle size={16} />
                    Lote encontrado
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    #{lotFound.lotNumber} — {lotFound.title}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                    {lotFound.plate && <div>Placa: <span className="font-mono font-bold">{lotFound.plate}</span></div>}
                    {lotFound.manufacturer && <div>Veículo: {lotFound.manufacturer} {lotFound.model} {lotFound.year}</div>}
                    <div>Status atual: <span className="font-semibold">{lotFound.status}</span></div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleImportLot}
                  disabled={lotLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {lotLoading ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  Importar para Venda Direta
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode('manual')}
              className="text-sm text-gray-500 hover:text-blue-600 underline"
            >
              Prefiro cadastrar manualmente sem lote
            </button>
          </div>
        </div>
      )}

      {/* Manual Form */}
      {mode === 'manual' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Vehicle Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Car size={14} />
              Dados do Veículo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Field label="Título" required>
                  <Input name="title" placeholder="Ex: Toyota Corolla XEi 2.0" required />
                </Field>
              </div>
              <Field label="Fabricante">
                <Input name="manufacturer" placeholder="Toyota" />
              </Field>
              <Field label="Modelo">
                <Input name="model" placeholder="Corolla" />
              </Field>
              <Field label="Ano">
                <Input name="year" placeholder="2020" />
              </Field>
              <Field label="Placa">
                <Input name="plate" placeholder="ABC-1234" />
              </Field>
              <Field label="Cor">
                <Input name="color" placeholder="Prata" />
              </Field>
              <Field label="Combustível">
                <Select name="fuel">
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
                <Input name="mileage" type="number" placeholder="0" />
              </Field>
              <Field label="Chassi">
                <Input name="chassis" />
              </Field>
              <Field label="Renavam">
                <Input name="renavam" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Foto Principal (URL)">
                  <Input name="mainImage" placeholder="https://..." />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Descrição">
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                    placeholder="Descrição detalhada do veículo..."
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Condição</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Condição Geral">
                <Select name="condition">
                  <option value="">Selecionar</option>
                  <option value="EXCELENTE">Excelente</option>
                  <option value="BOM">Bom</option>
                  <option value="REGULAR">Regular</option>
                  <option value="SUCATA">Sucata</option>
                </Select>
              </Field>
              <Field label="Com Chave?">
                <Select name="hasKeys" defaultValue="false">
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </Select>
              </Field>
              <Field label="Documentação">
                <Select name="documentStatus">
                  <option value="">Selecionar</option>
                  <option value="COMPLETO">Completo</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="SINISTRADO">Sinistrado</option>
                  <option value="RECUPERADO">Recuperado</option>
                </Select>
              </Field>
              <Field label="IPVA">
                <Select name="ipvaStatus">
                  <option value="">Selecionar</option>
                  <option value="QUITADO">Quitado</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="ISENTO">Isento</option>
                </Select>
              </Field>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Precificação</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Preço Mínimo (R$)" required>
                <Input name="minimumPrice" type="number" placeholder="0.00" required />
              </Field>
              <Field label="Preço Sugerido (R$)">
                <Input name="suggestedPrice" type="number" placeholder="0.00" />
              </Field>
              <Field label="Comissão Pátio (%)">
                <Input name="commission" type="number" defaultValue="5" placeholder="5.0" />
              </Field>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Notas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Comitente">
                <Input name="comitenteNome" placeholder="Nome do comitente" />
              </Field>
              <Field label="Local">
                <Input name="location" placeholder="Setor A, Vaga 12" />
              </Field>
              <Field label="Observações (público)">
                <textarea
                  name="observations"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                />
              </Field>
              <Field label="Notas Internas">
                <textarea
                  name="internalNotes"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                />
              </Field>
            </div>
          </div>

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
              {saving ? 'Criando...' : 'Criar Veículo'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
