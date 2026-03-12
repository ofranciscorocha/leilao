'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ─── EMAIL ACCOUNTS ───────────────────────────────────────────────

export async function getEmailAccounts() {
    try {
        const accounts = await (prisma as any).emailAccount.findMany({
            orderBy: { createdAt: 'asc' },
            include: {
                _count: { select: { emails: true } }
            }
        })
        return { success: true, data: accounts }
    } catch (error) {
        console.error('getEmailAccounts error:', error)
        return { success: false, error: 'Erro ao buscar contas de email.' }
    }
}

export async function createEmailAccount(data: {
    name: string
    email: string
    provider: string
    imapHost?: string
    imapPort?: number
    imapSecure?: boolean
    smtpHost?: string
    smtpPort?: number
    smtpSecure?: boolean
    username?: string
    password?: string
    active?: boolean
}) {
    try {
        const account = await (prisma as any).emailAccount.create({
            data: {
                name: data.name,
                email: data.email,
                provider: data.provider,
                imapHost: data.imapHost || null,
                imapPort: data.imapPort ? Number(data.imapPort) : 993,
                imapSecure: data.imapSecure ?? true,
                smtpHost: data.smtpHost || null,
                smtpPort: data.smtpPort ? Number(data.smtpPort) : 587,
                smtpSecure: data.smtpSecure ?? false,
                username: data.username || null,
                password: data.password || null,
                active: data.active ?? true,
            }
        })
        revalidatePath('/admin/email')
        revalidatePath('/admin/email/accounts')
        return { success: true, data: account }
    } catch (error: any) {
        console.error('createEmailAccount error:', error)
        if (error?.code === 'P2002') {
            return { success: false, error: 'Este endereço de email já está cadastrado.' }
        }
        return { success: false, error: 'Erro ao criar conta de email.' }
    }
}

export async function updateEmailAccount(id: string, data: Partial<{
    name: string
    email: string
    provider: string
    imapHost: string
    imapPort: number
    imapSecure: boolean
    smtpHost: string
    smtpPort: number
    smtpSecure: boolean
    username: string
    password: string
    active: boolean
}>) {
    try {
        const updated = await (prisma as any).emailAccount.update({
            where: { id },
            data: {
                ...data,
                imapPort: data.imapPort ? Number(data.imapPort) : undefined,
                smtpPort: data.smtpPort ? Number(data.smtpPort) : undefined,
            }
        })
        revalidatePath('/admin/email')
        revalidatePath('/admin/email/accounts')
        return { success: true, data: updated }
    } catch (error) {
        console.error('updateEmailAccount error:', error)
        return { success: false, error: 'Erro ao atualizar conta de email.' }
    }
}

export async function deleteEmailAccount(id: string) {
    try {
        await (prisma as any).emailAccount.delete({ where: { id } })
        revalidatePath('/admin/email')
        revalidatePath('/admin/email/accounts')
        return { success: true }
    } catch (error) {
        console.error('deleteEmailAccount error:', error)
        return { success: false, error: 'Erro ao excluir conta de email.' }
    }
}

// ─── EMAIL MESSAGES ───────────────────────────────────────────────

export async function getEmails(params?: {
    accountId?: string
    folder?: string
    search?: string
    onlyUnread?: boolean
    onlyStarred?: boolean
    category?: string
    limit?: number
    offset?: number
}) {
    try {
        const where: any = { isArchived: false }

        if (params?.accountId) where.accountId = params.accountId
        if (params?.folder) where.folder = params.folder
        if (params?.onlyUnread) where.isRead = false
        if (params?.onlyStarred) where.isStarred = true
        if (params?.category) where.aiCategory = params.category

        if (params?.search) {
            where.OR = [
                { subject: { contains: params.search, mode: 'insensitive' } },
                { fromEmail: { contains: params.search, mode: 'insensitive' } },
                { fromName: { contains: params.search, mode: 'insensitive' } },
                { bodyText: { contains: params.search, mode: 'insensitive' } },
            ]
        }

        const [emails, total] = await Promise.all([
            (prisma as any).emailMessage.findMany({
                where,
                orderBy: { receivedAt: 'desc' },
                take: params?.limit || 50,
                skip: params?.offset || 0,
                include: {
                    account: { select: { name: true, email: true } },
                    attachments: { select: { id: true, filename: true, size: true } },
                }
            }),
            (prisma as any).emailMessage.count({ where })
        ])

        return { success: true, data: emails, total }
    } catch (error) {
        console.error('getEmails error:', error)
        return { success: false, error: 'Erro ao buscar emails.', data: [], total: 0 }
    }
}

export async function getEmailById(id: string) {
    try {
        const email = await (prisma as any).emailMessage.findUnique({
            where: { id },
            include: {
                account: true,
                attachments: true,
            }
        })
        if (!email) return { success: false, error: 'Email não encontrado.' }
        return { success: true, data: email }
    } catch (error) {
        console.error('getEmailById error:', error)
        return { success: false, error: 'Erro ao buscar email.' }
    }
}

export async function markEmailRead(id: string, isRead: boolean = true) {
    try {
        await (prisma as any).emailMessage.update({
            where: { id },
            data: { isRead }
        })
        revalidatePath('/admin/email')
        return { success: true }
    } catch (error) {
        console.error('markEmailRead error:', error)
        return { success: false, error: 'Erro ao marcar email.' }
    }
}

