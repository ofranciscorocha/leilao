'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import { getSystemSettings, updateSystemSettings } from "@/app/actions/settings"
import { Loader2, Save } from "lucide-react"

export default function GeneralSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<any>({})

    useEffect(() => {
        loadSettings()
    }, [])

    async function loadSettings() {
        setLoading(true)
        const res = await getSystemSettings()
        if (res.success) {
            setSettings(res.data)
        } else {
            toast.error('Erro ao carregar configurações.')
        }
        setLoading(false)
    }

    async function handleSave() {
        setSaving(true)
        const res = await updateSystemSettings(settings)
        if (res.success) {
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
        setSaving(false)
    }

    const handleChange = (field: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [field]: value }))
    }

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>

    return (
        <div className="container mx-auto py-8 max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configurações Gerais</h1>
                    <p className="text-gray-500">Gerencie o comportamento global do sistema ("The Brain").</p>
                </div>
                <Button onClick={handleSave} disabled={saving} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Alterações
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="general">Geral</TabsTrigger>
                    <TabsTrigger value="features">Funcionalidades</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Legal</TabsTrigger>
                    <TabsTrigger value="contact">Contato</TabsTrigger>
                </TabsList>

                {/* --- GENERAL IDENTITY --- */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identidade do Site</CardTitle>
                            <CardDescription>Informações básicas exibidas no cabeçalho e rodapé.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="siteName">Nome do Site</Label>
                                <Input
                                    id="siteName"
                                    value={settings.siteName || ''}
                                    onChange={(e) => handleChange('siteName', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="siteUrl">URL Principal</Label>
                                <Input
                                    id="siteUrl"
                                    value={settings.siteUrl || ''}
                                    onChange={(e) => handleChange('siteUrl', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="logoUrl">URL do Logo</Label>
                                <Input
                                    id="logoUrl"
                                    value={settings.logoUrl || ''}
                                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- FEATURES TOGGLES --- */}
                <TabsContent value="features">
                    <Card>
                        <CardHeader>
                            <CardTitle>Controle de Funcionalidades</CardTitle>
                            <CardDescription>Ative ou desative módulos do sistema em tempo real.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2 border-b pb-4">
                                <div>
                                    <Label className="text-base">Modo Manutenção</Label>
                                    <p className="text-sm text-gray-500">Bloqueia o acesso público ao site, exibindo apenas uma página de aviso.</p>
                                </div>
                                <Switch
                                    checked={settings.maintenanceMode || false}
                                    onCheckedChange={(v) => handleChange('maintenanceMode', v)}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div>
                                    <Label className="text-base">Habilitar Lances</Label>
                                    <p className="text-sm text-gray-500">Permite que usuários logados deem lances nos lotes.</p>
                                </div>
                                <Switch
                                    checked={settings.enableBidding !== false}
                                    onCheckedChange={(v) => handleChange('enableBidding', v)}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div>
                                    <Label className="text-base">Cadastro de Usuários</Label>
                                    <p className="text-sm text-gray-500">Permite novos registros. Se desligado, apenas admins podem criar usuários.</p>
                                </div>
                                <Switch
                                    checked={settings.enableUserSignup !== false}
                                    onCheckedChange={(v) => handleChange('enableUserSignup', v)}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <div>
                                    <Label className="text-base">Ocultar Valores Vendidos</Label>
                                    <p className="text-sm text-gray-500">Não exibe o valor final de arremate nos lotes encerrados.</p>
                                </div>
                                <Switch
                                    checked={settings.hideSoldValues || false}
                                    onCheckedChange={(v) => handleChange('hideSoldValues', v)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- SEO & LEGAL --- */}
                <TabsContent value="seo">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO e Documentos Legais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="seoTitle">Título Padão (SEO)</Label>
                                <Input
                                    id="seoTitle"
                                    value={settings.seoTitle || ''}
                                    onChange={(e) => handleChange('seoTitle', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="seoDescription">Descrição (Meta Description)</Label>
                                <Textarea
                                    id="seoDescription"
                                    value={settings.seoDescription || ''}
                                    onChange={(e) => handleChange('seoDescription', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2 pt-4">
                                <Label htmlFor="terms">Termos de Uso (HTML ou Texto)</Label>
                                <Textarea
                                    id="terms"
                                    className="min-h-[150px] font-mono text-xs"
                                    value={settings.termsOfService || ''}
                                    onChange={(e) => handleChange('termsOfService', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- CONTACT --- */}
                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações de Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="contactEmail">E-mail de Suporte</Label>
                                <Input
                                    id="contactEmail"
                                    value={settings.contactEmail || ''}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contactPhone">Telefone / WhatsApp</Label>
                                <Input
                                    id="contactPhone"
                                    value={settings.contactPhone || ''}
                                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Endereço Físico</Label>
                                <Textarea
                                    id="address"
                                    value={settings.address || ''}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
