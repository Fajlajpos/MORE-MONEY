const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync("Nevimnevim16", 10);
console.log(hash);
