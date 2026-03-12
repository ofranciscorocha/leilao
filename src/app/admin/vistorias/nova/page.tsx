'use client'

import { useState, useRef } from "react"
import {
    ClipboardCheck, Upload, Brain, Camera, Car, Loader2,
    CheckCircle, AlertTriangle, Star, Gauge, Wrench, Eye,
    FileText, X, Plus, ArrowLeft, Zap
} from "lucide-react"
import Link from 'next/link'

interface PhotoSlot {
    id: string
    label: string
    required: boolean
    file?: File
    preview?: string
}

interface AIAnalysis {
    score: number
    condition: string
    summary: string
    details: {
        carroceria: { status: string; issues: string[] }
        motor: { status: string; issues: string[] }
        interior: { status: string; issues: string[] }
        pneus: { status: string; issues: string[] }
        vidros: { status: string; issues: string[] }
    }
    estimatedValue: string
    recommendation: string
    depreciation: number
    observations: string[]
}

const INITIAL_SLOTS: PhotoSlot[] = [
    { id: 'frente', label: 'Frente', required: true },
    { id: 'traseira', label: 'Traseira', required: true },
    { id: 'lateral_dir', label: 'Lateral Direita', required: true },
    { id: 'lateral_esq', label: 'Lateral Esquerda', required: true },
    { id: 'motor', label: 'Motor', required: true },
    { id: 'interior', label: 'Interior/Painel', required: true },
    { id: 'hodometro', label: 'Hodômetro', required: true },
    { id: 'roda_dd', label: 'Roda Dianteira Dir.', required: false },
    { id: 'roda_de', label: 'Roda Dianteira Esq.', required: false },
    { id: 'chassi', label: 'Nº Chassi', required: false },
    { id: 'placa', label: 'Placa', required: false },
    { id: 'porta_malas', label: 'Porta-Malas', required: false },
]

