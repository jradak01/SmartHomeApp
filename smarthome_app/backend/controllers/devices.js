const devicesRouter = require('express').Router()
dbOperationSQLDevices = require('../sqlFiles/dbOperationDevices')
dbOperationsRedis = require('../redisFiles/dbOperations')

devicesRouter.get('/rooms/:id', async (req, res) => {
    // const results = await dbOperationSQLDevices.getDevicesInRoom(req.params.id);
    const getDeviceKeys = await dbOperationsRedis.getKeys(`room:${req.params.id}:device:*`, 0)
    let results = []
    for (const keyDevice of getDeviceKeys) {
        let device = await dbOperationsRedis.getAllDataFromHash(keyDevice, 0)
        const deviceIndex = keyDevice.split(':')
        const getSettings = await dbOperationsRedis
            .getKeys(`device:${deviceIndex[deviceIndex.length - 1]}:settings:*`, 0)
        let settings = []
        for (const keySettings of getSettings) {
            let setting = await dbOperationsRedis.getAllDataFromHash(keySettings, 0)
            settings.push(setting)
        }
        let newDevice = {
            ...device,
            settings: settings
        }
        results.push(newDevice)
    }
    res.json(results)
})


devicesRouter.get('/:id', async (req, res) => {
    // const results = await dbOperationSQLDevices.getDevice(req.params.id);
    const getKey = await dbOperationsRedis.getKeys(`room:*:device:${req.params.id}`, 0)
    let device = await dbOperationsRedis.getAllDataFromHash(getKey[0], 0)
    const getSettings = await dbOperationsRedis
        .getKeys(`device:${req.params.id}:settings:*`, 0)
    let settings = []
    for (const keySettings of getSettings) {
        let setting = await dbOperationsRedis.getAllDataFromHash(keySettings, 0)
        let clean = JSON.parse(JSON.stringify(setting));
        settings.push(clean)
    }
    const roomIndex = getKey[0].split(':')
    let newDevice = {
        ...device,
        room: roomIndex[1],
        settings: settings
    }
    res.json(newDevice)
})
// get locks 
devicesRouter.get('/realestate/:id/:type', async (req, res) => {
    const getData = await dbOperationsRedis.getDataFromSet(`realestate:${req.params.id}:${req.params.type}`, 0)
    let newData = []
    for (const dev of getData) {
        const newDev = dev.split(':')
        const data = {
            id_device: newDev[3],
            room_id: newDev[1]
        }
        newData.push(data)
    }
    res.json(newData)
})



// post devices

devicesRouter.post('/', async (req, res) => {
    try {
        const maxIndex = await dbOperationsRedis.getDataFromString(`index:device`, 0)
        const maxDeviceIndex = parseInt(maxIndex) + 1
        const getRoomKeys = await dbOperationsRedis.getKeys(`realestate:${req.body.estate}:room:*`, 0);
        let id_room = null;
        for (const roomKey of getRoomKeys) {
            const room = await dbOperationsRedis.getAllDataFromHash(roomKey, 0);
            if (room.name.toLowerCase() === req.body.room.toLowerCase()) {
                id_room = room.room_id;
                break;
            }
        }
        if (!id_room) {
            const getMaxRoomKeys = await dbOperationsRedis.getDataFromString(`index:room`, 0);
            let maxRoomIndex = parseInt(getMaxRoomKeys) + 1
            const newRoom = {
                room_id: maxRoomIndex,
                name: req.body.room
            };
            await dbOperationsRedis.addDataToString(`index:room`, maxRoomIndex.toString(), 0)
            await dbOperationsRedis.saveDataToHash(
                `realestate:${req.body.estate}:room:${maxRoomIndex}`,
                newRoom,
                0
            );
            await dbOperationsRedis.addDataToSet(
                `realestate:${req.body.estate}:changes`,
                `post:room:${maxRoomIndex}`,
                0
            );
            id_room = newRoom.room_id;
        }
        const types = await dbOperationsRedis.getKeys(`type:*`, 0);
        let typeExists = false;
        for (const typeKey of types) {
            const type = await dbOperationsRedis.getAllDataFromHash(typeKey, 0);
            if (type.name.toLowerCase() === req.body.type.toLowerCase()) {
                typeExists = true;
                break;
            }
        }
        if (!typeExists) {
            const getTypeKeys = await dbOperationsRedis.getDataFromString(`index:device_type`, 0);
            const maxIndex = parseInt(getTypeKeys) + 1
            const type = {
                id_type: maxIndex,
                name: req.body.type,
                category: req.body.category
            }
            await dbOperationsRedis.addDataToString(`index:device_type`, maxIndex.toString(), 0)
            await dbOperationsRedis.saveDataToHash(`type:${maxIndex}`, type, 0);
            await dbOperationsRedis.addDataToSet(
                `realestate:${req.body.estate}:changes`,
                `post:type:${maxIndex}`,
                0
            );
        }
        const newDevice = {
            id_device: maxDeviceIndex,
            name: req.body.name,
            type: req.body.type,
            category: req.body.category
        };
        const result = await dbOperationsRedis.saveDataToHash(
            `room:${id_room}:device:${maxDeviceIndex.toString()}`,
            newDevice,
            0
        );
        await dbOperationsRedis.addDataToString(`index:device`, maxDeviceIndex.toString(), 0)
        await dbOperationsRedis.addDataToSet(
            `realestate:${req.body.estate}:changes`,
            `post:device:${maxIndex}`,
            0
        );
        res.json(maxDeviceIndex);
    } catch (error) {
        console.error('Error saving device:', error);
        res.status(500).json({ error: 'Error while saving device' });
    }
});


