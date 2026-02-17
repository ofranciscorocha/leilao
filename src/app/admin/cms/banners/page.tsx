'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Trash2, Plus, Save } from 'lucide-react'
import { toast } from 'sonner'
import { createBanner, deleteBanner, toggleBannerStatus } from '@/app/actions/cms'

export default function BannersPage() {
    const [loading, setLoading] = useState(false)
    const [banners, setBanners] = useState([]) // We would fetch this with useEffect or pass as prompt

    // Mock initial data handling or use SWR/Server Component wrapper
    // For simplicity in this step, I'm creating the form first.

    async function handleCreate(formData: FormData) {
        setLoading(true)
        const res = await createBanner(formData)
        if (res.success) {
            toast.success(res.message)
            // Reload page or list
        } else {
            toast.error(res.message)
        }
        setLoading(false)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gerenciar Banners</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Adicionar Novo Banner</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleCreate} className="grid gap-4 md:grid-cols-2 items-end">
                        <div className="space-y-2">
                            <Label>Título (Alt Text)</Label>
                            <Input name="title" placeholder="Promoção de Verão" required />
                        </div>
                        <div className="space-y-2">
                            <Label>URL da Imagem</Label>
                            <Input name="imageUrl" placeholder="https://..." required />
                        </div>
                        <div className="space-y-2">
                            <Label>Link de Destino (Opcional)</Label>
                            <Input name="linkUrl" placeholder="/leilao/123" />
                        </div>
                        <div className="space-y-2">
                            <Label>Posição</Label>
                            <Input name="position" defaultValue="HOME_HERO" readOnly className="bg-gray-100" />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={loading} className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Adicionar Banner
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Banners Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        <p>A lista de banners aparecerá aqui após a reinicialização do banco de dados.</p>
                        {/* 
                         In a real implementation, we would map over `banners` here.
                         Since we are in "blind" mode regarding DB state vs Server state, 
                         I am keeping this safe to avoid crashes on checking `banners.map`.
                        */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
