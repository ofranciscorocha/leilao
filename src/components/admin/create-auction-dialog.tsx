'use client'

import { useState } from "react"
import { createAuction } from "@/app/actions/auction"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { toast } from 'sonner'

export async function CreateAuctionDialog() {
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    async function onSubmit(formData: FormData) {
        setIsPending(true)
        const res = await createAuction(null, formData)
        setIsPending(false)

        if (res?.success) {
            toast.success(res.message)
            setOpen(false)
        } else {
            toast.error(res?.message || 'Something went wrong')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Auction</DialogTitle>
                    <DialogDescription>
                        Add a new auction to the platform.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" name="title" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea id="description" name="description" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">
                            Start Date
                        </Label>
                        <Input id="startDate" name="startDate" type="datetime-local" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">
                            End Date
                        </Label>
                        <Input id="endDate" name="endDate" type="datetime-local" className="col-span-3" required />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create Auction'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
