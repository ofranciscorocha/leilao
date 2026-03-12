import { Package2, ArrowLeft, Save, Car, Building2, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { createVehicleEntry as createLotLogistics } from '@/app/actions/logistics'
import { redirect } from 'next/navigation'

export default async function NewLogisticsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const category = (sp.category as string) || 'VEICULO'

    const createLot = async (formData: FormData) => {
        'use server'
        const res = await createLotLogistics(formData)
        if (res.success) {
            redirect('/admin/logistics')
        }
    }

    return (
        <div className="space-y-4 max-w-6xl pb-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[24px] font-normal text-[#333] flex items-center gap-2">
                    <Package2 className="w-6 h-6 text-gray-500" /> Bens <span className="text-gray-400 text-[18px]">Cadastro Completo</span>
                </h1>
                <div className="text-[12px] text-[#777]">
                    Home &gt; Logística &gt; Novo
                </div>
            </div>

            <div className="bg-white border-t-[3px] border-t-[#3c8dbc] shadow-sm rounded-sm">

                <div className="p-3 border-b border-[#f4f4f4] bg-[#fdfdfd] flex items-center gap-2">
                    <h3 className="text-[16px] font-bold text-[#333] pl-2 uppercase">Novo Lote: {category}</h3>
                </div>

                <form action={createLot} className="p-6">
                    <input type="hidden" name="category" value={category} />

                    {/* SEÇÃO 1: DADOS BÁSICOS & LOGÍSTICA */}
                    <h4 className="border-b border-[#eee] pb-2 mb-4 text-[#3c8dbc] font-bold text-[14px]">Informações Básicas e Logística</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Comitente (Cliente)</label>
                            <input type="text" name="comitente" required className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="Ex: HDI SEGUROS" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Pátio</label>
                            <input type="text" name="patio" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="Pátio Rocha Leilões" defaultValue="Pátio Rocha Leilões - Feira de Santana/BA" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Local no Pátio</label>
                            <input type="text" name="localPatio" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="Setor A..." />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Classificação de Despesas</label>
                            <input type="text" name="despesaClassificacao" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="VEÍCULOS" defaultValue={category === 'VEICULO' ? 'VEÍCULOS' : ''} />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Valor de Avaliação (R$)</label>
                            <input type="number" step="0.01" name="startingPrice" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="0.00" defaultValue="0" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Mínimo para Venda (R$)</label>
                            <input type="number" step="0.01" name="reservePrice" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="0.00" defaultValue="0" />
                        </div>
                    </div>

                    {/* SEÇÃO 2: DADOS ESPECÍFICOS (VEÍCULO) */}
                    {category === 'VEICULO' && (
                        <>
                            <h4 className="border-b border-[#eee] pb-2 mb-4 text-[#3c8dbc] font-bold text-[14px]">Dados do Veículo</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Placa</label>
                                    <input type="text" name="placa" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="ABC1D23" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">UF da Placa</label>
                                    <input type="text" name="placaUf" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="BA" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Chassi</label>
                                    <input type="text" name="chassis" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Renavam</label>
                                    <input type="text" name="renavam" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Número do Motor</label>
                                    <input type="text" name="numeroMotor" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Marca (Fabricante)</label>
                                    <input type="text" name="manufacturer" required className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="Ex: HYUNDAI" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Modelo</label>
                                    <input type="text" name="model" required className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="Ex: CRETA 1.6" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Linha de Veículos</label>
                                    <input type="text" name="linhaVeiculo" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="Ex: Carro, Moto, Caminhão" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Versão do Veículo</label>
                                    <input type="text" name="versaoVeiculo" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="Ex: 16A ATTITU" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Ano Fab/Mod</label>
                                    <input type="text" name="year" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="2021/2021" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Cor</label>
                                    <input type="text" name="color" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="Ex: BRANCA" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Combustível</label>
                                    <input type="text" name="fuel" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="Ex: FLEX, GASOLINA" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Código Fipe</label>
                                    <input type="text" name="fipeCodigo" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Valor Fipe (R$)</label>
                                    <input type="number" step="0.01" name="fipeValor" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="0.00" />
                                </div>

                                <div className="flex items-center gap-6 mt-6 col-span-1 md:col-span-2">
                                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#333] cursor-pointer">
                                        <input type="checkbox" name="sucata" className="w-4 h-4 cursor-pointer" /> É Sucata?
                                    </label>
                                    <label className="flex items-center gap-2 text-[13px] font-bold text-[#333] cursor-pointer">
                                        <input type="checkbox" name="hasKeys" className="w-4 h-4 cursor-pointer" /> Possui Chave?
                                    </label>
                                </div>
                                <div className="col-span-1 md:col-span-3 xl:col-span-4 mt-2">
                                    <label className="block text-[13px] font-bold text-[#333] mb-1">Acessórios</label>
                                    <input type="text" name="accessories" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="AR, TR, AL..." />
                                </div>
                            </div>
                        </>
                    )}

                    {category !== 'VEICULO' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-[13px] font-bold text-[#333] mb-1">Título / Denominação</label>
                                <input type="text" name="manufacturer" required className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder={`Ex: ${category === 'IMOVEL' ? 'TERRENO 500m2' : ' LOTE DIVERSOS'}`} />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-[#333] mb-1">Descrição Curta</label>
                                <input type="text" name="model" required className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc]" placeholder="..." />
                            </div>
                        </div>
                    )}


                    {/* SEÇÃO 3: ADMINISTRATIVO E OBSERVAÇÕES */}
                    <h4 className="border-b border-[#eee] pb-2 mb-4 text-[#3c8dbc] font-bold text-[14px]">Administrativo & Observações</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Processo SEI / Ofício (Referência)</label>
                            <input type="text" name="processoSei" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="" />
                        </div>
                        <div>
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Órgão / Contrato</label>
                            <input type="text" name="orgaoContrato" className="w-full border border-[#ccc] px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Observações (Públicas)</label>
                            <textarea name="observacoes" rows={3} className="w-full border border-[#ccc] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="..."></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[13px] font-bold text-[#333] mb-1">Observações Internas (Somente Admin)</label>
                            <textarea name="observacoesInternas" rows={3} className="w-full border border-[#ccc] px-3 py-2 text-[13px] focus:outline-none focus:border-[#3c8dbc] uppercase" placeholder="..."></textarea>
                        </div>
                    </div>


                    <div className="p-4 bg-[#f4f4f4] border border-[#ddd] rounded-sm mt-8">
                        <p className="text-[12px] text-[#555] mb-2 font-bold"><span className="text-[#3c8dbc]">ℹ️</span> Status Automático</p>
                        <p className="text-[11px] text-[#777]">O bem será cadastrado inicialmente no status <strong>EM ESTOQUE</strong> e a data de entrada será gravada como imediata. Você pode alterar o status alterando o lote na aba Visualizar/Editar posteriormente.</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#eee] flex items-center justify-between">
                        <Link href="/admin/logistics" className="bg-white border border-[#ccc] text-[#333] px-4 py-2 text-[13px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#e6e6e6]">
                            <ArrowLeft className="w-4 h-4" /> Cancelar
                        </Link>

                        <button type="submit" className="bg-[#00a65a] border border-[#008d4c] text-white px-6 py-2 text-[13px] font-bold rounded-sm flex items-center gap-1 hover:bg-[#008d4c]">
                            <Save className="w-4 h-4" /> Finalizar e Cadastrar {category}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}
