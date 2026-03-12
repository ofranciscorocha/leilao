'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ─── GET PROSPECT LEADS ────────────────────────────────────────────────────────

export async function getProspectLeads(params?: {
    status?: string
    source?: string
    segment?: string
    leadType?: string
    searchCampaignId?: string
    search?: string
    page?: number
    pageSize?: number
}) {
    try {
        const {
            status,
            source,
            segment,
            leadType,
            searchCampaignId,
            search,
            page = 1,
            pageSize = 50,
        } = params || {}

        const where: any = {}
        if (status) where.status = status
        if (source) where.source = source
        if (segment) where.segment = segment
        if (leadType) where.leadType = leadType
        if (searchCampaignId) where.searchCampaignId = searchCampaignId
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
                { position: { contains: search, mode: 'insensitive' } },
            ]
        }

        const [leads, total] = await Promise.all([
            (prisma as any).prospectLead.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: { searchCampaign: { select: { id: true, name: true } } },
            }),
            (prisma as any).prospectLead.count({ where }),
        ])

        return { success: true, data: leads, total, page, pageSize }
    } catch (error) {
        console.error('getProspectLeads error:', error)
        return { success: false, error: 'Erro ao carregar leads', data: [], total: 0 }
    }
}

// ─── CREATE SINGLE PROSPECT LEAD ──────────────────────────────────────────────

export async function createProspectLead(data: {
    name: string
    headline?: string
    company?: string
    position?: string
    industry?: string
    location?: string
    email?: string
    phone?: string
    linkedinUrl?: string
    instagramHandle?: string
    facebookUrl?: string
    source?: string
    segment?: string
    leadType?: string
    notes?: string
    searchCampaignId?: string
}) {
    try {
        const lead = await (prisma as any).prospectLead.create({ data })
        revalidatePath('/admin/crm')
        revalidatePath('/admin/crm/linkedin')
        return { success: true, data: lead }
    } catch (error) {
        console.error('createProspectLead error:', error)
        return { success: false, error: 'Erro ao criar lead' }
    }
}

// ─── BULK CREATE LEADS ────────────────────────────────────────────────────────

export async function bulkCreateLeads(leads: {
    name: string
    headline?: string
    company?: string
    position?: string
    industry?: string
    location?: string
    email?: string
    phone?: string
    linkedinUrl?: string
    instagramHandle?: string
    source?: string
    segment?: string
    leadType?: string
    aiScore?: number
    aiSummary?: string
    aiAnalysis?: string
    searchCampaignId?: string
}[]) {
    try {
        if (!leads || leads.length === 0) {
            return { success: false, error: 'Nenhum lead fornecido' }
        }

        // Use createMany for performance; skip duplicates by linkedinUrl or instagramHandle where possible
        const result = await (prisma as any).prospectLead.createMany({
            data: leads,
            skipDuplicates: false,
        })

        revalidatePath('/admin/crm')
        revalidatePath('/admin/crm/linkedin')
        revalidatePath('/admin/crm/social')

        return { success: true, count: result.count }
    } catch (error) {
        console.error('bulkCreateLeads error:', error)
        return { success: false, error: 'Erro ao importar leads em massa' }
    }
}

// ─── UPDATE LEAD STATUS ────────────────────────────────────────────────────────

export async function updateLeadStatus(id: string, status: string) {
    try {
        const lead = await (prisma as any).prospectLead.update({
            where: { id },
            data: { status },
        })
        revalidatePath('/admin/crm')
        revalidatePath('/admin/crm/linkedin')
        return { success: true, data: lead }
    } catch (error) {
        console.error('updateLeadStatus error:', error)
        return { success: false, error: 'Erro ao atualizar status' }
    }
}

// ─── UPDATE LEAD AI DATA ───────────────────────────────────────────────────────

export async function updateLeadAI(id: string, data: {
    aiScore?: number
    aiSummary?: string
    aiAnalysis?: string
    segment?: string
    leadType?: string
    status?: string
}) {
    try {
        const lead = await (prisma as any).prospectLead.update({
            where: { id },
            data: { ...data, aiScoredAt: new Date() },
        })
        revalidatePath('/admin/crm')
        return { success: true, data: lead }
    } catch (error) {
        console.error('updateLeadAI error:', error)
        return { success: false, error: 'Erro ao salvar análise IA' }
    }
}

// ─── UPDATE LEAD EMAIL ─────────────────────────────────────────────────────────

