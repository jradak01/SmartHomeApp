const loginRouter = require('express').Router()
dbOperationSQLUsers = require('../sqlFiles/dbOperationUsers')
dbOperationSQLDevices = require('../sqlFiles/dbOperationDevices')
dbOperationsRedis = require('../redisFiles/dbOperations')
dbOperationSQLRealEstate = require('../sqlFiles/dbOperationRealEstate')
const scheduleMethods = require('../scheduler/schedulerMethods');
const addSensorData = require('../sensors/sensorsData')
const addUsers = require('../sensors/userData')
const sensorSimulation = require('../sensors/sensorSimulate')

const handleLogin = async (req, res) => {
    const login = await dbOperationSQLUsers.login(req.body);
    if (login[0].valid !== "User invalid") {
        const realEstate = await dbOperationSQLUsers.getRealEstateOfUser(login[0].user_id);
        await saveRealEstateData(realEstate[0]);
        await saveUsersData(realEstate[0].id_real_estate);
        await saveRoomsData(realEstate[0].id_real_estate);
        await saveDeviceTypes();
        await addDataForSensor();
        await addDataForUser();
        await addDataForTv();
        await addDataForMusic();
        await addDataForWifi();
        await addControls(realEstate[0].id_real_estate);
        await saveMaxIndexes();
        await saveEstateLocks(realEstate[0].id_real_estate);
        await saveEstateSpecific(realEstate[0].id_real_estate);
    } else {
        console.log('User invalid! please try again.');
    }
    res.json(login);
};

const addControls = async (realestate) => {
    const devices = await addSensorData('device')
    for (const device of devices) {
        const filteredSettings = device.settings.filter((setting) => setting.name === 'controls');
        let newData;
        if (filteredSettings[0]) {
            if (filteredSettings[0].value === 'basic') {
                newData = {
                    enabled: 'false'
                }
            } else {
                newData = {
                    value: '0',
                    enabled: 'false'
                }
            }
            await dbOperationsRedis.saveDataToHash(
                `realestate:${realestate}:fastcontrols:${device.id_device}`,
                newData, 1
            );
        }
    }
}

const addDataForSensor = async () => {
    const sensors = await addSensorData('sensor')
    for (const sensor of sensors) {
        const filteredSettings = sensor.settings
            .filter(setting => setting.name === 'measure');
        let sensorValue = filteredSettings[0].value === '°C' ? 54 : 100;
        const returnValue = sensorSimulation.simulateSensor(sensorValue)
        await dbOperationsRedis.addDataToTimeSeries(`sensor:${sensor.id_device}`, returnValue.toString())
    }
}
const addDataForUser = async () => {
    const users = await addUsers()
    for (const user of users) {
        const returnValue = sensorSimulation.simulateUsersInHouse()
        await dbOperationsRedis.addDataToTimeSeries(`user:${user.id_user}`, returnValue.toString())
    }
}

const addDataForTv = async () => {
    const devices = await addSensorData('tv')
    for (const device of devices) {
        const returnValue = sensorSimulation.simulateChangingTV()
        await dbOperationsRedis.addDataToTimeSeries(`tv:${device.id_device}`, returnValue)

    }
}

const addDataForMusic = async () => {
    const devices = await addSensorData('music')
    for (const device of devices) {
        const returnValue = sensorSimulation.simulateChangingSongs()
        await dbOperationsRedis.addDataToTimeSeries(`music:${device.id_device}`, returnValue)
    }
}

const addDataForWifi = async () => {
    const devices = await addSensorData('wifi')
    for (const device of devices) {
        const returnValue = sensorSimulation.simulateWiFi()
        await dbOperationsRedis.addDataToTimeSeries(`wifi:${device.id_device}`, returnValue)
    }
}

const saveRealEstateData = async (realEstate) => {
    await dbOperationsRedis.saveDataToHash(`realestate:${realEstate.id_real_estate}`, realEstate, 0);
};

