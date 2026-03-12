'use client';

import { useState } from 'react';
import { ClipboardCheck, Plus, Eye, Printer, FileText, Search, Car, Calendar, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Mock data for existing inspections
const mockVistorias = [
    {
        id: 'LDO-2026-00147',
        placa: 'PYZ5J46',
        veiculo: 'Chevrolet Prisma 1.0 Joy',
        ano: '2018/2019',
        cor: 'Prata',
        km: '408.753',
        valorFipe: 45566.00,
        valorAvaliado: 25000.00,
        data: '02/03/2026',
        vistoriador: 'Francisco Rocha',
        status: 'Concluída',
    },
];

export default function VistoriasAdminPage() {
    const [search, setSearch] = useState('');

    const filtered = mockVistorias.filter(v =>
        v.placa.toLowerCase().includes(search.toLowerCase()) ||
        v.veiculo.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#333]">
                    <ClipboardCheck className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0 flex items-center gap-2">
                        Sistema de Vistorias
                    </h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/dashboard" className="text-[#3c8dbc] hover:underline">Home</Link> &gt; Vistorias
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Total de Vistorias" value="1" color="#3c8dbc" icon={<ClipboardCheck className="w-6 h-6" />} />
                <StatCard label="Este Mês" value="1" color="#00a65a" icon={<Calendar className="w-6 h-6" />} />
                <StatCard label="Veículos Avaliados" value="1" color="#f39c12" icon={<Car className="w-6 h-6" />} />
                <StatCard label="Vistoriadores" value="1" color="#dd4b39" icon={<User className="w-6 h-6" />} />
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-md bg-white border border-[#d2d6de] rounded-sm overflow-hidden">
                    <Search className="w-4 h-4 text-[#999] ml-3" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por placa, veículo ou nº do laudo..."
                        className="flex-1 py-2 pr-3 text-sm outline-none border-0"
                    />
                </div>
                <Link
                    href="/admin/vistorias/nova"
                    className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-2 text-sm font-medium rounded-sm flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nova Vistoria
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
                <div className="border-b border-[#f4f4f4] p-3 bg-white">
                    <h3 className="text-[16px] text-[#333] m-0 font-normal">Vistorias Realizadas</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#f9f9f9] border-b border-[#f4f4f4]">
                                <th className="text-left p-3 font-bold text-[#555] text-xs uppercase">Laudo</th>
                                <th className="text-left p-3 font-bold text-[#555] text-xs uppercase">Placa</th>
                                <th className="text-left p-3 font-bold text-[#555] text-xs uppercase">Veículo</th>
                                <th className="text-left p-3 font-bold text-[#555] text-xs uppercase">Ano</th>
                                <th className="text-left p-3 font-bold text-[#555] text-xs uppercase">KM</th>
                                <th className="text-right p-3 font-bold text-[#555] text-xs uppercase">FIPE</th>
                                <th className="text-right p-3 font-bold text-[#555] text-xs uppercase">Avaliação</th>
                                <th className="text-center p-3 font-bold text-[#555] text-xs uppercase">Data</th>
                                <th className="text-center p-3 font-bold text-[#555] text-xs uppercase">Status</th>
                                <th className="text-center p-3 font-bold text-[#555] text-xs uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v) => (
                                <tr key={v.id} className="border-b border-[#f4f4f4] hover:bg-[#f4f4f4] transition-colors">
                                    <td className="p-3 font-mono text-xs text-[#3c8dbc] font-bold">{v.id}</td>
                                    <td className="p-3 font-mono font-bold tracking-wider">{v.placa}</td>
                                    <td className="p-3">{v.veiculo}</td>
                                    <td className="p-3 text-[#777]">{v.ano}</td>
                                    <td className="p-3 text-[#777]">{v.km}</td>
                                    <td className="p-3 text-right font-semibold text-[#333]">
                                        {v.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="p-3 text-right font-bold text-[#dd4b39]">
                                        {v.valorAvaliado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="p-3 text-center text-[#777]">{v.data}</td>
                                    <td className="p-3 text-center">
                                        <span className="bg-[#00a65a] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase">
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Link
                                                href={`/vistoria/${v.placa}`}
                                                className="p-1.5 bg-[#3c8dbc] text-white rounded-sm hover:bg-[#367fa9] transition-colors"
                                                title="Visualizar Laudo"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                className="p-1.5 bg-[#f39c12] text-white rounded-sm hover:bg-[#e08e0b] transition-colors"
                                                title="Imprimir"
                                            >
                                                <Printer className="w-3.5 h-3.5" />
                                            </button>
                                            <a
                                                href={`/vistorias/${v.placa}/consulta_base_nacional.pdf`}
                                                target="_blank"
                                                className="p-1.5 bg-[#605ca8] text-white rounded-sm hover:bg-[#555299] transition-colors"
                                                title="Ver Consulta Base Nacional"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Inspection Quick Guide */}
            <div className="bg-white border-t-4 border-[#D4AF37] rounded-sm shadow-sm p-6">
                <h3 className="text-lg font-bold text-[#333] mb-4">Modelo de Vistoria — Pátio Rocha Leilões</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                        <div>
                            <div className="font-bold text-sm text-[#333]">Registro Fotográfico</div>
                            <div className="text-xs text-[#777] mt-1">
                                Captura das fotos externas (5 ângulos), rodas e pneus (4), motor, interior/painel, hodômetro e porta-malas.
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                        <div>
                            <div className="font-bold text-sm text-[#333]">Consulta Base Nacional</div>
                            <div className="text-xs text-[#777] mt-1">
                                Consulta cautelar na base RENAVAM/DETRAN e anexação do PDF com dados do veículo.
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                        <div>
                            <div className="font-bold text-sm text-[#333]">Laudo e Avaliação</div>
                            <div className="text-xs text-[#777] mt-1">
                                Geração automática do laudo com dados FIPE, avaliação de mercado, fatores de depreciação e parecer técnico.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color, icon }: any) {
    return (
        <div className="bg-white border border-[#d2d6de] rounded-sm shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4">
                <div>
                    <div className="text-2xl font-bold" style={{ color }}>{value}</div>
                    <div className="text-xs text-[#777] mt-0.5">{label}</div>
                </div>
                <div className="opacity-30" style={{ color }}>{icon}</div>
            </div>
        </div>
    );
}
