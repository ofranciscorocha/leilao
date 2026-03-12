import { Gavel, Save, ArrowLeft, Video, Settings, Calendar, Info, DollarSign, MapPin, UserCheck, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { createAuction } from '@/app/actions/auctions'

export default function CreateAuctionPage() {
    return (
        <form action={createAuction} className="space-y-4 pb-10">
            {/* Header and Breadcrumb */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#333]">
                    <Gavel className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0 text-gray-700">Novo Leilão <span className="text-[18px] text-gray-400">Cadastro Robusto</span></h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/auctions" className="hover:text-[#3c8dbc]">Leilão</Link> &gt; Novo
                </div>
            </div>

            {/* Main Layout: Left Column (Form) & Right Column (Publish Actions) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left Column: Form Sections */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Section 1: Informações Básicas */}
                    <div className="bg-white border-t-[3px] border-t-[#3c8dbc] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Informações Básicas</h3>
                        </div>
                        <div className="p-4 space-y-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Título do Leilão <span className="text-red-500">*</span></label>
                                <input type="text" name="title" required placeholder="Ex: LEILÃO DETRAN - PATIO CARAPINA SUNDOWN" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm transition-colors" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Resumo Corto / Descrição</label>
                                <textarea name="summary" rows={2} placeholder="Breve descrição ou destaque do leilão..." className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm transition-colors"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#333] font-bold mb-1">Tipo de Leilão</label>
                                    <select name="type" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm bg-white">
                                        <option value="ONLINE">Online (Fechamento Sequencial)</option>
                                        <option value="LIVE">Live Streaming (Ao Vivo com Leiloeiro)</option>
                                        <option value="PRESENTIAL">Presencial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[#333] font-bold mb-1">Modalidade</label>
                                    <select name="modalidade" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm bg-white">
                                        <option value="PUBLIC">Leilão Público / Maior Lance</option>
                                        <option value="JUDICIAL">Judicial</option>
                                        <option value="EXTRAJUDICIAL">Extrajudicial</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Datas */}
                    <div className="bg-white border-t-[3px] border-t-[#00a65a] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Datas de Realização</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Início dos Lances</label>
                                <input type="datetime-local" name="biddingStart" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                <span className="text-[11px] text-gray-500 mt-1 block">Quando os lances online são liberados.</span>
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Data do Evento (Pregão) <span className="text-red-500">*</span></label>
                                <input type="datetime-local" name="startDate" required className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                <span className="text-[11px] text-gray-500 mt-1 block">Data do pregão oficial / fechamento.</span>
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Data Limite (Encerramento) <span className="text-red-500">*</span></label>
                                <input type="datetime-local" name="endDate" required className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                <span className="text-[11px] text-gray-500 mt-1 block">Quando o leilão é fechado totalmente.</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Financeiro / Taxas */}
                    <div className="bg-white border-t-[3px] border-t-[#f39c12] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Financeiro & Taxas Administrativas</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Taxa Administrativa (R$)</label>
                                <input type="number" step="0.01" name="taxaAdministrativa" placeholder="Ex: 500.00" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Comissão do Leiloeiro (%)</label>
                                <input type="number" step="0.1" name="comissaoLeiloeiro" placeholder="Ex: 5" defaultValue="5" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="flex flex-col justify-center pt-5 pl-2">
                                <label className="flex items-center gap-2 text-[#333] font-bold cursor-pointer">
                                    <input type="checkbox" name="caucao" className="w-4 h-4" /> Exigir Caução Prévia?
                                </label>
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Valor do Caução (R$)</label>
                                <input type="number" step="0.01" name="caucaoValor" placeholder="Ex: 1000.00" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Visitação */}
                    <div className="bg-white border-t-[3px] border-t-[#605ca8] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Visitação (Pátio / Avaliação)</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                            <div className="md:col-span-2">
                                <label className="block text-[#333] font-bold mb-1">Local da Visitação</label>
                                <input type="text" name="visitacaoLocal" placeholder="Ex: Pátio Principal - Rod. BR 101, Km 15 - Feira de Santana/BA" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Início da Visitação</label>
                                <input type="datetime-local" name="visitacaoInicio" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Fim da Visitação</label>
                                <input type="datetime-local" name="visitacaoFim" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Leiloeiro e Regras */}
                    <div className="bg-white border-t-[3px] border-t-[#d81b60] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Responsável Oficial e Edital</h3>
                        </div>
                        <div className="p-4 space-y-4 text-[14px]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#333] font-bold mb-1">Nome do Leiloeiro</label>
                                    <input type="text" name="leiloeiroNome" placeholder="Ex: João Silva da Rocha" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                </div>
                                <div>
                                    <label className="block text-[#333] font-bold mb-1">Matrícula (Junta Comercial)</label>
                                    <input type="text" name="leiloeiroMatricula" placeholder="Ex: JUCEB 001/2021" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1 flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" /> Termos de Participação / Regras do Edital
                                </label>
                                <textarea name="editalRegras" rows={5} placeholder="Cole aqui o texto do edital, regras de retirada, prazos e multas. O arrematante terá que dar o aceite antes de participar." className="w-full border border-[#d2d6de] px-3 py-2 focus:border-[#3c8dbc] outline-none rounded-sm transition-colors"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Configurações e Streaming */}
                    <div className="bg-white border-t-[3px] border-t-[#dd4b39] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <Video className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Integração Ao Vivo & Streaming</h3>
                        </div>
                        <div className="p-4 space-y-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1 flex items-center gap-1">
                                    Embed do YouTube / Vimeo
                                </label>
                                <input type="text" name="videoEmbedUrl" placeholder="Ex: https://www.youtube.com/embed/XXXXXXX" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>

                            <div className="w-full md:w-1/3">
                                <label className="block text-[#333] font-bold mb-1">Tempo de Prorrogação (Overtime/Seg)</label>
                                <input type="number" name="overtimeSeconds" defaultValue={120} min={0} className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Actions */}
                <div className="space-y-4">
                    <div className="bg-white border-t-[3px] border-t-[#333] rounded-sm shadow-sm p-4 text-[14px]">
                        <h3 className="font-bold text-[#333] mb-3 pb-2 border-b border-[#f4f4f4]">Publicação Avançada</h3>

                        <div className="mb-6">
                            <label className="block text-[#333] font-bold mb-1">Status Oficial do Leilão</label>
                            <select name="status" className="w-full border border-[#d2d6de] px-3 py-2 focus:border-[#3c8dbc] outline-none rounded-sm bg-white font-bold text-[#3c8dbc]">
                                <option value="EM_BREVE">EM BREVE (Agendado/Oculto lances)</option>
                                <option value="EM_LOTEAMENTO">EM LOTEAMENTO (Recebendo bens)</option>
                                <option value="UPCOMING">AGUARDANDO ABERTURA</option>
                                <option value="OPEN">ABERTO (Recebendo Lances)</option>
                                <option value="SUSPENSO" className="text-red-600">SUSPENSO (Ordem Judicial)</option>
                                <option value="INATIVO" className="text-gray-500">INATIVO / CANCELADO</option>
                            </select>
                            <span className="text-[11px] text-gray-500 mt-2 block">Define exatamente como o leilão e seus lotes se comportam no frontend.</span>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-[#f4f4f4]">
                            <button type="submit" className="w-full bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-3 font-bold rounded-sm transition-colors text-center flex justify-center items-center gap-2 uppercase">
                                <Save className="w-5 h-5" /> Cadastrar Leilão
                            </button>
                            <Link href="/admin/auctions" className="w-full bg-white hover:bg-[#f4f4f4] text-[#333] px-4 py-2 font-bold rounded-sm border border-[#d2d6de] transition-colors text-center flex justify-center items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Cancelar / Voltar
                            </Link>
                        </div>
                    </div>

                    <div className="bg-[#f0f9fa] border border-[#d3eef6] p-4 rounded-sm text-[12px] text-[#2c7a90]">
                        <Settings className="w-5 h-5 mb-2" />
                        <strong>Próximos Passos:</strong> Após cadastrar as regras, taxas e o edital, o sistema irá direcioná-lo para importar ou cadastrar os <strong>Lotes</strong> usando o módulo de logística ou criação avulsa.
                    </div>
                </div>

            </div>
        </form>
    )
}
