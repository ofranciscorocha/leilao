import { getDiaryEvents } from '@/app/actions/diary'
import DiaryClient from './DiaryClient'

export const dynamic = 'force-dynamic'

export default async function DiaryPage() {
    const events = await getDiaryEvents()
    return <DiaryClient initialEvents={events} />
}
