'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getDiaryEvents(year?: number, month?: number) {
  const p = prisma as any
  const where: any = {}
  if (year !== undefined && month !== undefined) {
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0, 23, 59, 59)
    where.startDate = { gte: start, lte: end }
  }
  return p.diaryEvent.findMany({ where, orderBy: { startDate: 'asc' } })
}

export async function createDiaryEvent(data: {
  title: string
  description?: string
  startDate: string
  endDate?: string
  allDay?: boolean
  color?: string
  priority?: string
  label?: string
  type?: string
  recurrence?: string
}) {
  await (prisma as any).diaryEvent.create({
    data: {
      title: data.title,
      description: data.description || null,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      allDay: data.allDay ?? false,
      color: data.color || '#3c8dbc',
      priority: data.priority || 'NORMAL',
      label: data.label || null,
      type: data.type || 'TASK',
      recurrence: data.recurrence || null,
    }
  })
  revalidatePath('/admin/diary')
}

export async function updateDiaryEvent(id: string, data: {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  allDay?: boolean
  color?: string
  priority?: string
  label?: string
  type?: string
  recurrence?: string
  completed?: boolean
}) {
  const update: any = { ...data }
  if (data.startDate) update.startDate = new Date(data.startDate)
  if (data.endDate) update.endDate = new Date(data.endDate)
  delete update.startDate
  delete update.endDate
  if (data.startDate) update.startDate = new Date(data.startDate)
  if (data.endDate !== undefined) update.endDate = data.endDate ? new Date(data.endDate) : null

  await (prisma as any).diaryEvent.update({ where: { id }, data: update })
  revalidatePath('/admin/diary')
}

export async function toggleDiaryEvent(id: string, completed: boolean) {
  await (prisma as any).diaryEvent.update({ where: { id }, data: { completed } })
  revalidatePath('/admin/diary')
}

export async function deleteDiaryEvent(id: string) {
  await (prisma as any).diaryEvent.delete({ where: { id } })
  revalidatePath('/admin/diary')
}
