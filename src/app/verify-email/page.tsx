'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
    const [verified, setVerified] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-blue-100 p-4 rounded-full w-fit mb-4">
                        {verified ? <CheckCircle className="h-8 w-8 text-green-600" /> : <Mail className="h-8 w-8 text-blue-600" />}
                    </div>
                    <CardTitle className="text-2xl">{verified ? 'Email Verificado!' : 'Verifique seu Email'}</CardTitle>
                    <CardDescription>
                        {verified
                            ? 'Sua conta foi ativada com sucesso.'
                            : 'Enviamos um link de confirmação para seu email.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!verified ? (
                        <>
                            <p className="text-sm text-gray-500">
                                Para fins de demonstração, clique no botão abaixo para simular a verificação.
                            </p>
                            <Button className="w-full" onClick={() => setVerified(true)}>
                                Simular Verificação (Link do Email)
                            </Button>
                        </>
                    ) : (
                        <Link href="/admin/login">
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                Ir para Login
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
