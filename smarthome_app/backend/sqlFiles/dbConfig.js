const configs = require('../utils/config')
const sql = require("mssql");

const config = {
    user: configs.SQL_USER,
    password: configs.SQL_PASSWORD,
    server: configs.SQL_SERVER,
    database: configs.SQL_DATABASE,
    options: {
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS'
    },
    port: parseInt(configs.SQL_PORT, 10)
}
const poolPromise =new sql.ConnectionPool(config)
    .connect()
    .then (pool =>{
        console.log("connected")
        return pool
    })
    .catch(err => console.log("failed to connect", err)); 

module.exports = {
    poolPromise: poolPromise,
    sql: sql
};