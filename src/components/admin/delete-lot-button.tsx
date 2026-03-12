'use client'

import { deleteLot } from "@/app/actions/lot"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from 'sonner'
import { useTransition } from "react"

export async function DeleteLotButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this lot?')) return

        startTransition(async () => {
            const res = await deleteLot(id)
            if (res.success) {
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