const saveUsersData = async (realEstateId) => {
    const users = await dbOperationSQLUsers.getHouseUsersOnAddress(realEstateId);
    await Promise.all(
        users.map(async (user) => {
            const updatedUser = {
                ...user,
                cold_password: user.password,
                new_password: user.password
            };
            await dbOperationsRedis.saveDataToHash(
                `realestate:${realEstateId}:user:${user.id_user}`,
                updatedUser, 0
            );
        })
    );
};

const saveRoomsData = async (realEstateId) => {
    const rooms = await dbOperationSQLRealEstate.getRooms(realEstateId);
    await Promise.all(
        rooms.map(async (room) => {
            await dbOperationsRedis.saveDataToHash(
                `realestate:${realEstateId}:room:${room.room_id}`,
                room, 0
            );
            await saveDevicesData(room.room_id);
        })
    );
};

const saveDevicesData = async (roomId) => {
    const devices = await dbOperationSQLDevices.getDevicesInRoom(roomId.toString());
    await Promise.all(
        devices.map(async (device) => {
            const deviceData = Object.keys(device)
                .filter(key => key !== 'settings')
                .reduce((results, key) => {
                    results[key] = device[key];
                    return results;
                }, {});
            await dbOperationsRedis.saveDataToHash(
                `room:${roomId}:device:${device.id_device}`,
                deviceData, 0
            );
            await saveSettingsData(device.id_device, device.settings);
        })
    );
};

const saveSettingsData = async (deviceId, settings) => {
    if (settings !== undefined) {
        await Promise.all(
            settings.map(async (setting) => {
                const settingData = {
                    id_settings: setting.id_settings,
                    name: setting.name,
                    value: setting.value
                };
                await dbOperationsRedis.saveDataToHash(
                    `device:${deviceId}:settings:${setting.id_settings}`,
                    settingData, 0
                );
            })
        );
    }
};

const saveDeviceTypes = async () => {
    const types = await dbOperationSQLDevices.getDeviceTypes();
    await Promise.all(
        types.map(async (type) => {
            await dbOperationsRedis.saveDataToHash(`type:${type.id_type}`, type, 0);
        })
    );
};

const saveMaxIndexes = async () => {
    const idxs = await dbOperationSQLDevices.getMaxIndexes();
    for (const idx of idxs) {
        await dbOperationsRedis.addDataToString(
            `index:${idx.table.toLowerCase()}`,
            idx.max_index.toString(), 0
        );
    }
}

const saveEstateLocks = async (realEstate) => {
    const locks = await dbOperationSQLDevices.getEstateLocks(realEstate.toString())
    let data = []
    for (const lock of locks) {
        const stringLock = `room:${lock.room}:device:${lock.id_device}`
        data.push(stringLock)
    }
    await dbOperationsRedis.addDataToSet(
        `realestate:${realEstate}:locks`,
        data, 0
    );
}
const saveEstateSpecific = async (realEstate) => {
    const req = ['Humidity Sensor', 'Light', 'Air Conditioner', 'Temperature sensor']
    for (const type of req) {
        const specs = await dbOperationSQLDevices.getEstateSpecific(realEstate.toString(), type)
        let data = []
        for (const spec of specs) {
            const stringSpec = `room:${spec.room}:device:${spec.id_device}`
            data.push(stringSpec)
        }
        const key = type === 'Humidity Sensor' ?
            'humidity' : type === 'Light' ? 'lights' :
                type === 'Air Conditioner' ? 'thermos' :
                    'temps'
        await dbOperationsRedis.addDataToSet(
            `realestate:${realEstate}:${key}`,
            data, 0
        );
    }
}

loginRouter.post('/', handleLogin);

loginRouter.post('/logout/:id', async (req, res) => {
    try {
        const estate = req.params.id
        await scheduleMethods.getChangesFromRedisToSQL(estate)
        await scheduleMethods.getLogsForSQL(estate)
        await scheduleMethods.deleteAllDataRedis(estate)
    } catch (err) {
        console.log('Error while trying to schedule:', err);
    }
})



module.exports = loginRouter;