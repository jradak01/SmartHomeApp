const { sql, poolPromise } = require('./dbConfig');

const getRoomsDevices = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_get_rooms_devices`;
        request.input('id_real_estate', sql.VarChar(50), id);
        const response = await request.execute(userquery);
        const parsedResult = JSON.parse(response.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]);
        return parsedResult;
    }
    catch (err) {
        console.log(err);
    }
}

const getDevicesInRoom = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_get_devices_in_room`;
        request.input('id_room', sql.VarChar(sql.MAX), id);
        const response = await request.execute(userquery);
        const parsedResult = JSON.parse(response.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]);
        return parsedResult;
    }
    catch (err) {
        console.log(err);
    }
}

const getEstateLocks = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_get_locks`;
        request.input('id_real_estate', sql.VarChar(50), id);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}
const getEstateSpecific = async (id, type) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_get_device_specific`;
        request.input('id_real_estate', sql.VarChar(50), id);
        request.input('type', sql.VarChar(50), type);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}
const getDevice = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_get_device`;
        request.input('id_device', sql.VarChar(sql.MAX), id);
        const response = await request.execute(userquery);
        const parsedResult = JSON.parse(response.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]);
        return parsedResult;
    }
    catch (err) {
        console.log(err);
    }
}

const addDevice = async (newDevice) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_ins_device`;
        request.input('json', sql.VarChar(sql.MAX), JSON.stringify(newDevice));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const deleteDevice = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_del_device`;
        request.input('id_device', sql.VarChar(sql.MAX), id);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const updateDevice = async (newDevice) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_upd_device`;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(newDevice));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const addSettings = async (newSettings) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_ins_settigs`;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(newSettings));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const updateSettings = async (newSettings) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_upd_settings`;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(newSettings));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const deleteSettings = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_del_settings`;
        request.input('id_settings', sql.VarChar(sql.MAX), id);
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const addDeviceType = async (newType) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_ins_device_type`;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(newType));
        const response = await request.execute(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const getDeviceTypes = async () => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        const userquery = 'SELECT * FROM v_device_type';
        const response = await request.query(userquery);
        return response.recordset;
    } catch (err) {
        console.log(err);
    }
};

const getMaxIndexes = async () => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        const userquery = 'SELECT * FROM v_max_indexes';
        const response = await request.query(userquery);
        return response.recordset;
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getRoomsDevices,
    getDevicesInRoom,
    getDevice,
    getEstateLocks,
    getEstateSpecific,
    addDevice,
    deleteDevice,
    updateDevice,

    addSettings,
    updateSettings,
    deleteSettings,

    addDeviceType,
    getDeviceTypes,

    getMaxIndexes
}