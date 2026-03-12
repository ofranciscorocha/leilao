import { getCrmContacts } from '@/app/actions/crm'
import CrmContactsClient from './CrmContactsClient'

export const dynamic = 'force-dynamic'

export default async function CrmContactsPage({
  searchParams,
}: {
  searchParams: { q?: string; stage?: string; type?: string }
}) {
  const contacts = await getCrmContacts(searchParams.q, searchParams.stage, searchParams.type)
  return <CrmContactsClient initialContacts={contacts} />
}
