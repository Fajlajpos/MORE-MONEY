const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

console.log('DB URL:', process.env.DATABASE_URL ? 'Found' : 'Missing')
console.log('Email:', process.env.ADMIN_EMAIL)
console.log('Password:', process.env.ADMIN_PASSWORD ? '****' : 'Missing')

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Connecting...')
        await prisma.$connect()
        console.log('Connected!')

        // Try to create user
        const hashedPassword = 'debug_hash_placeholder' // Skip bcrypt for now to isolate db

        const user = await prisma.user.upsert({
            where: { email: process.env.ADMIN_EMAIL },
            update: {},
            create: {
                email: process.env.ADMIN_EMAIL,
                passwordHash: hashedPassword,
                name: 'Debug Admin',
                role: 'ADMIN'
            }
        })
        console.log('User upserted:', user.email)

    } catch (e) {
        console.error('ERROR:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
