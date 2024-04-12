require('dotenv').config()

const PORT = process.env.PORT
const SQL_PORT = process.env.SQL_PORT
const SQL_USER = process.env.SQL_USER
const SQL_SERVER = process.env.SQL_SERVER
const SQL_PASSWORD = process.env.SQL_PASSWORD
const SQL_DATABASE = process.env.SQL_DATABASE
const REDIS_PORT = process.env.REDIS_PORT

module.exports = {PORT, 
    SQL_PORT, 
    SQL_USER, 
    SQL_SERVER, 
    SQL_PASSWORD, 
    SQL_DATABASE,

    REDIS_PORT
}