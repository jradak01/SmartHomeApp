const dbOperationsRedis = require('../redisFiles/dbOperations')

const addSensorData = async (type) => {
    const getDeviceKeys = await dbOperationsRedis.getKeys(`room:*:device:*`, 0)
    let devices = []
    for (key of getDeviceKeys) {
        const device = await dbOperationsRedis.getAllDataFromHash(key, 0)
        const deviceIndex = key.split(':')
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
        devices.push(newDevice)
    }
    if (type === 'sensor') {
        const sensorDevices = devices.filter(device => device.category === 'Sensor');
        return sensorDevices;
    } else if (type === 'tv') {
        const tv = devices.filter(device => device.type === 'Television');
        return tv;
    } else if (type === 'music') {
        const music = devices.filter(device =>
            device.type === 'Audio system' ||
            device.type === 'Outdoor speakers' ||
            device.type === 'Media player')
        return music;
    } else if (type === 'device') {
        const basicDevice = devices.filter(device => device.category === 'Device');
        return basicDevice;
    } else if (type === 'wifi') {
        const wifi = devices.filter(device => device.type.toLowerCase() === 'wifi');
        return wifi;
    }
}

module.exports = addSensorData