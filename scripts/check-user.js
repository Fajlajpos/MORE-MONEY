const { PrismaClient } = require('@prisma/client')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()

async function main() {
    try {
        const email = 'filipmayer7@gmail.com'
        console.log(`Searching for user: ${email}`)

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (user) {
            console.log('User found!')
            console.log('ID:', user.id)
            console.log('Email:', user.email)
            console.log('Role:', user.role)
            console.log('PasswordHash prefix:', user.passwordHash ? user.passwordHash.substring(0, 10) + '...' : 'NULL')
        } else {
            console.log('User NOT found.')
        }

    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
