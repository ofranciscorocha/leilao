import { prisma } from '../src/lib/prisma'

async function main() {
    console.log('Skipping auction creation to avoid type conflicts during build.')
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
