'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const p = () => prisma as any

// ─── CONTACTS ────────────────────────────────────────────────────────────────

export async function getCrmContacts(search?: string, stage?: string, type?: string) {
  const where: any = {}
  if (stage) where.stage = stage
  if (type) where.type = type
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ]
  }
  return p().crmContact.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { activities: true } } },
  })
}

export async function createCrmContact(data: FormData) {
  const estimatedValue = parseFloat(data.get('estimatedValue') as string)
  await p().crmContact.create({
    data: {
      name: data.get('name') as string,
      email: (data.get('email') as string) || null,
      phone: (data.get('phone') as string) || null,
      mobile: (data.get('mobile') as string) || null,
      company: (data.get('company') as string) || null,
      position: (data.get('position') as string) || null,
      linkedinUrl: (data.get('linkedinUrl') as string) || null,
      type: (data.get('type') as string) || 'LEAD',
      source: (data.get('source') as string) || null,
      tags: (data.get('tags') as string) || null,
      stage: (data.get('stage') as string) || 'NOVO',
      priority: (data.get('priority') as string) || 'NORMAL',
      estimatedValue: !isNaN(estimatedValue) ? estimatedValue : null,
      notes: (data.get('notes') as string) || null,
    },
  })
  revalidatePath('/admin/crm')
  revalidatePath('/admin/crm/contacts')
}

export async function updateCrmContact(id: string, data: FormData) {
  const estimatedValue = parseFloat(data.get('estimatedValue') as string)
  await p().crmContact.update({
    where: { id },
    data: {
      name: data.get('name') as string,
      email: (data.get('email') as string) || null,
      phone: (data.get('phone') as string) || null,
      mobile: (data.get('mobile') as string) || null,
      company: (data.get('company') as string) || null,
      position: (data.get('position') as string) || null,
      linkedinUrl: (data.get('linkedinUrl') as string) || null,
      type: (data.get('type') as string) || 'LEAD',
      source: (data.get('source') as string) || null,
      tags: (data.get('tags') as string) || null,
      stage: (data.get('stage') as string) || 'NOVO',
      priority: (data.get('priority') as string) || 'NORMAL',
      estimatedValue: !isNaN(estimatedValue) ? estimatedValue : null,
      notes: (data.get('notes') as string) || null,
    },
  })
  revalidatePath('/admin/crm')
  revalidatePath('/admin/crm/contacts')
}

export async function deleteCrmContact(id: string) {
  await p().crmContact.delete({ where: { id } })
  revalidatePath('/admin/crm')
  revalidatePath('/admin/crm/contacts')
}

export async function moveCrmContact(id: string, stage: string) {
  await p().crmContact.update({ where: { id }, data: { stage } })
  revalidatePath('/admin/crm')
}

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────

export async function getCrmActivities(contactId?: string) {
  const where: any = {}
  if (contactId) where.contactId = contactId
  return p().crmActivity.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { contact: { select: { id: true, name: true, company: true } } },
  })
}

export async function createCrmActivity(data: FormData) {
  const dueDate = data.get('dueDate') as string
  await p().crmActivity.create({
    data: {
      contactId: data.get('contactId') as string,
      type: (data.get('type') as string) || 'NOTE',
      title: data.get('title') as string,
      description: (data.get('description') as string) || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })
  revalidatePath('/admin/crm/activities')
}

export async function completeCrmActivity(id: string) {
  await p().crmActivity.update({ where: { id }, data: { completed: true } })
  revalidatePath('/admin/crm/activities')
}

export async function deleteCrmActivity(id: string) {
  await p().crmActivity.delete({ where: { id } })
  revalidatePath('/admin/crm/activities')
}
