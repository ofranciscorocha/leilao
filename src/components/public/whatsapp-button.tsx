'use client'

import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group"
            aria-label="Fale conosco no WhatsApp"
        >
            <MessageCircle className="h-8 w-8" />
            <span className="absolute right-full mr-4 bg-white text-gray-800 px-3 py-1 rounded shadow-md text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Fale Conosco
            </span>
        </a>
    )
}
