const dbOperationSQLUsers = require('../sqlFiles/dbOperationUsers')
const dbOperationSQLDevices = require('../sqlFiles/dbOperationDevices')
const dbOperationsRedis = require('../redisFiles/dbOperations')
const dbOperationSQLRealEstate = require('../sqlFiles/dbOperationRealEstate')
const dbOperationSQLLogs = require('../sqlFiles/dbOperationLogs')

const getChangesFromRedisToSQL = async (realEstate) => {
    const changes = await dbOperationsRedis.getDataFromSet(`realestate:${realEstate}:changes`, 0)
    const filteredChanges = changes
        .sort((a, b) => {
            const priorityA = getPriority(a);
            const priorityB = getPriority(b);
            return priorityA - priorityB;
        })
        .filter(change => {
            const sliced = change.split(':');
            const method = sliced[0];
            const dataTable = sliced[1];

            if (method === 'delete') {
                const deleteChangeAdd = `post:${dataTable}:${sliced[2]}`;
                const deleteChangeUpdate = `put:${dataTable}:${sliced[2]}`;
                return !changes.includes(deleteChangeAdd) || !changes.includes(deleteChangeUpdate);
            }

            return true;
        });
    filteredChanges.map(change => {
        const sliced = change.split(':')
        const method = sliced[0]
        const dataTable = sliced[1]
        const id = sliced[2]
        if (dataTable === 'user') {
            console.log('U useru sam')
            if (method === 'post') {
                postUser(id)
            } else if (method === 'put') {
                putUser(id)
            } else if (method === 'delete') {
                deleteUser(id)
            }
        } else if (dataTable === 'device') {
            console.log('U devicu sam')
            if (method === 'post') {
                postDevice(id, realEstate)
            } else if (method === 'put') {
                putDevice(id, realEstate)
            } else if (method === 'delete') {
                deleteDevice(id)
            }
        } else if (dataTable === 'settings') {
            console.log('U setting sam')
            if (method === 'post') {
                postSettings(id)
            } else if (method === 'put') {
                putSettings(id)
            }
        } else if (dataTable === 'type') {
            postType(id)
        } else if (dataTable === 'room') {
            postRoom(id, estate)
        }
    })
}

const getPriority = (change) => {
    const sliced = change.split(':');
    const method = sliced[0];
    const dataTable = sliced[1];

    if (dataTable === 'room' || dataTable === 'type' || dataTable === 'user') {
        return 1;
    } else if (dataTable === 'devices') {
        return 2;
    } else if (dataTable === 'settings') {
        return 3;
    }

    return 0;
};

const getLogsForSQL = async (realEstate) => {
    postAlerts(realEstate)
}

// users
const postUser = async (id) => {
    const getKey = await dbOperationsRedis.getKeys(`realestate:*:user:${id}`, 0)
    if (getKey && getKey.length > 0) {
        const getUser = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        let { id_user, cold_password, password, ...newUser } = getUser;
        newUser = {
            ...newUser,
            password: password,
            realEstate: getKey[0].split(':')[1]
        }
        await dbOperationSQLUsers.addHouseUser(newUser)
    }
}
const putUser = async (id) => {
    const getKey = await dbOperationsRedis.getKeys(`realestate:*:user:${id}`, 0)
    if (getKey && getKey.length > 0) {
        const getUser = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        let { cold_password, password, new_password, ...newUser } = getUser;
        newUser = {
            ...newUser,
            old_password: password,
            password: new_password
        }
        await dbOperationSQLUsers.updateHouseUser(newUser)
    }
}
const deleteUser = async (id) => {
    const userId = id.toString()
    await dbOperationSQLUsers.deleteHouseUser(userId)
}
// rooms
const postRoom = async (id, estate) => {
    const getKey = await dbOperationsRedis.getKeys(`realestate:${estate}:room:${id}`, 0)
    if (getKey && getKey.length > 0) {
        const getRoom = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        let { room_id, ...newRoom } = getRoom;
        newRoom = {
            ...newRoom,
            surface: '5',
            id_realestate: estate.toString()
        }
        await dbOperationSQLRealEstate.addRoom(newRoom)
    }
}

