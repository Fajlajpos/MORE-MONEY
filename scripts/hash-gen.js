const bcrypt = require('bcryptjs')
const password = 'Nevimnevim16'
const hash = bcrypt.hashSync(password, 12)
const fs = require('fs')
fs.writeFileSync('hash.txt', hash)
console.log('Hash written to hash.txt')
