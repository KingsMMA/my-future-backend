const bcrypt = require("bcrypt");

async function hashPassword(password) {
    const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS, 10) || 10;
    return await bcrypt.hash(password + process.env.PASSWORD_SALT, saltRounds);
}

async function checkPassword(password, hash) {
    return await bcrypt.compare(password + process.env.PASSWORD_SALT, hash);
}

module.exports = {
    hashPassword,
    checkPassword,
};
