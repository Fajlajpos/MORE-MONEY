const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:admin@127.0.0.1:5432/MAKE_MONEY?schema=public"
        }
    }
})

async function main() {
    console.log('Starting minimal seed...')
    try {
        // Simple hash to avoid bcrypt dependency issues
        const hashedPassword = '$2a$12$eXgZ/somehash'
        const email = 'filipmayer7@gmail.com'

        console.log('Upserting user...')
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
        console.log('User created/updated:', user)
    } catch (e) {
        console.error('ERROR:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
