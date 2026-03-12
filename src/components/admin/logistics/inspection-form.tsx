'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner'
import { submitInspection } from "@/app/actions/logistics"
import { Loader2, Save } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface InspectionPageProps {
    lotId: string
    initialData: any // Replace with proper type
}

export default function InspectionForm({ lotId, initialData }: InspectionPageProps) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        engineStatus: initialData?.engineStatus || 'WORKING',
        transmission: initialData?.transmission || 'MANUAL',
        bodywork: initialData?.bodywork || 'GOOD',
        upholstery: initialData?.upholstery || 'GOOD',
        notes: initialData?.notes || '',
        checklist: JSON.parse(initialData?.checklist || '{}')
    })

    const checklistItems = [
        'Bateria', 'Pneus', 'Estepe', 'Macaco/Chave', 'Rádio/Multimídia', 'Ar Condicionado', 'Vidros Elétricos'
    ]

    const handleChecklistChange = (item: string, checked: boolean) => {
        setData(prev => ({
            ...prev,
            checklist: { ...prev.checklist, [item]: checked }
        }))
    }

    const handleSave = async () => {
        setLoading(true)
        const res = await submitInspection(lotId, data)
        if (res.success) {
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Vistoria Técnica</h2>
                <Button onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar Vistoria
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Structural Condition */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estado Geral</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Motor</Label>
                            <Select
                                value={data.engineStatus}
                                onValueChange={(v) => setData({ ...data, engineStatus: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WORKING">Funcionando</SelectItem>
                                    <SelectItem value="DAMAGED">Danificado/Falhando</SelectItem>
                                    <SelectItem value="MISSING">Faltando Peças</SelectItem>
                                    <SelectItem value="SEIZED">Travado (Fundido)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Câmbio</Label>
                            <Select
                                value={data.transmission}
                                onValueChange={(v) => setData({ ...data, transmission: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MANUAL">Manual - Ok</SelectItem>
                                    <SelectItem value="AUTOMATIC">Automático - Ok</SelectItem>
                                    <SelectItem value="BROKEN">Quebrado/Travado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Lataria / Pintura</Label>
                            <Select
                                value={data.bodywork}
                                onValueChange={(v) => setData({ ...data, bodywork: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GOOD">Boa / Original</SelectItem>
                                    <SelectItem value="SCRATCHED">Riscos Leves</SelectItem>
                                    <SelectItem value="DENTED">Amassados / Avarias</SelectItem>
                                    <SelectItem value="RUSTED">Pontos de Ferrugem</SelectItem>
                                    <SelectItem value="TOTAL_LOSS">Sucata / Colisão Grave</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Checklist */}
                <Card>
                    <CardHeader>
                        <CardTitle>Checklist de Acessórios</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {checklistItems.map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={item}
                                        checked={data.checklist[item] || false}
                                        onCheckedChange={(c) => handleChecklistChange(item, c as boolean)}
                                    />
                                    <Label htmlFor={item}>{item}</Label>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-2">
                            <Label>Observações Gerais</Label>
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setData({ ...data, notes: e.target.value })}
                                placeholder="Descreva avarias específicas..."
                                className="h-24"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
