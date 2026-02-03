const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:admin@127.0.0.1:5432/MAKE_MONEY?schema=public"
        }
    }
})

async function main() {
    const email = 'filipmayer7@gmail.com'
    const password = 'Nevimnevim16'

    console.log(`[TEST] Check login for: ${email}`)

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            console.log('[TEST] User NOT FOUND in database.')
            return
        }

        console.log('[TEST] User FOUND.')
        console.log(`[TEST] Stored Hash: ${user.passwordHash}`)

        if (!user.passwordHash) {
            console.log('[TEST] User has NO password hash.')
            return
        }

        console.log(`[TEST] Comparing password "${password}" with hash...`)
        const match = await bcrypt.compare(password, user.passwordHash)

        if (match) {
            console.log('[TEST] SUCCESS: Password matches!')
        } else {
            console.log('[TEST] FAILURE: Password does NOT match.')

            // Generate what the hash should be approximately (salt differs every time)
            const newHash = await bcrypt.hash(password, 12)
            console.log(`[TEST] A new hash for this password would look like: ${newHash}`)
        }

    } catch (e) {
        console.error('[TEST] Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
