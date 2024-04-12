const dbOperationsRedis = require('../redisFiles/dbOperations')

const addUsers = async () => {
    const getUsersKeys = await dbOperationsRedis.getKeys(`realestate:*:user:*`, 0)
    let users = []
    for (key of getUsersKeys) {
        const user = await dbOperationsRedis.getAllDataFromHash(key, 0)
        users.push(user)
    }
    return users;
}

module.exports = addUsers