//types
const postType = async (id) => {
    const getKey = await dbOperationsRedis.getKeys(`type:${id}`, 0)
    if (getKey && getKey.length > 0) {
        const getType = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        let { id_type, ...newType } = getType;
        await dbOperationSQLDevices.addDeviceType(newType)
    }
}


// devices
const postDevice = async (id, estate) => {
    const getKey = await dbOperationsRedis.getKeys(`room:*:device:${id}`, 0)
    if (getKey && getKey.length > 0) {
        const getDevice = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        let { id_device, categoty, ...newDevice } = getDevice;
        const roomId = getKey[0].split(':')[1]
        const roomName = await dbOperationsRedis.getAllDataFromHash(`realestate:${estate}:room:${roomId}`, 0)
        newDevice = {
            ...newDevice,
            room: roomName.name,
            estate: estate
        }
        await dbOperationSQLDevices.addDevice(newDevice)
    }
}
const putDevice = async (id, realestate) => {
    const getKey = await dbOperationsRedis.getKeys(`room:*:device:${id}`, 0)
    if (getKey && getKey.length > 0) {
        console.log(getKey)
        const getDevice = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        console.log(getDevice)
        if (getDevice !== null) {
            console.log(getDevice)
            let { categoty, ...newDevice } = getDevice;
            const roomId = getKey[0].split(':')[1]
            const roomName = await dbOperationsRedis.getAllDataFromHash(`realestate:${realestate}:room:${roomId}`, 0)
            console.log(roomName)
            newDevice = {
                ...newDevice,
                room: roomName.name,
                estate: realestate
            }
            const updated = await dbOperationSQLDevices.addDevice(newDevice)
            if (updated.message === 'There is no such room or device') {
                let { id_device, categoty, ...newDevice } = getDevice;
                const roomId = getKey[0].split(':')[1]
                const roomName = await dbOperationsRedis.getAllDataFromHash(`realestate:${realestate}:room:${roomId}`, 0)
                newDevice = {
                    ...newDevice,
                    room: roomName.name,
                    estate: realestate
                }
                await dbOperationSQLDevices.addDevice(newDevice)
            }
        }
    }
}
const deleteDevice = async (id) => {
    const deviceId = id.toString()
    await dbOperationSQLDevices.deleteDevice(deviceId)
}
// settings
const postSettings = async (id) => {
    const getKey = await dbOperationsRedis.getKeys(`device:*:settings:${id}`, 0)
    if (getKey && getKey.length > 0) {
        const getSettings = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        let { id_settings, ...newSettings } = getSettings;
        const deviceId = getKey[0].split(':')[1]
        newSettings = {
            ...newSettings,
            device: deviceId.toString()
        }
        await dbOperationSQLDevices.addSettings(newSettings)
    }
}
const putSettings = async (id) => {
    const getKey = await dbOperationsRedis.getKeys(`device:*:settings:${id}`, 0)
    if (getKey && getKey.length > 0) {
        const getSettings = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
        const updated = await dbOperationSQLDevices.updateSettings(getSettings)
        if (updated.message === 'There is no such room or device') {
            let newSettings = getSettings;
            await dbOperationSQLDevices.updateSettings(newSettings)
        }
    }
}

