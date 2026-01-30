const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password) {
        console.error('ADMIN_EMAIL or ADMIN_PASSWORD not found in environment variables')
        process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash: hashedPassword,
            role: 'ADMIN',
            name: 'Admin Filip'
        },
        create: {
            email,
            passwordHash: hashedPassword,
            name: 'Admin Filip',
            role: 'ADMIN',
            tier: 'PREMIUM_PLUS'
        },
    })

    console.log({ user })
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
