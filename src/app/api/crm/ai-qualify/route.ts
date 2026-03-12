import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

interface LeadInput {
    name: string
    headline?: string
    company?: string
    position?: string
    industry?: string
    location?: string
    source?: string
    snippet?: string
}

interface AIQualification {
    score: number
    segment: 'B2B' | 'B2C'
    leadType: 'ARREMATANTE' | 'COMITENTE' | 'PARCEIRO' | 'PROSPECT_B2B'
    summary: string
    approach: string
    tags: string[]
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { leads }: { leadId?: string; leads: LeadInput[] } = body

        if (!leads || leads.length === 0) {
            return NextResponse.json({ error: 'Nenhum lead fornecido para análise' }, { status: 400 })
        }

        // Fetch OpenAI key from SystemSettings
        let openaiApiKey: string | null = null
        let openaiModel = 'gpt-4o'
        try {
            const settings = await (prisma as any).systemSettings.findUnique({ where: { id: 'SETTINGS' } })
            openaiApiKey = settings?.openaiApiKey || null
            openaiModel = settings?.openaiModel || 'gpt-4o'
        } catch {
            // DB not available
        }

        if (!openaiApiKey) {
            // Return rule-based qualification as fallback
            const results = leads.map(lead => ruleBasedQualify(lead))
            return NextResponse.json({
                results,
                warning: 'Configure a chave OpenAI em Configurações > IA para qualificação por GPT-4.',
                mock: true,
            })
        }

        // Qualify all leads — batch into one call if multiple, or individually
        const results: AIQualification[] = []

        for (const lead of leads) {
            try {
                const qualification = await qualifyWithOpenAI(lead, openaiApiKey, openaiModel)
                results.push(qualification)
            } catch (err) {
                console.error('AI qualify error for lead:', lead.name, err)
                // Fallback to rule-based for this lead
                results.push(ruleBasedQualify(lead))
            }
        }

        return NextResponse.json({ results })
    } catch (error) {
        console.error('ai-qualify route error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

// ─── OPENAI QUALIFICATION ──────────────────────────────────────────────────────

async function qualifyWithOpenAI(lead: LeadInput, apiKey: string, model: string): Promise<AIQualification> {
    const systemPrompt = `Você é um analista de negócios do Pátio Rocha Leilões, um leiloeiro oficial de veículos localizado em São Paulo, Brasil. Sua missão é qualificar leads para o leilão.

CONTEXTO DO NEGÓCIO:
- Comitentes (B2B): Organizações que consignam veículos para leilão. Alvos prioritários: DETRAN, Tribunais de Justiça, Prefeituras, Polícia Militar, Receita Federal, Corpo de Bombeiros, empresas com frotas (locadoras, transportadoras, bancos, financeiras, seguradoras, despachantes).
- Arrematantes (B2C): Compradores que participam dos leilões. Alvos: mecânicos, revendedores de veículos, compradores individuais, pessoas interessadas em veículos a preço abaixo do mercado.
- Parceiros: Despachantes, advogados de licitações, consultores de frota.

Analise o lead e responda SOMENTE em JSON válido, sem markdown, sem texto extra.`

    const userPrompt = `Analise este lead e retorne um JSON com: score (0-100), segment ('B2B' ou 'B2C'), leadType ('ARREMATANTE', 'COMITENTE', 'PARCEIRO' ou 'PROSPECT_B2B'), summary (texto breve em português, max 100 chars), approach (mensagem de primeiro contato sugerida em português, max 200 chars), tags (array de strings).

Lead:
${JSON.stringify(lead, null, 2)}

Retorne apenas o JSON, sem markdown.`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            temperature: 0.3,
            max_tokens: 400,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        }),
    })

    if (!res.ok) {
        const errText = await res.text()
        throw new Error(`OpenAI error ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content?.trim() || ''

    try {
        return JSON.parse(content) as AIQualification
    } catch {
        // If JSON parse fails, extract from text
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) return JSON.parse(jsonMatch[0]) as AIQualification
        throw new Error('Failed to parse OpenAI JSON response')
    }
}

// ─── RULE-BASED FALLBACK ───────────────────────────────────────────────────────

function ruleBasedQualify(lead: LeadInput): AIQualification {
    const text = [lead.name, lead.headline, lead.company, lead.position, lead.industry].join(' ').toLowerCase()

    // B2B high-value government/corporate indicators
    const b2bKeywords = ['detran', 'tribunal', 'prefeitura', 'pm ', 'polícia', 'policia', 'receita federal', 'corpo de bombeiros', 'bombeiros', 'município', 'municipio', 'governo', 'secretaria', 'tj-', 'tjsp', 'ministério', 'ministerio']
    const fleetKeywords = ['frota', 'locadora', 'transportadora', 'seguradora', 'financeira', 'banco', 'leasing', 'fleet']
    const b2cKeywords = ['mecânico', 'mecanico', 'revendedor', 'despachante', 'leilão', 'leilao', 'automóvel', 'automovel', 'veículo', 'veiculo']
    const partnerKeywords = ['despachante', 'licitação', 'licitacao', 'advogado', 'consultor', 'procurement']

    const isGovernment = b2bKeywords.some(k => text.includes(k))
    const isFleet = fleetKeywords.some(k => text.includes(k))
    const isB2C = b2cKeywords.some(k => text.includes(k))
    const isPartner = partnerKeywords.some(k => text.includes(k))

    let score = 30
    let segment: 'B2B' | 'B2C' = 'B2B'
    let leadType: AIQualification['leadType'] = 'PROSPECT_B2B'
    let summary = 'Lead identificado para qualificação inicial.'
    let approach = 'Olá! Encontrei seu perfil e gostaria de apresentar o Pátio Rocha Leilões.'
    const tags: string[] = []

    if (isGovernment) {
        score = 90
        segment = 'B2B'
        leadType = 'COMITENTE'
        summary = 'Órgão público — alto potencial para consignação de veículos.'
        approach = `Olá! Sou do Pátio Rocha Leilões. Trabalhamos com ${lead.company || 'órgãos públicos'} para leilões de veículos apreendidos/sucateados. Posso enviar nossa apresentação?`
        tags.push('governo', 'comitente', 'b2b', 'prioridade-alta')
    } else if (isFleet) {
        score = 80
        segment = 'B2B'
        leadType = 'COMITENTE'
        summary = 'Empresa com frota — potencial comitente corporativo.'
        approach = `Olá ${lead.name?.split(' ')[0]}! Trabalhamos com empresas de frota para leilões de renovação. Posso compartilhar como funciona?`
        tags.push('frota', 'corporativo', 'comitente')
    } else if (isPartner) {
        score = 70
        segment = 'B2B'
        leadType = 'PARCEIRO'
        summary = 'Perfil de parceiro estratégico — despachante/consultor.'
        approach = `Olá! Vi seu perfil e acredito que podemos ter uma parceria interessante com o Pátio Rocha Leilões.`
        tags.push('parceiro', 'despachante')
    } else if (isB2C) {
        score = 60
        segment = 'B2C'
        leadType = 'ARREMATANTE'
        summary = 'Potencial arrematante — interesse em veículos.'
        approach = `Olá! Temos leilões de veículos com ótimas oportunidades. Gostaria de receber nossas ofertas?`
        tags.push('arrematante', 'b2c')
    } else {
        score = 35
        tags.push('prospect', 'qualificar')
    }

    return { score, segment, leadType, summary, approach, tags }
}
