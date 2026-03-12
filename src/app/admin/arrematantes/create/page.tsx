'use client'

import { useState } from 'react'
import { Save, ArrowLeft, UserPlus, MapPin, Building2, User } from 'lucide-react'
import Link from 'next/link'
import { createArrematante } from '@/app/actions/arrematantes'

export default function CreateArrematantePage() {
    const [personType, setPersonType] = useState<'PF' | 'PJ'>('PF')

    return (
        <form action={createArrematante} className="space-y-4 pb-10 font-sans">
            {/* Header and Breadcrumb */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#333]">
                    <UserPlus className="h-[22px] w-[22px]" />
                    <h1 className="text-[24px] font-normal m-0 flex items-center gap-2">
                        Novo Arrematante <span className="text-[18px] text-gray-400">Cadastro Manual</span>
                    </h1>
                </div>
                <div className="text-[12px] text-[#777]">
                    <Link href="/admin/users" className="hover:text-[#3c8dbc]">Arrematantes</Link> &gt; Novo
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left Column: Form Sections */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Section: Tipo de Pessoa */}
                    <div className="bg-white border-t-[3px] border-t-[#3c8dbc] rounded-sm shadow-sm p-4">
                        <label className="block text-[#333] font-bold mb-2">Tipo de Cadastro</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="PF"
                                    checked={personType === 'PF'}
                                    onChange={() => setPersonType('PF')}
                                />
                                Pessoa Física (PF)
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="PJ"
                                    checked={personType === 'PJ'}
                                    onChange={() => setPersonType('PJ')}
                                />
                                Pessoa Jurídica (PJ)
                            </label>
                        </div>
                    </div>

                    {/* Section 1: Dados Pessoais / Empresariais */}
                    <div className="bg-white border-t-[3px] border-t-[#f39c12] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            {personType === 'PF' ? <User className="w-4 h-4 text-[#333]" /> : <Building2 className="w-4 h-4 text-[#333]" />}
                            <h3 className="text-[16px] font-bold text-[#333] m-0">
                                {personType === 'PF' ? 'Dados Pessoais' : 'Dados Empresariais'}
                            </h3>
                        </div>
                        <div className="p-4 space-y-4 text-[14px]">

                            {/* Acesso (Comum aos dois) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-dashed border-[#eee]">
                                <div>
                                    <label className="block text-[#333] font-bold mb-1">E-mail de Acesso <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" required placeholder="email@exemplo.com" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                </div>
                                <div>
                                    <label className="block text-[#333] font-bold mb-1">Telefone / WhatsApp</label>
                                    <input type="text" name="phone" placeholder="(11) 99999-9999" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                </div>
                            </div>

                            {/* PF Fields */}
                            {personType === 'PF' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[#333] font-bold mb-1">Nome Completo <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" required={personType === 'PF'} className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                                    </div>
                                    <div>
                                        <label className="block text-[#333] font-bold mb-1">CPF <span className="text-red-500">*</span></label>
                                        <input type="text" name="cpf" required={personType === 'PF'} placeholder="000.000.000-00" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[#333] font-bold mb-1">RG</label>
                                        <input type="text" name="rg" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                    </div>
                                </div>
                            )}

                            {/* PJ Fields */}
                            {personType === 'PJ' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[#333] font-bold mb-1">Razão Social <span className="text-red-500">*</span></label>
                                        <input type="text" name="corporateName" required={personType === 'PJ'} className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                                    </div>
                                    <div>
                                        <label className="block text-[#333] font-bold mb-1">CNPJ <span className="text-red-500">*</span></label>
                                        <input type="text" name="cnpj" required={personType === 'PJ'} placeholder="00.000.000/0001-00" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[#333] font-bold mb-1">Nome Fantasia</label>
                                        <input type="text" name="tradeName" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                                    </div>
                                    <div>
                                        <label className="block text-[#333] font-bold mb-1">Nome do Responsável / Sócio</label>
                                        <input type="text" name="responsibleName" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Endereço Sede */}
                    <div className="bg-white border-t-[3px] border-t-[#605ca8] rounded-sm shadow-sm">
                        <div className="border-b border-[#f4f4f4] p-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#333]" />
                            <h3 className="text-[16px] font-bold text-[#333] m-0">Endereço</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-[14px]">
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">CEP</label>
                                <input type="text" name="zipCode" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" placeholder="00000-000" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#333] font-bold mb-1">Logradouro / Rua</label>
                                <input type="text" name="address" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">Número</label>
                                <input type="text" name="number" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#333] font-bold mb-1">Cidade</label>
                                <input type="text" name="city" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[#333] font-bold mb-1">Estado (UF)</label>
                                <input type="text" name="state" className="w-full border border-[#d2d6de] px-3 py-1.5 focus:border-[#3c8dbc] outline-none rounded-sm uppercase" placeholder="SP" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Actions */}
                <div className="space-y-4">
                    <div className="bg-white border-t-[3px] border-t-[#333] rounded-sm shadow-sm p-4 text-[14px]">
                        <h3 className="font-bold text-[#333] mb-3 pb-2 border-b border-[#f4f4f4]">Configurações da Conta</h3>

                        <div className="mb-4">
                            <label className="block text-[#333] font-bold mb-1">Status Base</label>
                            <select name="status" className="w-full border border-[#d2d6de] px-3 py-2 rounded-sm outline-none">
                                <option value="ACTIVE">Ativo (Aprovado)</option>
                                <option value="PENDING">Pendente (Em Análise)</option>
                                <option value="BLOCKED">Bloqueado</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-[#f4f4f4]">
                            <button type="submit" className="w-full bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-3 font-bold rounded-sm transition-colors text-center flex justify-center items-center gap-2 uppercase">
                                <Save className="w-5 h-5" /> Cadastrar Arrematante
                            </button>
                            <Link href="/admin/users" className="w-full bg-white hover:bg-[#f4f4f4] text-[#333] px-4 py-2 font-bold rounded-sm border border-[#d2d6de] transition-colors text-center flex justify-center items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Cancelar
                            </Link>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-4 text-center">
                            A senha padrão gerada será <strong>patio123</strong>. O arrematante poderá redefini-la depois.
                        </p>
                    </div>
                </div>

            </div>
        </form>
    )
}
