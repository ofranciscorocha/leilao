export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { WhatsAppButton } from "@/components/public/whatsapp-button"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pátio Rocha Leilões',
  description: 'O melhor sistema de leilões do Brasil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <WhatsAppButton />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