export async function starEmail(id: string, starred: boolean) {
    try {
        await (prisma as any).emailMessage.update({
            where: { id },
            data: { isStarred: starred }
        })
        revalidatePath('/admin/email')
        return { success: true }
    } catch (error) {
        console.error('starEmail error:', error)
        return { success: false, error: 'Erro ao favoritar email.' }
    }
}

export async function archiveEmail(id: string) {
    try {
        await (prisma as any).emailMessage.update({
            where: { id },
            data: { isArchived: true }
        })
        revalidatePath('/admin/email')
        return { success: true }
    } catch (error) {
        console.error('archiveEmail error:', error)
        return { success: false, error: 'Erro ao arquivar email.' }
    }
}

export async function deleteEmail(id: string) {
    try {
        await (prisma as any).emailMessage.delete({ where: { id } })
        revalidatePath('/admin/email')
        return { success: true }
    } catch (error) {
        console.error('deleteEmail error:', error)
        return { success: false, error: 'Erro ao excluir email.' }
    }
}

export async function syncEmails(accountId: string) {
    try {
        // Placeholder: marks sync as attempted and updates lastSyncAt
        await (prisma as any).emailAccount.update({
            where: { id: accountId },
            data: { lastSyncAt: new Date() }
        })
        revalidatePath('/admin/email')
        return {
            success: true,
            synced: 0,
            message: 'Sincronização iniciada. Para sincronização IMAP completa, configure o servidor via /api/email/sync.'
        }
    } catch (error) {
        console.error('syncEmails error:', error)
        return { success: false, error: 'Erro ao sincronizar emails.' }
    }
}

// ─── DRAFTS ───────────────────────────────────────────────────────

export async function saveDraft(data: {
    accountId?: string
    toEmails: string[]
    ccEmails?: string[]
    subject: string
    bodyHtml: string
    replyToId?: string
}) {
    try {
        const draft = await (prisma as any).emailDraft.create({
            data: {
                accountId: data.accountId || null,
                toEmails: JSON.stringify(data.toEmails),
                ccEmails: data.ccEmails ? JSON.stringify(data.ccEmails) : null,
                subject: data.subject,
                bodyHtml: data.bodyHtml,
                replyToId: data.replyToId || null,
                status: 'DRAFT',
            }
        })
        revalidatePath('/admin/email')
        return { success: true, data: draft }
    } catch (error) {
        console.error('saveDraft error:', error)
        return { success: false, error: 'Erro ao salvar rascunho.' }
    }
}

export async function getDrafts() {
    try {
        const drafts = await (prisma as any).emailDraft.findMany({
            where: { status: 'DRAFT' },
            orderBy: { updatedAt: 'desc' }
        })
        return { success: true, data: drafts }
    } catch (error) {
        console.error('getDrafts error:', error)
        return { success: false, data: [], error: 'Erro ao buscar rascunhos.' }
    }
}

// ─── AI DOCUMENTS ────────────────────────────────────────────────

export async function getDocuments(limit = 50) {
    try {
        const docs = await (prisma as any).aiGeneratedDocument.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        })
        return { success: true, data: docs }
    } catch (error) {
        console.error('getDocuments error:', error)
        return { success: false, data: [], error: 'Erro ao buscar documentos.' }
    }
}

export async function saveDocument(data: {
    title: string
    type: string
    content: string
    emailId?: string
    prompt?: string
}) {
    try {
        const doc = await (prisma as any).aiGeneratedDocument.create({
            data: {
                title: data.title,
                type: data.type,
                content: data.content,
                emailId: data.emailId || null,
                prompt: data.prompt || null,
            }
        })
        revalidatePath('/admin/email')
        return { success: true, data: doc }
    } catch (error) {
        console.error('saveDocument error:', error)
        return { success: false, error: 'Erro ao salvar documento.' }
    }
}

export async function deleteDocument(id: string) {
    try {
        await (prisma as any).aiGeneratedDocument.delete({ where: { id } })
        revalidatePath('/admin/email')
        return { success: true }
    } catch (error) {
        console.error('deleteDocument error:', error)
        return { success: false, error: 'Erro ao excluir documento.' }
    }
}

// ─── AI: Update email with analysis results ───────────────────────

export async function updateEmailAiAnalysis(id: string, analysis: {
    aiSummary?: string
    aiCategory?: string
    aiPriority?: string
    aiSuggestedReply?: string
}) {
    try {
        await (prisma as any).emailMessage.update({
            where: { id },
            data: {
                ...analysis,
                aiAnalyzedAt: new Date(),
            }
        })
        revalidatePath('/admin/email')
        return { success: true }
    } catch (error) {
        console.error('updateEmailAiAnalysis error:', error)
        return { success: false, error: 'Erro ao salvar análise.' }
    }
}

// ─── STATS ────────────────────────────────────────────────────────

export async function getEmailStats() {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const [total, unread, todayCount, pendingAi, starred] = await Promise.all([
            (prisma as any).emailMessage.count({ where: { isArchived: false } }),
            (prisma as any).emailMessage.count({ where: { isRead: false, isArchived: false } }),
            (prisma as any).emailMessage.count({ where: { receivedAt: { gte: today }, isArchived: false } }),
            (prisma as any).emailMessage.count({ where: { aiAnalyzedAt: null, isArchived: false } }),
            (prisma as any).emailMessage.count({ where: { isStarred: true, isArchived: false } }),
        ])

        return { success: true, data: { total, unread, todayCount, pendingAi, starred } }
    } catch (error) {
        console.error('getEmailStats error:', error)
        return { success: false, data: { total: 0, unread: 0, todayCount: 0, pendingAi: 0, starred: 0 } }
    }
}
