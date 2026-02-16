import { prisma } from '../src/lib/prisma'

async function main() {
    // Create an active auction
    const auction = await prisma.auction.create({
        data: {
            title: 'Leilão de Veículos Recuperados - SP',
            description: 'Grande oportunidade de veículos recuperados de financiamento. Diversas marcas e modelos.',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'OPEN',
            imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2070', // Sample car image
            lots: {
                create: [
                    {
                        title: 'Chevrolet Onix 2020 1.0 Flex',
                        description: 'Veículo em bom estado. Pequenos riscos na lataria. Motor funcionando.',
                        startingPrice: 25000,
                        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070',
                    },
                    {
                        title: 'Volkswagen Gol 2019 1.6 MSI',
                        description: 'Veículo de frota. Quilometragem alta. Necesita revisão.',
                        startingPrice: 18000,
                        imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=2070',
                    },
                    {
                        title: 'Toyota Corolla 2021 XEi',
                        description: 'Sinistro média monta. Airbags acionados.',
                        startingPrice: 45000,
                        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=2070',
                    }
                ]
            }
        }
    })

    console.log(`Created auction with id: ${auction.id}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