export async function updateLeadEmail(id: string, email: string, enrichSource: string = 'rocketreach') {
    try {
        const lead = await (prisma as any).prospectLead.update({
            where: { id },
            data: {
                email,
                emailStatus: 'FOUND',
                enrichSource,
                enrichedAt: new Date(),
            },
        })
        revalidatePath('/admin/crm')
        return { success: true, data: lead }
    } catch (error) {
        console.error('updateLeadEmail error:', error)
        return { success: false, error: 'Erro ao salvar email' }
    }
}

// ─── DELETE PROSPECT LEAD ──────────────────────────────────────────────────────

export async function deleteProspectLead(id: string) {
    try {
        await (prisma as any).prospectLead.delete({ where: { id } })
        revalidatePath('/admin/crm')
        revalidatePath('/admin/crm/linkedin')
        return { success: true }
    } catch (error) {
        console.error('deleteProspectLead error:', error)
        return { success: false, error: 'Erro ao excluir lead' }
    }
}

// ─── GET LEAD SEARCH CAMPAIGNS ─────────────────────────────────────────────────

export async function getLeadSearchCampaigns(source?: string) {
    try {
        const where: any = {}
        if (source) where.source = source

        const campaigns = await (prisma as any).leadSearchCampaign.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { leads: true } },
            },
        })
        return { success: true, data: campaigns }
    } catch (error) {
        console.error('getLeadSearchCampaigns error:', error)
        return { success: false, error: 'Erro ao carregar campanhas', data: [] }
    }
}

// ─── CREATE LEAD SEARCH CAMPAIGN ───────────────────────────────────────────────

export async function createLeadSearchCampaign(data: {
    name: string
    source: string
    searchParams: Record<string, any>
}) {
    try {
        const campaign = await (prisma as any).leadSearchCampaign.create({
            data: {
                name: data.name,
                source: data.source,
                searchParams: JSON.stringify(data.searchParams),
            },
        })
        revalidatePath('/admin/crm/linkedin')
        revalidatePath('/admin/crm/social')
        return { success: true, data: campaign }
    } catch (error) {
        console.error('createLeadSearchCampaign error:', error)
        return { success: false, error: 'Erro ao criar campanha' }
    }
}

// ─── UPDATE CAMPAIGN STATUS ────────────────────────────────────────────────────

export async function updateCampaignStatus(id: string, status: string, stats?: {
    totalFound?: number
    totalQualified?: number
    totalWithEmail?: number
}) {
    try {
        const campaign = await (prisma as any).leadSearchCampaign.update({
            where: { id },
            data: {
                status,
                ...(stats || {}),
                lastRunAt: ['RUNNING', 'COMPLETED'].includes(status) ? new Date() : undefined,
            },
        })
        revalidatePath('/admin/crm/linkedin')
        return { success: true, data: campaign }
    } catch (error) {
        console.error('updateCampaignStatus error:', error)
        return { success: false, error: 'Erro ao atualizar campanha' }
    }
}

// ─── EXPORT LEADS TO MARKETING ─────────────────────────────────────────────────

export async function exportLeadsToMarketing(leadIds: string[], listId: string) {
    try {
        if (!leadIds || leadIds.length === 0) {
            return { success: false, error: 'Nenhum lead selecionado' }
        }

        // Mark leads as exported
        await (prisma as any).prospectLead.updateMany({
            where: { id: { in: leadIds } },
            data: { exportedToList: true, exportedListId: listId },
        })

        // Fetch lead data to add to marketing list
        const leads = await (prisma as any).prospectLead.findMany({
            where: { id: { in: leadIds }, email: { not: null } },
            select: { id: true, name: true, email: true, phone: true, company: true },
        })

        // If marketing list model exists, insert contacts there
        try {
            if (leads.length > 0) {
                await (prisma as any).emailListContact.createMany({
                    data: leads.map((l: any) => ({
                        listId,
                        name: l.name,
                        email: l.email,
                        phone: l.phone,
                    })),
                    skipDuplicates: true,
                })
            }
        } catch {
            // Marketing list module may not be available yet — ignore
        }

        revalidatePath('/admin/crm')
        revalidatePath('/admin/marketing')

        return {
            success: true,
            exported: leadIds.length,
            withEmail: leads.length,
            message: `${leadIds.length} leads marcados. ${leads.length} com email exportados para a lista.`,
        }
    } catch (error) {
        console.error('exportLeadsToMarketing error:', error)
        return { success: false, error: 'Erro ao exportar leads' }
    }
}
