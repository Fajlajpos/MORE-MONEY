const { Client } = require('pg')
const bcrypt = require('bcryptjs')

const client = new Client({
    connectionString: "postgresql://postgres:admin@127.0.0.1:5432/MAKE_MONEY?schema=public"
})

async function main() {
    const email = 'filipmayer7@gmail.com'
    const password = 'Nevimnevim16'

    console.log(`[PG-TEST] Checking user: ${email}`)

    try {
        await client.connect()

        const res = await client.query('SELECT * FROM "User" WHERE email = $1', [email])

        if (res.rows.length === 0) {
            console.log('[PG-TEST] User NOT FOUND.')
            return
        }

        const user = res.rows[0]
        console.log('[PG-TEST] User FOUND:', user.email)
        console.log(`[PG-TEST] Hash in DB: ${user.passwordHash}`)

        const match = await bcrypt.compare(password, user.passwordHash)

        if (match) {
            console.log('[PG-TEST] SUCCESS: Password matches!')
        } else {
            console.log('[PG-TEST] FAILURE: Password does NOT match.')
        }

    } catch (e) {
        console.error('[PG-TEST] Error:', e)
    } finally {
        await client.end()
    }
}

main()
