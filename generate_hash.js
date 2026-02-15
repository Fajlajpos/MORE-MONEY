const bcrypt = require('bcryptjs');
const fs = require('fs');
bcrypt.hash("password", 12).then(hash => fs.writeFileSync('hash.txt', hash));
