'use client';

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-[#D4AF37] hover:bg-[#b8962f] text-[#1a2332] px-5 py-2 rounded font-bold text-sm transition-colors"
        >
            🖨️ Imprimir Laudo
        </button>
    );
}
