const { sql, poolPromise } = require('./dbConfig');

const getRooms = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `EXEC sp_get_rooms ${id}`;
        let response = await request.query(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const getOneRealEstate = async(data) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_get_one_real_estate`;
        request.input('id', sql.VarChar(50), data.id);
        request.input('from', sql.VarChar(50), data.from);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const addRealEstate = async (newRealEstate) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_ins_real_estate`;
        request.input('json', sql.VarChar(sql.MAX), JSON.stringify(newRealEstate));
        const response = await request.execute(userquery);
        return response.recordset;
    } catch (err) {
        console.log(err); // Ispisuje ostale greške
    }
}

const updateRealEstate = async(newRealEstate) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_upd_real_estate`;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(newRealEstate));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const deleteRealEstate = async(id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_del_real_estate`;
        request.input('id_real_estate', sql.VarChar(sql.MAX), id);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const getRoom = async(data) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_get_one_room`;
        request.input('id', sql.VarChar(50), data.id);
        request.input('from', sql.VarChar(50), data.from);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const addRoom = async(newRoom) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_ins_rooms`;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(newRoom));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const updateRoom = async(newRoom) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_upd_rooms`;
        request.input('json', sql.VarChar(sql.MAX), JSON.stringify(newRoom));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const deleteRoom = async(id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_del_rooms`;
        request.input('id_room', sql.VarChar(50), id);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}


module.exports = {
    getRooms,
    getOneRealEstate,
    addRealEstate,
    updateRealEstate,
    deleteRealEstate,
    getRoom,
    addRoom,
    updateRoom,
    deleteRoom
}