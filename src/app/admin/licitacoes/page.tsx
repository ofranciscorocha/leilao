import { getLicitacoes } from "@/app/actions/licitacoes"
import LicitacoesClient from "./licitacoesclient"

export const dynamic = 'force-dynamic'

export default async function LicitacoesPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string }
}) {
  const items = await getLicitacoes(searchParams.q, searchParams.status)
  return <LicitacoesClient initialItems={items} />
}
