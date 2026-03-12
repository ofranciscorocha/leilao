import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, company, linkedinUrl } = body

        if (!name) {
            return NextResponse.json({ error: 'Nome do lead é obrigatório' }, { status: 400 })
        }

        // Fetch RocketReach API key from SystemSettings
        let rocketreachApiKey: string | null = null
        try {
            const settings = await (prisma as any).systemSettings.findUnique({ where: { id: 'SETTINGS' } })
            rocketreachApiKey = settings?.rocketreachApiKey || null
        } catch {
            // DB not available
        }

        if (!rocketreachApiKey) {
            return NextResponse.json({
                error: 'Configure a chave RocketReach em Configurações > Lead Intelligence para buscar emails reais.',
                configured: false,
            }, { status: 402 })
        }

        // Build request payload
        const payload: Record<string, string> = { name }
        if (company) payload.current_employer = company
        if (linkedinUrl) payload.linkedin_url = linkedinUrl

        const rrRes = await fetch('https://api.rocketreach.co/api/v2/lookupProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': rocketreachApiKey,
            },
            body: JSON.stringify(payload),
        })

        if (!rrRes.ok) {
            const errText = await rrRes.text()
            console.error('RocketReach API error:', rrRes.status, errText)

            if (rrRes.status === 401 || rrRes.status === 403) {
                return NextResponse.json({ error: 'Chave RocketReach inválida ou sem créditos.' }, { status: 402 })
            }
            if (rrRes.status === 404) {
                return NextResponse.json({ email: null, confidence: 0, source: 'rocketreach', found: false })
            }

            return NextResponse.json({ error: `Erro RocketReach: ${rrRes.status}` }, { status: 502 })
        }

        const data = await rrRes.json()

        // Extract email from response
        // RocketReach v2 returns: { emails: [{ email, smtp_valid, ... }], ... }
        const emails: any[] = data.emails || []
        const bestEmail = emails.find((e: any) => e.smtp_valid === 'valid') || emails[0] || null

        if (!bestEmail) {
            return NextResponse.json({ email: null, confidence: 0, source: 'rocketreach', found: false })
        }

        return NextResponse.json({
            email: bestEmail.email,
            confidence: bestEmail.confidence || 75,
            source: 'rocketreach',
            found: true,
            allEmails: emails.map((e: any) => e.email),
        })
    } catch (error) {
        console.error('rocketreach route error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}
