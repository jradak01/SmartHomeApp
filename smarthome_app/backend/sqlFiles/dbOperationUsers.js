const { sql, poolPromise } = require('./dbConfig');

const getHouseUsers = async () => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = 'SELECT * FROM v_users_realestate;';
        let response = await request.query(userquery);
        return response;
    }
    catch (err) {
        console.log(err);
    }
}

const getOneUser = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `EXEC sp_view_one_user ${id}`;
        let response = await request.query(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

const getRealEstateOfUser = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `EXEC sp_get_real_estate_of_user ${id}`;
        let response = await request.query(userquery);
        return response.recordset;
    } catch (err) {
        console.log(err);
    }
};
const getHouseUsersOnAddress = async (realEstate) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `exec sp_view_users_on_one_address ${realEstate}`
        let response = await request.query(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}
const login = async (data) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `login_user`;
        request.input('user_json', sql.VarChar(sql.MAX), JSON.stringify(data));
        const response = await request.execute(userquery);
        console.log(response.recordset)
        return response.recordset;
    } catch (err) {
        console.log(err); // Ispisuje ostale greške
    }
}
const addHouseUser = async (newUser) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_ins_House_User`;
        request.input('user_json', sql.VarChar(sql.MAX), JSON.stringify(newUser));
        const response = await request.execute(userquery);
        return response;
    } catch (err) {
        console.log(err); // Ispisuje ostale greške
    }
};
const deleteHouseUser = async (id) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `exec sp_del_House_User ${id}`
        let response = await request.query(userquery);
        return response.recordset;
    }
    catch (err) {
        console.log(err);
    }
}
const updateHouseUser = async (newUser) => {
    try {
        const pool = await poolPromise;
        const request = await pool.request();
        let userquery = `sp_upd_House_User`;
        request.input('user_json', sql.VarChar(sql.MAX), JSON.stringify(newUser));
        const response = await request.execute(userquery);
        return response;

    } catch (err) {
        console.log(err); // Ispisuje ostale greške
    }
}


module.exports = {
    getHouseUsers,
    getOneUser,
    addHouseUser,
    getHouseUsersOnAddress,
    getRealEstateOfUser,
    deleteHouseUser,
    updateHouseUser,
    login
}