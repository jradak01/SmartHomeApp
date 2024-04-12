const sensorSimulation = require('./sensorSimulate')
const addSensorData = require('./sensorsData')
const dbOperationsRedis = require('../redisFiles/dbOperations')
const { publishMessage } = require('../redisFiles/dbPubSub');

const wifiSimulate = async () => {
    const devices = await addSensorData('wifi')
    let processedDeviceCount = 0;
    const expectedDeviceCount = devices.length;
    if (devices) {
        for (const device of devices) {
            setInterval(async () => {
                const returnValue = sensorSimulation.simulateWiFi()
                await dbOperationsRedis.addDataToTimeSeries(`wifi:${device.id_device}`, returnValue)
                if (returnValue === 'strength0') {
                    const deviceKey = await dbOperationsRedis.getKeys(`room:*:device:${device.id_device}`, 0)
                    const newKey = deviceKey[0].split(':')[1]
                    const keyRoom = await dbOperationsRedis.getKeys(`realestate:*:room:${newKey}`, 0)
                    const estateKey = keyRoom[0].split(':')[1]
                    const message = "Your Wi-Fi connection is weak or unstable. This may result in slow internet speeds or intermittent disconnections. Please check your WiFi!";
                    await dbOperationsRedis.addDataToTimeSeries(`realestate:alert:${estateKey}`, message)
                    await publishMessage('timeSeries', `newAlertData:info:${estateKey}`);
                }
                processedDeviceCount++;
                if (processedDeviceCount === expectedDeviceCount) {
                    await publishMessage('timeSeries', `newWiFiData`);
                    console.log('message is published')
                    processedDeviceCount = 0;
                }
            }, 0.3 * 60 * 1000);
        }
    }
}


module.exports = wifiSimulate