// delete devices

devicesRouter.delete('/:realestate/:room/:id', async (req, res) => {
    // const results = await dbOperationSQLDevices.deleteDevice(req.params.id);
    await dbOperationsRedis.addDataToSet(
        `realestate:${req.params.realestate}:changes`,
        `delete:device:${req.params.id}`, 0
    );
    const results = await dbOperationsRedis
        .delKeys(`room:${req.params.room}:device:${req.params.id}`, 0)
    await dbOperationsRedis.delKeys(`device:${req.params.id}:settings:*`)
    await dbOperationsRedis
        .delKeys(`realestate:${req.params.realestate}:fastcontols:${req.params.id}`, 1)
    res.json(results)
})

//update devices

devicesRouter.put('/', async (req, res) => {
    // const results = await dbOperationSQLDevices.updateDevice(req.body);
    const newDevice = {
        id_device: req.body.id_device,
        name: req.body.name,
    }
    const results = await dbOperationsRedis.saveDataToHash(
        `room:${req.body.room}:device:${req.body.id_device}`,
        newDevice, 0
    );
    await dbOperationsRedis.addDataToSet(
        `realestate:${req.body.estate}:changes`,
        `put:device:${req.body.id_device}`, 0
    );
    res.json(results)
})

// post settings

devicesRouter.post('/settings/', async (req, res) => {
    // const results = await dbOperationSQLDevices.addSettings(req.body);
    const getIndex = await dbOperationsRedis.getDataFromString(`index:settings`, 0)
    let maxIndex = parseInt(getIndex) + 1
    const newSettings = {
        id_settings: maxIndex.toString(),
        name: req.body.name.toString(),
        value: req.body.value.toString()
    }
    const results = await dbOperationsRedis.saveDataToHash(
        `device:${req.body.device}:settings:${maxIndex.toString()}`,
        newSettings, 0
    );
    await dbOperationsRedis.addDataToSet(
        `realestate:${req.body.estate}:changes`,
        `post:settings:${maxIndex.toString()}`, 0
    );
    await dbOperationsRedis.addDataToString(`index:settings`, maxIndex.toString(), 0)
    res.json(results)
})
// put settings

devicesRouter.put('/settings/', async (req, res) => {
    // const results = await dbOperationSQLDevices.updateSettings(req.body);
    const newSettings = {
        id_settings: req.body.id_settings.toString(),
        name: req.body.name.toString(),
        value: req.body.value.toString()
    }
    const results = await dbOperationsRedis.saveDataToHash(
        `device:${req.body.id_device}:settings:${req.body.id_settings}`,
        newSettings, 0
    );
    await dbOperationsRedis.addDataToSet(
        `realestate:${req.body.estate}:changes`,
        `put:settings:${req.body.id_settings}`, 0
    );
    res.json(results)
})

module.exports = devicesRouter;