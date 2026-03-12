'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner'
import { createVehicleEntry } from "@/app/actions/logistics"
import { Loader2 } from "lucide-react"

export default function VehicleEntryPage() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createVehicleEntry(formData)
        if (res.success) {
            toast.success(res.message)
            // Reset form or redirect
        } else {
            toast.error(res.message)
        }
        setLoading(false)
    }

    return (
        <div className="container py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Entrada de Veículo (Check-in)</h1>

            <form action={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Veículo & Logística</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Identify the Auction */}
                        <div className="grid gap-2">
                            <Label>ID do Leilão (Temporário: Colar ID)</Label>
                            <Input name="auctionId" placeholder="ex: cl...123" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Número do Lote</Label>
                                <Input type="number" name="lotNumber" required placeholder="001" />
                            </div>
                            <div className="space-y-2">
                                <Label>Valor Inicial (R$)</Label>
                                <Input type="number" name="startingPrice" step="0.01" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Título (Marca/Modelo/Versão)</Label>
                            <Input name="title" required placeholder="Chevrolet Onix 1.0..." />
                        </div>

                        <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Textarea name="description" placeholder="Detalhes do estado..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="space-y-2">
                                <Label>Localização no Pátio</Label>
                                <Input name="storageLocation" placeholder="Setor A - Vaga 12" />
                            </div>
                            <div className="space-y-2">
                                <Label>Localização da Chave</Label>
                                <Input name="keyLocation" placeholder="Claviculário 05" />
                            </div>
                        </div>

                        <div className="flex gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="hasKeys" name="hasKeys" />
                                <Label htmlFor="hasKeys">Possui Chave?</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="hasManual" name="hasManual" />
                                <Label htmlFor="hasManual">Possui Manual?</Label>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full mt-4">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Registrar Entrada
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
