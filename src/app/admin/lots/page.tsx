import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DeleteLotButton } from "@/components/admin/delete-lot-button"
import { CreateLotDialog } from "@/components/admin/create-lot-dialog"

export default async function LotsPage() {
    const lots = await prisma.lot.findMany({
        orderBy: { createdAt: 'desc' },
        include: { auction: true }
    })

    // Fetch only open or upcoming auctions to add lots to
    const activeAuctions = await prisma.auction.findMany({
        where: {
            status: { in: ['OPEN', 'UPCOMING'] }
        },
        select: { id: true, title: true }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Lots</h1>
                <CreateLotDialog auctions={activeAuctions} />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Auction</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No lots found. Add a lot to an active auction.
                                </TableCell>
                            </TableRow>
                        ) : (
                            lots.map((lot) => (
                                <TableRow key={lot.id}>
                                    <TableCell>
                                        {lot.imageUrl ? (
                                            <img src={lot.imageUrl} alt={lot.title} className="h-10 w-16 object-cover rounded" />
                                        ) : (
                                            <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{lot.title}</TableCell>
                                    <TableCell className="text-muted-foreground">{lot.auction.title}</TableCell>
                                    <TableCell>{formatCurrency(lot.startingPrice)}</TableCell>
                                    <TableCell>{formatDate(lot.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <DeleteLotButton id={lot.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
