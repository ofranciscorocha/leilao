import { Save, ArrowLeft, Building2, MapPin, UserSquare2, Percent } from "lucide-react"
import Link from 'next/link'
import { createComitente } from "@/app/actions/comitentes"

export default function CreateComitentePage() {
    return (
        <form action={createComitente} className="space-y-4 pb-10">
            {/* Header and Breadcrumb */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#333]">
                    <Building2 className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0 flex items-center gap-2">
                        Novo Comitente <span className="text-[18px] text-gray-400">Banco / Seguradora / Órgão</span>
                    </h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/comitentes" className="hover:text-[#3c8dbc]">Comitentes</Link> &gt; Novo
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left Column: Form Sections */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Section 1: Dados Institucionais */}
                    <div className="bg-white border-t-[3px] border-t-[#3c8dbc] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Dados Institucionais / Empresariais</h3>
                        </div>
                        <div className="p-4 space-y-4 text-[14px]">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-[#333] font-bold mb-1">CNPJ / CPF <span className="text-red-500">*</span></label>
                                    <input type="text" name="cnpjCpf" required placeholder="00.000.000/0001-00" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm font-bold" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[#333] font-bold mb-1">Razão Social <span className="text-red-500">*</span></label>
                                    <input type="text" name="razaoSocial" required placeholder="Ex: BANCO SANTANDER BRASIL S.A." className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[#333] font-bold mb-1">Nome Fantasia</label>
                                <input type="text" name="nomeFantasia" placeholder="Ex: SANTANDER FINANCIAMENTOS" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Contato e Comunicação */}
                    <div className="bg-white border-t-[3px] border-t-[#f39c12] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <UserSquare2 className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Contato Oficial</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Responsável Operacional</label>
                                <input type="text" name="contatoNome" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" placeholder="Nome de quem cuida dos leilões" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Email <span className="text-gray-400 font-normal">(Para notificações)</span></label>
                                <input type="email" name="contatoEmail" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" placeholder="email@banco.com.br" />
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1">Telefone / WhatsApp</label>
                                <input type="text" name="contatoTelefone" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" placeholder="(11) 99999-9999" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Endereço Sede */}
                    <div className="bg-white border-t-[3px] border-t-[#605ca8] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Endereço Sede / Faturamento</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-[14px]">
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">CEP</label>
                                <input type="text" name="cep" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" placeholder="00000-000" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#333] font-bold mb-1">Logradouro / Rua</label>
                                <input type="text" name="logradouro" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">Número</label>
                                <input type="text" name="numero" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">Complemento</label>
                                <input type="text" name="complemento" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">Bairro</label>
                                <input type="text" name="bairro" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">Cidade</label>
                                <input type="text" name="cidade" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">Estado (UF)</label>
                                <input type="text" name="estado" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" placeholder="SP" />
                            </div>
                        </div>
                    </div>

                    {/* Section 4: SLA e Regras Administrativas */}
                    <div className="bg-white border-t-[3px] border-t-[#00a65a] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <Percent className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">SLA Contratuais & Acordos de Repasse</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                            <div>
                                <label className="block text-[#333] font-bold mb-1 flex items-center justify-between">
                                    Taxa Retida do Leiloeiro (%) <span className="text-[#3c8dbc] text-xs">Opcional</span>
                                </label>
                                <input type="number" name="taxaComissao" step="0.1" placeholder="Ex: 5" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                <span className="text-[11px] text-gray-500 mt-1 block">Porcentagem acordada caso o leiloeiro retenha X% por bem vendido.</span>
                            </div>
                            <div>
                                <label className="block text-[#333] font-bold mb-1 flex items-center justify-between">
                                    Taxa Plataforma Fixa (R$) <span className="text-[#3c8dbc] text-xs">Opcional</span>
                                </label>
                                <input type="number" name="taxaFixa" step="0.01" placeholder="Ex: 100.00" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#333] font-bold mb-1">Observações Privadas do Acordo Contratual</label>
                                <textarea name="observacoes" rows={3} placeholder="Mencione aqui prazos de pagamento, regras de remoção, etc..." className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-4">
                    <div className="bg-white border-t-[3px] border-t-[#333] rounded-sm shadow-sm p-4 text-[14px]">
                        <h3 className="font-bold text-[#333] mb-3 pb-2 border-b border-[#f4f4f4]">Controle</h3>

                        <div className="flex flex-col gap-2 pt-2 border-t border-[#f4f4f4]">
                            <button type="submit" className="w-full bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-3 font-bold rounded-sm transition-colors text-center flex justify-center items-center gap-2 uppercase">
                                <Save className="w-5 h-5" /> Cadastrar Comitente
                            </button>
                            <Link href="/admin/comitentes" className="w-full bg-white hover:bg-[#f4f4f4] text-[#333] px-4 py-2 font-bold rounded-sm border border-[#d2d6de] transition-colors text-center flex justify-center items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Cancelar
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    )
}
