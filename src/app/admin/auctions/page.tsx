import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DeleteAuctionButton } from '@/components/admin/delete-auction-button'
import { CreateAuctionDialog } from '@/components/admin/create-auction-dialog'

export default async function AuctionsPage() {
    const auctions = await prisma.auction.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { lots: true } } }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Auctions</h1>
                <CreateAuctionDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Lots</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auctions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No auctions found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            auctions.map((auction) => (
                                <TableRow key={auction.id}>
                                    <TableCell className="font-medium">{auction.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={auction.status === 'OPEN' ? 'default' : 'secondary'}>
                                            {auction.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{auction._count.lots}</TableCell>
                                    <TableCell>{formatDate(auction.startDate)}</TableCell>
                                    <TableCell>{formatDate(auction.endDate)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/admin/auctions/${auction.id}`}>
                                                Manage
                                            </Link>
                                        </Button>
                                        <DeleteAuctionButton id={auction.id} />
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
