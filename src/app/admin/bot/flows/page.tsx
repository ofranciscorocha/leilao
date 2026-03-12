'use client'
import { Bot, Plus, ArrowRight, X, MessageSquare, HelpCircle, Zap } from "lucide-react"
import Link from 'next/link'
import { useState } from "react"

const MOCK_FLOWS = [
  { id: '1', name: 'Menu Principal', trigger: 'oi,olá,ola,menu,inicio', channel: 'WHATSAPP', active: true, steps: 5 },
  { id: '2', name: 'Consulta de Leilões', trigger: 'leilão,leilao,próximo,proximo', channel: 'WHATSAPP', active: true, steps: 3 },
  { id: '3', name: 'Habilitação', trigger: 'habilitar,habilitação,habilitacao', channel: 'WHATSAPP', active: true, steps: 4 },
  { id: '4', name: 'Falar com Atendente', trigger: 'atendente,humano,pessoa,ajuda', channel: 'BOTH', active: true, steps: 2 },
]

export default function BotFlowsPage() {
  const [flows, setFlows] = useState(MOCK_FLOWS)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#333]">
          <Bot className="h-[22px] w-[22px]" />
          <h1 className="text-[24px] font-normal m-0">Fluxos de Atendimento</h1>
        </div>
        <div className="text-[12px] text-[#777]"><Link href="/admin/bot" className="text-[#3c8dbc] hover:underline">Robô</Link> &gt; Fluxos</div>
      </div>
      <div className="bg-[#fff8e1] border border-[#ffe082] rounded-sm p-4 text-sm text-[#7d5a00] flex items-start gap-2">
        <HelpCircle size={16} className="flex-shrink-0 mt-0.5" />
        <span>Os fluxos definem o que o robô responde quando detecta determinadas palavras-chave na mensagem do cliente.</span>
      </div>
      <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-normal text-[16px] text-[#333]">Fluxos Configurados</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#3c8dbc] rounded hover:bg-[#367fa9]">
            <Plus size={14} />Novo Fluxo
          </button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-[#f9f9f9] border-b">
            <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Nome</th>
            <th className="text-left p-3 text-xs font-bold text-[#555] uppercase">Palavras-chave Trigger</th>
            <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Canal</th>
            <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Etapas</th>
            <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Status</th>
            <th className="text-center p-3 text-xs font-bold text-[#555] uppercase">Ações</th>
          </tr></thead>
          <tbody>
            {flows.map(f => (
              <tr key={f.id} className="border-b hover:bg-[#f9f9f9]">
                <td className="p-3 font-semibold text-[#333]">{f.name}</td>
                <td className="p-3"><div className="flex flex-wrap gap-1">{f.trigger.split(',').map(t => <span key={t} className="text-[10px] bg-[#f4f4f4] px-1.5 py-0.5 rounded font-mono">{t.trim()}</span>)}</div></td>
                <td className="p-3 text-center"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${f.channel === 'WHATSAPP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{f.channel}</span></td>
                <td className="p-3 text-center text-[#777]">{f.steps}</td>
                <td className="p-3 text-center"><span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-600">Ativo</span></td>
                <td className="p-3 text-center"><div className="flex justify-center gap-1">
                  <button className="p-1.5 bg-[#3c8dbc] text-white rounded-sm text-xs">Editar</button>
                  <button onClick={() => setFlows(p => p.filter(x => x.id !== f.id))} className="p-1.5 bg-[#dd4b39] text-white rounded-sm"><X size={12} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
