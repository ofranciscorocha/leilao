'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { registerUser } from '@/app/actions/auth'

export default function RegisterPage() {
    const [type, setType] = useState('PF')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await registerUser(formData)
        setLoading(false)

        if (res.success) {
            toast.success('Cadastro realizado com sucesso! Faça login.')
            // Redirect logic would go here
        } else {
            toast.error(res.message || 'Erro ao cadastrar.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Cadastro de Arrematante</CardTitle>
                    <CardDescription className="text-center">
                        Crie sua conta para participar dos leilões.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="flex justify-center mb-6">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setType('PF')}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${type === 'PF' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Pessoa Física
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('PJ')}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${type === 'PJ' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Pessoa Jurídica
                                </button>
                            </div>
                            <input type="hidden" name="type" value={type} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome Completo / Razão Social</Label>
                                <Input name="name" required placeholder={type === 'PF' ? "João da Silva" : "Empresa LTDA"} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input name="email" type="email" required placeholder="seu@email.com" />
                            </div>

                            <div className="space-y-2">
                                <Label>{type === 'PF' ? 'CPF' : 'CNPJ'}</Label>
                                <Input name="document" required placeholder={type === 'PF' ? "000.000.000-00" : "00.000.000/0001-00"} />
                            </div>

                            <div className="space-y-2">
                                <Label>Telefone / Celular</Label>
                                <Input name="phone" required placeholder="(11) 99999-9999" />
                            </div>

                            <div className="space-y-2">
                                <Label>Senha</Label>
                                <Input name="password" type="password" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirmar Senha</Label>
                                <Input name="confirmPassword" type="password" required />
                            </div>
                        </div>

                        <div className="text-xs text-gray-500">
                            Ao se cadastrar, você concorda com os <a href="#" className="underline">Termos de Uso</a> e <a href="#" className="underline">Política de Privacidade</a>.
                        </div>

                        <Button className="w-full" disabled={loading}>
                            {loading ? 'Cadastrando...' : 'Criar Conta'}
                        </Button>

                        <div className="text-center text-sm">
                            Já tem uma conta? <Link href="/admin/login" className="text-blue-600 hover:underline">Faça Login</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
