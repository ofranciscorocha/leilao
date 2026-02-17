'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function DocumentsPage() {
    const [uploading, setUploading] = useState(false)

    // Mock Data
    const documents = [
        { id: '1', type: 'CNH / RG', status: 'APPROVED', lastUpdate: '2023-10-01' },
        { id: '2', type: 'Comprovante de Residência', status: 'PENDING', lastUpdate: '2023-11-15' },
        { id: '3', type: 'Contrato Social (PJ)', status: 'MISSING', lastUpdate: '-' },
    ]

    const handleUpload = async (type: string) => {
        setUploading(true)
        // Simulate upload
        await new Promise(r => setTimeout(r, 1500))
        toast.success(`Documento ${type} enviado para análise!`)
        setUploading(false)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Aprovado</Badge>
            case 'PENDING': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Em Análise</Badge>
            case 'MISSING': return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Pendente</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Meus Documentos</h1>
                <Button variant="outline">Atendimento / Ajuda</Button>
            </div>

            <div className="grid gap-4">
                {documents.map(doc => (
                    <Card key={doc.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{doc.type}</CardTitle>
                                    <CardDescription>Atualizado em: {doc.lastUpdate}</CardDescription>
                                </div>
                                {getStatusBadge(doc.status)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {doc.status !== 'APPROVED' && (
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor={`file-${doc.id}`}>Enviar Arquivo (PDF/JPG)</Label>
                                        <Input id={`file-${doc.id}`} type="file" disabled={uploading} />
                                    </div>
                                    <Button onClick={() => handleUpload(doc.type)} disabled={uploading}>
                                        <Upload className="mr-2 h-4 w-4" /> Enviar
                                    </Button>
                                </div>
                            )}
                            {doc.status === 'APPROVED' && (
                                <p className="text-sm text-green-600 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" /> Documento validado e aceito.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
