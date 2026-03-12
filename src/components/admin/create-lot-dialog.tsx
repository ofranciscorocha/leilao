'use client'

import { useState } from "react"
import { createLot } from "@/app/actions/lot"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from 'sonner'
import { useTransition } from "react"

type AuctionSelect = {
    id: string
    title: string
}

export async function CreateLotDialog({ auctions }: { auctions: AuctionSelect[] }) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    async function onSubmit(formData: FormData) {
        startTransition(async () => {
            const res = await createLot(null, formData)

            if (res?.success) {
                toast.success(res.message)
                setOpen(false)
            } else {
                toast.error(res?.message || 'Something went wrong')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Lot
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Lot</DialogTitle>
                    <DialogDescription>
                        Add a vehicle or item to an auction.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="auctionId" className="text-right">
                            Auction
                        </Label>
                        <Select name="auctionId" required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select an auction" />
                            </SelectTrigger>
                            <SelectContent>
                                {auctions.map((auction) => (
                                    <SelectItem key={auction.id} value={auction.id}>
                                        {auction.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lotNumber" className="text-right">
                            Lot #
                        </Label>
                        <Input id="lotNumber" name="lotNumber" type="number" className="col-span-3" placeholder="e.g. 1" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" name="title" className="col-span-3" placeholder="e.g. 2020 Toyota Corolla" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea id="description" name="description" className="col-span-3" placeholder="Condition, details, etc." />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startingPrice" className="text-right">
                            Start Price
                        </Label>
                        <Input id="startingPrice" name="startingPrice" type="number" step="0.01" className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incrementAmount" className="text-right">
                            Increment
                        </Label>
                        <Input id="incrementAmount" name="incrementAmount" type="number" step="0.01" defaultValue="50" className="col-span-3" required />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="imageUrl" className="text-right">
                            Image URL
                        </Label>
                        <Input id="imageUrl" name="imageUrl" type="url" className="col-span-3" placeholder="https://..." />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>{isPending ? 'Adding...' : 'Add Lot'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
