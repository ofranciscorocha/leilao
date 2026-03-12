'use client'
import { Construction } from "lucide-react"
import Link from 'next/link'
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
      <Construction className="h-16 w-16 mb-4 text-yellow-500" />
      <h1 className="text-2xl font-bold">Lists</h1>
      <p className="mt-2">Em desenvolvimento — em breve disponível.</p>
    </div>
  )
}
