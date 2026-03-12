import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { keywords = '', jobTitle = '', company = '', location = '', industry = '', pageNum = 0 } = body

        // Fetch SerpAPI key from SystemSettings
        let serpApiKey: string | null = null
        try {
            const settings = await (prisma as any).systemSettings.findUnique({ where: { id: 'SETTINGS' } })
            serpApiKey = settings?.serpApiKey || null
        } catch {
            // DB not available
        }

        if (!serpApiKey) {
            // Return mock structure with instruction message
            const mockLeads = buildMockLeads(jobTitle, company, location, industry)
            return NextResponse.json({
                leads: mockLeads,
                warning: 'Configure a chave SerpAPI em Configurações > Lead Intelligence para resultados reais do LinkedIn.',
                mock: true,
            })
        }

        // Build Google search query targeting LinkedIn profiles
        const parts: string[] = ['site:linkedin.com/in']
        if (jobTitle) parts.push(`"${jobTitle}"`)
        if (company) parts.push(`"${company}"`)
        if (location) parts.push(`"${location}"`)
        if (industry) parts.push(`"${industry}"`)
        if (keywords) parts.push(keywords)

        const q = parts.join(' ')
        const start = pageNum * 10

        const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(q)}&api_key=${serpApiKey}&num=10&start=${start}`

        const serpRes = await fetch(serpUrl, { next: { revalidate: 0 } })

        if (!serpRes.ok) {
            const errText = await serpRes.text()
            console.error('SerpAPI error:', errText)
            return NextResponse.json({ error: 'Erro ao chamar SerpAPI. Verifique sua chave.', leads: [] }, { status: 502 })
        }

        const serpData = await serpRes.json()
        const organicResults: any[] = serpData.organic_results || []

        const leads = organicResults.map((r: any) => {
            // Extract LinkedIn URL
            const linkedinUrl = r.link || ''

            // Parse name from title: usually "Name - Position - Company | LinkedIn" or "Name | LinkedIn"
            const titleRaw: string = r.title || ''
            const titleClean = titleRaw.replace(/\s?\|\s?LinkedIn$/i, '').trim()
            const titleParts = titleClean.split(' - ').map((s: string) => s.trim())

            const name = titleParts[0] || 'Desconhecido'
            const headline = titleParts.slice(1).join(' - ') || ''

            // Try to parse company and position from headline
            const headlineParts = headline.split(' at ').map((s: string) => s.trim())
            const position = headlineParts[0] || ''
            const companyFromHeadline = headlineParts[1] || company || ''

            // Snippet often has more context
            const snippet: string = r.snippet || ''

            // Try to extract location from snippet (often appears as "Location · X connections")
            const locationMatch = snippet.match(/([A-Za-záàâãéèêíóôõúç\s,]+)\s·\s\d+/)
            const extractedLocation = locationMatch ? locationMatch[1].trim() : location || ''

            return {
                name,
                headline,
                position,
                company: companyFromHeadline,
                location: extractedLocation,
                linkedinUrl,
                snippet,
            }
        })

        return NextResponse.json({ leads, total: serpData.search_information?.total_results || leads.length })
    } catch (error) {
        console.error('linkedin-search route error:', error)
        return NextResponse.json({ error: 'Erro interno do servidor', leads: [] }, { status: 500 })
    }
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

function buildMockLeads(jobTitle: string, company: string, location: string, industry: string) {
    const loc = location || 'São Paulo, SP'
    const comp = company || 'DETRAN-SP'
    const pos = jobTitle || 'Diretor de Patrimônio'
    const ind = industry || 'Governo'

    return [
        {
            name: 'Carlos Eduardo Mendes',
            headline: `${pos} · ${comp}`,
            position: pos,
            company: comp,
            location: loc,
            linkedinUrl: 'https://linkedin.com/in/exemplo1',
            snippet: `${pos} na ${comp}. ${ind}. ${loc} · 500+ conexões`,
            mock: true,
        },
        {
            name: 'Patrícia Oliveira Santos',
            headline: `Gestora de Contratos · ${comp}`,
            position: 'Gestora de Contratos',
            company: comp,
            location: loc,
            linkedinUrl: 'https://linkedin.com/in/exemplo2',
            snippet: `Gestora de Contratos na ${comp}. Especialista em licitações. ${loc}`,
            mock: true,
        },
        {
            name: 'Roberto Figueiredo Lima',
            headline: `Chefe do Setor de Veículos · ${comp}`,
            position: 'Chefe do Setor de Veículos',
            company: comp,
            location: loc,
            linkedinUrl: 'https://linkedin.com/in/exemplo3',
            snippet: `Gestão de frota e veículos apreendidos. ${comp}. ${loc} · 300+ conexões`,
            mock: true,
        },
        {
            name: 'Fernanda Costa Almeida',
            headline: `Coordenadora de Patrimônio · Prefeitura de ${loc.split(',')[0]}`,
            position: 'Coordenadora de Patrimônio',
            company: `Prefeitura de ${loc.split(',')[0]}`,
            location: loc,
            linkedinUrl: 'https://linkedin.com/in/exemplo4',
            snippet: `Coordenação de bens públicos e licitações. ${ind}. ${loc}`,
            mock: true,
        },
        {
            name: 'André Martins Souza',
            headline: `Diretor Financeiro · Transportes ${ind} Ltda`,
            position: 'Diretor Financeiro',
            company: `Transportes ${ind} Ltda`,
            location: loc,
            linkedinUrl: 'https://linkedin.com/in/exemplo5',
            snippet: `Gestão financeira e frotas corporativas. ${loc} · 1.000+ conexões`,
            mock: true,
        },
    ]
}