const postAlerts = async (estate) => {
    const getKey = await dbOperationsRedis.getKeys(`realestate:alert:${estate}`, 1)
    if (getKey && getKey.length > 0) {
        const getAlerts = await dbOperationsRedis.getTodaysDataFromTimeSeries(getKey[0], '2500')
        let key = getAlerts[0][0]
        console.log(key)
        let iterData = getAlerts[0][1]
        let wifiLow = 0
        if (iterData.length > 0) {
            let type = ''
            for (let i = 0; i < iterData.length; i++) {
                let timeStamp = iterData[i][0]
                let alert = iterData[i][1][1]
                let content = ''
                if (alert.includes("Intrusion")) {
                    type = 'Danger'
                    content = 'Intrudor detected'
                } else if (alert.includes("Fire")) {
                    type = 'Danger'
                    content = 'Fire detected'
                } else if (alert.includes("Water")) {
                    type = 'Warning'
                    content = 'Water leak detected'
                } else if (alert.includes("Carbon")) {
                    type = 'Warning'
                    content = 'Carbon'
                } else {
                    type = 'Info'
                }
                if (alert.includes('Your Wi-Fi connection is weak or unstable.')) {
                    wifiLow = wifiLow + 1
                } else {
                    const milliseconds = parseInt(timeStamp.split("-")[0]);
                    const date = new Date(milliseconds)
                    const sqlDate = date.toISOString().split("T")[0];
                    const newLog = {
                        estate: estate,
                        id_device: null,
                        content: content,
                        content_type: type,
                        updated_at: sqlDate
                    }
                    await dbOperationSQLLogs.addLog(newLog)
                }
            }
            let Updated_at = new Date();
            let formattedDate = Updated_at.toISOString().slice(0, 19).replace('T', ' ');
            const newLog = {
                estate: estate,
                id_device: null,
                content: 'Low WiFi detected ' + wifiLow.toString() + ' times',
                content_type: type,
                updated_at: formattedDate
            }
            await dbOperationSQLLogs.addLog(newLog)
        }
    }
}

// delete from redis
const deleteAllDataRedis = async (realestate) => {
    if (realestate) {
        const keys1 = await getKeysToDelete(realestate, 1)
        await dbOperationsRedis.delKeys(keys1, 1)
        const keys0 = await getKeysToDelete(realestate, 0)
        await dbOperationsRedis.delKeys(keys0, 0)
    }
}
const deleteDataRedis = async (realestate) => {
    if (realestate) {
        const keys1 = await getKeysToDelete(realestate, 1)
        await dbOperationsRedis.delKeys(keys1, 1)
    }
}
const getKeysToDelete = async (realestate, db) => {
    let chunk0 = [];
    let chunk1 = [];
    const rooms = await dbOperationsRedis.getKeys(`realestate:${realestate}:room:*`, 0);
    const users = await dbOperationsRedis.getKeys(`realestate:${realestate}:user:*`, 0);

    let music, sensor, wifi, tv;
    for (let room = 0; room < rooms.length; room++) {
        const devices = await dbOperationsRedis.getKeys(`room:${rooms[room].split(':')[3]}:device:*`, 0);
        for (let device = 0; device < devices.length; device++) {
            const id = devices[device].split(':')[3].toString();
            music = await dbOperationsRedis.getKeys(`music:${id}`, 1);
            sensor = await dbOperationsRedis.getKeys(`sensor:${id}`, 1);
            tv = await dbOperationsRedis.getKeys(`tv:${id}`, 1);
            wifi = await dbOperationsRedis.getKeys(`wifi:${id}`, 1);
            const settings = await dbOperationsRedis.getKeys(`device:${id}:settings:*`, 0);
            if (music.length > 0) {
                chunk1.push(music);
            } else if (sensor.length > 0) {
                chunk1.push(sensor);
            } else if (tv.length > 0) {
                chunk1.push(tv)
            } else if (wifi.length > 0) {
                chunk1.push(wifi)
            }
            chunk0.push(settings);
        }
        chunk0.push(devices)
    }

    for (let user = 0; user < users.length; user++) {
        const id = users[user].split(':')[3];
        const userKeys = await dbOperationsRedis.getKeys(`user:${id}`, 1);
        chunk1.push(userKeys);
    }
    const rest0 = await dbOperationsRedis.getKeys(`realestate:${realestate}*`, 0);
    const rest1 = await dbOperationsRedis.getKeys(`realestate:${realestate}*`, 1);
    const rest2 = await dbOperationsRedis.getKeys(`realestate:alert:${realestate}*`, 1);

    chunk0.push(rest0);
    chunk1.push(rest1);
    chunk1.push(rest2);
    console.log(chunk1)
    if (db === 0) {
        return chunk0.flat();
    } else {
        return chunk1.flat();
    }
};

module.exports = { getChangesFromRedisToSQL, getLogsForSQL, deleteAllDataRedis, deleteDataRedis }