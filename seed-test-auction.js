const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const auction = await prisma.auction.create({
        data: {
            title: 'Leilão Teste - Pátio Rocha',
            summary: 'Leilão de teste da nova plataforma Gleam',
            biddingStart: new Date(),
            startDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            status: 'OPEN',
            type: 'ONLINE',
            modalidade: 'EXTRAJUDICIAL',
            singleComitente: false,
            hideDates: false,
            enableGuestBids: true,
            audienceRestriction: 'ALL',
            requireLogin: false,
            lots: {
                create: [
                    {
                        lotNumber: 1,
                        title: 'Veículo Teste 01',
                        status: 'OPEN',
                        category: 'VEICULO',
                        startingPrice: 15000,
                        incrementAmount: 500,
                        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
                    },
                    {
                        lotNumber: 2,
                        title: 'Imóvel Teste 02',
                        status: 'OPEN',
                        category: 'IMOVEL',
                        startingPrice: 350000,
                        incrementAmount: 1000,
                        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
                    }
                ]
            }
        }
    });

    console.log('Auction created:', auction.id);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
