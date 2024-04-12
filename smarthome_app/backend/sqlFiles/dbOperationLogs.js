const { sql, poolPromise } = require('./dbConfig');

const addLog = async(newLog) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_ins_logs`;
        request.input('json', sql.VarChar(sql.MAX), JSON.stringify(newLog));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}
const getLogs = async(date, realEstate) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `get_logs`;
        request.input('date', sql.VarChar(50), JSON.stringify(date));
        request.input('realEstate', sql.VarChar(50), JSON.stringify(realEstate));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = {
    addLog,
    getLogs
}