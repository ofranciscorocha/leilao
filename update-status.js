const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find the TRANSALVADOR auction
    const auction = await prisma.auction.findFirst({
        where: { title: 'Leilão de Sucatas Aproveitáveis' },
        orderBy: { createdAt: 'desc' }
    });

    if (!auction) {
        console.log('❌ Leilão não encontrado!');
        return;
    }

    console.log(`📦 Atualizando leilão: ${auction.id} - ${auction.title}`);

    // Update auction to ACTIVE
    await prisma.auction.update({
        where: { id: auction.id },
        data: { status: 'ACTIVE' }
    });
    console.log('✅ Leilão atualizado para ACTIVE');

    // Update all lots to OPEN
    const result = await prisma.lot.updateMany({
        where: { auctionId: auction.id },
        data: { status: 'OPEN' }
    });
    console.log(`✅ ${result.count} lotes atualizados para OPEN`);
    console.log('\n🔗 Acesse: http://localhost:3002');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