export default function NovaVistoriaPage() {
    const [slots, setSlots] = useState<PhotoSlot[]>(INITIAL_SLOTS)
    const [form, setForm] = useState({
        placa: '', chassi: '', renavam: '', marca: '', modelo: '', ano: '',
        cor: '', km: '', combustivel: '', fipeCodigo: '', fipeValor: '',
    })
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
    const [step, setStep] = useState<'form' | 'photos' | 'analysis'>('form')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [activeSlot, setActiveSlot] = useState<string | null>(null)

    const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

    const handleFileSelect = (slotId: string, file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            setSlots(p => p.map(s => s.id === slotId ? { ...s, file, preview: e.target?.result as string } : s))
        }
        reader.readAsDataURL(file)
    }

    const photoCount = slots.filter(s => s.file).length
    const requiredPhotos = slots.filter(s => s.required)
    const requiredDone = requiredPhotos.filter(s => s.file).length

    const runAIAnalysis = async () => {
        setLoading(true)
        // Simulated AI analysis (in production would call /api/ai/vistoria)
        await new Promise(r => setTimeout(r, 3000))

        const mockAnalysis: AIAnalysis = {
            score: 62,
            condition: 'Regular',
            summary: `Veículo ${form.marca} ${form.modelo} ${form.ano} com ${form.km}km apresenta condição ${form.km && parseInt(form.km) > 200000 ? 'desgastada' : 'regular'} para a quilometragem. Foram identificados sinais de uso normais e alguns pontos de atenção que devem ser informados aos arrematantes.`,
            details: {
                carroceria: { status: 'Regular', issues: ['Riscos superficiais na lateral esquerda', 'Pequena amassado no para-choque traseiro'] },
                motor: { status: 'Funcional', issues: ['Vazamento leve de óleo no bloco', 'Correia dentada necessita verificação'] },
                interior: { status: 'Regular', issues: ['Banco do motorista com desgaste', 'Painel sem defeitos aparentes'] },
                pneus: { status: 'Atenção', issues: ['Dois pneus traseiros com desgaste excessivo (abaixo de 2mm)', 'Pneus dianteiros em bom estado'] },
                vidros: { status: 'Bom', issues: [] },
            },
            estimatedValue: form.fipeValor ? `R$ ${(parseFloat(form.fipeValor) * 0.55).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 18.000,00',
            recommendation: 'Lote apto para leilão com lance mínimo sugerido de 55% do valor FIPE. Informar ao comprador sobre os pontos de atenção identificados.',
            depreciation: 45,
            observations: [
                'Verificar documentação regularidade DETRAN antes do leilão',
                'Indicar necessidade de troca de pneus no laudo',
                'Recomendar vistoria mecânica pelo arrematante antes da retirada',
            ]
        }

        setAnalysis(mockAnalysis)
        setLoading(false)
        setStep('analysis')
    }

    const scoreColor = (score: number) => {
        if (score >= 80) return '#00a65a'
        if (score >= 60) return '#f39c12'
        return '#dd4b39'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#333]">
                    <ClipboardCheck className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0">Nova Vistoria com IA</h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/vistorias" className="text-[#3c8dbc] hover:underline">Vistorias</Link> &gt; Nova
                </div>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-0">
                {[
                    { key: 'form', label: '1. Dados do Veículo' },
                    { key: 'photos', label: '2. Fotos' },
                    { key: 'analysis', label: '3. Análise IA' },
                ].map((s, i) => (
                    <div key={s.key} className="flex items-center">
                        <div className={`px-4 py-2 text-sm font-bold ${step === s.key ? 'bg-[#3c8dbc] text-white' : 'bg-[#f4f4f4] text-[#777]'} ${i === 0 ? 'rounded-l' : ''} ${i === 2 ? 'rounded-r' : ''}`}>
                            {s.label}
                        </div>
                        {i < 2 && <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-l-[12px] border-transparent" style={{ borderLeftColor: step === s.key ? '#3c8dbc' : '#f4f4f4' }} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Vehicle form */}
            {step === 'form' && (
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-6">
                    <h3 className="font-bold text-[#333] mb-5 flex items-center gap-2"><Car size={18} />Dados do Veículo</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Placa *</label>
                            <input value={form.placa} onChange={e => set('placa', e.target.value.toUpperCase())} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm font-mono font-bold tracking-wider" placeholder="ABC1D23" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Chassi</label>
                            <input value={form.chassi} onChange={e => set('chassi', e.target.value.toUpperCase())} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm font-mono" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">RENAVAM</label>
                            <input value={form.renavam} onChange={e => set('renavam', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Marca</label>
                            <input value={form.marca} onChange={e => set('marca', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Ex: Chevrolet" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Modelo</label>
                            <input value={form.modelo} onChange={e => set('modelo', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Ex: Prisma 1.0" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Ano Fab/Mod</label>
                            <input value={form.ano} onChange={e => set('ano', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Ex: 2018/2019" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Cor</label>
                            <input value={form.cor} onChange={e => set('cor', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Ex: Prata" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Km</label>
                            <input value={form.km} onChange={e => set('km', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Ex: 120000" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Combustível</label>
                            <select value={form.combustivel} onChange={e => set('combustivel', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm">
                                <option value="">Selecione</option>
                                <option value="flex">Flex</option>
                                <option value="gasolina">Gasolina</option>
                                <option value="diesel">Diesel</option>
                                <option value="eletrico">Elétrico</option>
                                <option value="hibrido">Híbrido</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Código FIPE</label>
                            <input value={form.fipeCodigo} onChange={e => set('fipeCodigo', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm font-mono" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#555] uppercase">Valor FIPE (R$)</label>
                            <input value={form.fipeValor} onChange={e => set('fipeValor', e.target.value)} className="w-full mt-1 border border-[#d2d6de] rounded px-3 py-2 text-sm" placeholder="Ex: 45000" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => form.placa && setStep('photos')}
                            disabled={!form.placa}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#3c8dbc] text-white font-bold rounded hover:bg-[#367fa9] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próximo: Fotos
                            <Camera size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Photos */}
            {step === 'photos' && (
                <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-[#333] flex items-center gap-2">
                            <Camera size={18} />
                            Registro Fotográfico
                            <span className="text-[13px] font-normal text-[#777]">{photoCount}/{slots.length} fotos</span>
                        </h3>
                        <div className="text-sm text-[#777]">
                            Obrigatórias: <strong className={requiredDone === requiredPhotos.length ? 'text-green-600' : 'text-red-600'}>{requiredDone}/{requiredPhotos.length}</strong>
                        </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0]
                            if (file && activeSlot) handleFileSelect(activeSlot, file)
                        }}
                    />

                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {slots.map(slot => (
                            <div
                                key={slot.id}
                                onClick={() => { setActiveSlot(slot.id); fileInputRef.current?.click() }}
                                className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer hover:border-[#3c8dbc] transition-all relative group ${slot.file ? 'border-green-500' : slot.required ? 'border-dashed border-red-300' : 'border-dashed border-[#d2d6de]'}`}
                            >
                                {slot.preview ? (
                                    <>
                                        <img src={slot.preview} alt={slot.label} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                        <div className="absolute top-1 right-1">
                                            <CheckCircle size={16} className="text-green-500 bg-white rounded-full" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                        <Camera size={20} className={slot.required ? 'text-red-400' : 'text-gray-400'} />
                                        <span className={`text-[10px] text-center mt-1 font-medium ${slot.required ? 'text-red-500' : 'text-gray-500'}`}>{slot.label}</span>
                                        {slot.required && <span className="text-[8px] text-red-400 font-bold">OBRIGATÓRIO</span>}
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    {slot.label}
                                </div>
                            </div>
                        ))}

                        {/* Add extra photo */}
                        <div className="aspect-square rounded-lg border-2 border-dashed border-[#d2d6de] flex flex-col items-center justify-center cursor-pointer hover:border-[#3c8dbc] transition-colors text-[#aaa] hover:text-[#3c8dbc]">
                            <Plus size={20} />
                            <span className="text-[10px] mt-1">Adicionar</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <button onClick={() => setStep('form')} className="flex items-center gap-2 px-4 py-2 text-[#777] hover:text-[#333] text-sm">
                            <ArrowLeft size={16} />
                            Voltar
                        </button>
                        <button
                            onClick={runAIAnalysis}
                            disabled={requiredDone < requiredPhotos.length || loading}
                            className="flex items-center gap-2 px-6 py-2.5 font-bold rounded text-white transition-colors disabled:opacity-50"
                            style={{ backgroundColor: '#8e44ad' }}
                        >
                            {loading ? (
                                <><Loader2 size={16} className="animate-spin" />Analisando com IA...</>
                            ) : (
                                <><Brain size={16} /><Zap size={14} />Analisar com IA</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: AI Analysis */}
            {step === 'analysis' && analysis && (
                <div className="space-y-4">
                    {/* Score card */}
                    <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-6">
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full border-8 flex items-center justify-center" style={{ borderColor: scoreColor(analysis.score) }}>
                                    <div>
                                        <div className="text-3xl font-bold" style={{ color: scoreColor(analysis.score) }}>{analysis.score}</div>
                                        <div className="text-[10px] text-[#777]">/ 100</div>
                                    </div>
                                </div>
                                <div className="mt-2 font-bold text-sm" style={{ color: scoreColor(analysis.score) }}>{analysis.condition}</div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Brain size={18} className="text-purple-600" />
                                    <h3 className="font-bold text-[#333]">Análise por Inteligência Artificial</h3>
                                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">GPT-4o Vision</span>
                                </div>
                                <p className="text-sm text-[#555]">{analysis.summary}</p>
                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    <div className="text-center p-2 bg-[#f9f9f9] rounded">
                                        <div className="text-xs font-bold text-[#777]">Valor Estimado</div>
                                        <div className="text-sm font-bold text-[#3c8dbc] mt-1">{analysis.estimatedValue}</div>
                                    </div>
                                    <div className="text-center p-2 bg-[#f9f9f9] rounded">
                                        <div className="text-xs font-bold text-[#777]">Depreciação</div>
                                        <div className="text-sm font-bold text-[#dd4b39] mt-1">{analysis.depreciation}%</div>
                                    </div>
                                    <div className="text-center p-2 bg-[#f9f9f9] rounded">
                                        <div className="text-xs font-bold text-[#777]">Placa</div>
                                        <div className="text-sm font-mono font-bold text-[#333] mt-1">{form.placa || '—'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(analysis.details).map(([key, val]) => {
                            const statusColor = val.status === 'Bom' || val.status === 'Funcional' ? '#00a65a' : val.status === 'Regular' ? '#f39c12' : '#dd4b39'
                            return (
                                <div key={key} className="bg-white border border-[#d2d6de] rounded-sm shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-bold text-sm text-[#333] capitalize">{key}</h4>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: statusColor }}>
                                            {val.status}
                                        </span>
                                    </div>
                                    {val.issues.length > 0 ? (
                                        <ul className="space-y-1">
                                            {val.issues.map((issue, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-[#555]">
                                                    <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" style={{ color: statusColor }} />
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <CheckCircle size={12} />
                                            Sem anomalias detectadas
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Recommendation */}
                    <div className="bg-white border-l-4 border-[#D4AF37] rounded-sm shadow-sm p-5">
                        <h3 className="font-bold text-[#333] mb-2 flex items-center gap-2">
                            <Star size={16} className="text-[#D4AF37]" />
                            Recomendação do Sistema
                        </h3>
                        <p className="text-sm text-[#555]">{analysis.recommendation}</p>
                        {analysis.observations.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs font-bold text-[#777] uppercase mb-1">Observações para o laudo:</p>
                                <ul className="space-y-1">
                                    {analysis.observations.map((obs, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-[#555]">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                                            {obs}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between bg-white border border-[#d2d6de] rounded-sm shadow-sm p-4">
                        <button onClick={() => { setAnalysis(null); setStep('form') }} className="flex items-center gap-2 text-[#777] hover:text-[#333] text-sm">
                            <ArrowLeft size={16} />
                            Nova Vistoria
                        </button>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#d2d6de] text-[#555] rounded text-sm hover:bg-[#f4f4f4]">
                                <Eye size={14} />
                                Visualizar Laudo
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2 bg-[#00a65a] text-white font-bold rounded hover:bg-[#008d4c] text-sm">
                                <FileText size={14} />
                                Salvar e Gerar Laudo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
