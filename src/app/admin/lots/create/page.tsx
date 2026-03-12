import { Package, Save, ArrowLeft, Info, DollarSign, Tag, Search, Car, FileText } from "lucide-react"
import Link from 'next/link'
import { createLot } from "@/app/actions/lots"
import { prisma } from "@/lib/prisma"

export default async function CreateLotPage() {
    // Note: Em produção, você puxaria os leilões ativos para o select
    const activeAuctions = await prisma.auction.findMany({
        where: { status: { in: ['UPCOMING', 'OPEN', 'EM_LOTEAMENTO', 'EM_BREVE'] } },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <form action={createLot} className="space-y-4 pb-10">
            {/* Header and Breadcrumb */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#333]">
                    <Package className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0 flex items-center gap-2">
                        Novo Lote (Bem) <span className="text-[18px] text-gray-400">Cadastro Robusto</span>
                    </h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/lots" className="hover:text-[#3c8dbc]">Lotes</Link> &gt; Novo
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left Column: Form Sections */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Section 1: Vinculação e Loteamento */}
                    <div className="bg-white border-t-[3px] border-t-[#3c8dbc] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Informações Básicas e Vinculação</h3>
                        </div>
                        <div className="p-4 space-y-4 text-[14px]">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-[#333] font-bold mb-1">Vincular a qual Leilão? <span className="text-red-500">*</span></label>
                                    <select name="auctionId" required className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm bg-white font-bold">
                                        <option value="">-- Selecione o Leilão --</option>
                                        {activeAuctions.map(a => (
                                            <option key={a.id} value={a.id}>{a.title} ({a.status})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[#333] font-bold mb-1">Número do Lote</label>
                                    <input type="number" name="lotNumber" placeholder="Ex: 001" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm bg-yellow-50 font-bold" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-[#333] font-bold mb-1">Categoria <span className="text-red-500">*</span></label>
                                    <select name="category" required className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm bg-white">
                                        <option value="VEICULO">Veículo</option>
                                        <option value="IMOVEL">Imóvel</option>
                                        <option value="DIVERSOS">Diversos / Materiais</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-[#333] font-bold mb-1">Título / Descrição Curta <span className="text-red-500">*</span></label>
                                    <input type="text" name="title" required placeholder="Ex: VW GOL 1.0 (SUCATA)" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#333] font-bold mb-1">Comitente (Vendedor/Banco/Seguradora)</label>
                                <input type="text" name="comitente" placeholder="Ex: BANCO PAN" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>

                            <div>
                                <label className="block text-[#333] font-bold mb-1">Descrição Completa</label>
                                <textarea name="description" rows={3} placeholder="Detalhes sobre o estado do bem, motor, avarias..." className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Detalhes Técnicos Automotivos (Logística-sync) */}
                    <div className="bg-white border-t-[3px] border-t-[#f39c12] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <Car className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Características Técnicas e Legais</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Placa</label>
                                <input type="text" name="placa" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" placeholder="ABC1D23" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">UF da Placa</label>
                                <input type="text" name="placaUf" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" placeholder="SP" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Chassi</label>
                                <input type="text" name="chassis" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Renavam</label>
                                <input type="text" name="renavam" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Número do Motor</label>
                                <input type="text" name="numeroMotor" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Fabricante (Marca)</label>
                                <input type="text" name="manufacturer" placeholder="Ex: VOLKSWAGEN" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Modelo</label>
                                <input type="text" name="model" placeholder="Ex: GOL TL MC" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Linha/Versão</label>
                                <input type="text" name="versaoVeiculo" placeholder="Ex: 1.0 MPI 12V" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Ano (Fab/Mod)</label>
                                <input type="text" name="year" placeholder="Ex: 2018/2019" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Cor</label>
                                <input type="text" name="color" placeholder="Ex: BRANCA" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Combustível</label>
                                <input type="text" name="fuel" placeholder="Ex: FLEX" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div className="col-span-1 md:col-span-2 flex items-center gap-6 mt-4">
                                <label className="flex items-center gap-2 text-[13px] font-bold text-[#333] cursor-pointer">
                                    <input type="checkbox" name="sucata" className="w-4 h-4" /> É Sucata?
                                </label>
                                <label className="flex items-center gap-2 text-[13px] font-bold text-[#333] cursor-pointer">
                                    <input type="checkbox" name="hasKeys" className="w-4 h-4" /> Possui Chave?
                                </label>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[#333] font-bold mb-1">Acessórios</label>
                                <input type="text" name="accessories" placeholder="Ex: AR, TR, AL, VE" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Administrativo SEI & Documentação */}
                    <div className="bg-white border-t-[3px] border-t-[#605ca8] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Administrativo & Regulação</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Processo SEI / Referência</label>
                                <input type="text" name="processoSei" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Órgão / Contrato Originador</label>
                                <input type="text" name="orgaoContrato" placeholder="DETRAN-BA, POLICIA FEDERAL, etc" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#333] font-bold mb-1">Observações Internas (Somente Admin)</label>
                                <textarea name="observacoesInternas" rows={2} className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Valores */}
                    <div className="bg-white border-t-[3px] border-t-[#00a65a] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Preços e Valores de Referência</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Lance Inicial R$</label>
                                <input type="number" name="startingPrice" defaultValue={0} step="0.01" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm bg-green-50 text-green-800 font-bold" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Mínimo para Venda R$</label>
                                <input type="number" name="reservePrice" defaultValue={0} step="0.01" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Incremento Min. R$</label>
                                <input type="number" name="incrementAmount" defaultValue={50} className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Valor Tabela Fipe R$</label>
                                <input type="number" name="fipeValor" step="0.01" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-4">
                    <div className="bg-white border-t-[3px] border-t-[#333] rounded-sm shadow-sm p-4 text-[14px]">
                        <h3 className="font-bold text-[#333] mb-3 pb-2 border-b border-[#f4f4f4]">Controle de Publicação</h3>

                        <div className="mb-4">
                            <label className="block text-[#333] font-bold mb-1">Status Oficial do Lote</label>
                            <select name="status" className="w-full border border-[#d2d6de] px-3 py-2 focus:border-[#3c8dbc] outline-none rounded-sm bg-white font-bold">
                                <option value="AVAILABLE">DISPONÍVEL</option>
                                <option value="EM_ESTOQUE">EM ESTOQUE LOGÍSTICO</option>
                                <option value="EM_LOTEAMENTO">EM LOTEAMENTO</option>
                                <option value="AUCTIONED">VINCULADO AO LEILÃO ATIVO</option>
                                <option value="SUSPENSO" className="text-red-500">SUSPENSO</option>
                                <option value="RETIRADOS" className="text-gray-500">RETIRADO</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[#333] font-bold mb-1">Pátio / Localização Real</label>
                            <input type="text" name="location" defaultValue="Pátio Vitória" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-[#f4f4f4]">
                            <button type="submit" className="w-full bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-3 font-bold rounded-sm transition-colors text-center flex justify-center items-center gap-2 uppercase">
                                <Save className="w-5 h-5" /> Salvar Bem (Lote)
                            </button>
                            <Link href="/admin/lots" className="w-full bg-white hover:bg-[#f4f4f4] text-[#333] px-4 py-2 font-bold rounded-sm border border-[#d2d6de] transition-colors text-center flex justify-center items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Cancelar
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    )
}
