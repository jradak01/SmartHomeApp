const sensorSimulation = require('./sensorSimulate')
const addSensorData = require('./sensorsData')
const dbOperationsRedis = require('../redisFiles/dbOperations')
const { publishMessage } = require('../redisFiles/dbPubSub');

const tvSimulate = async () => {
    const devices = await addSensorData('tv')
    let processedDeviceCount = 0;
    const expectedDeviceCount = devices.length;
    for (const device of devices) {
        setInterval(async () => {
            const returnValue = sensorSimulation.simulateChangingTV()
            await dbOperationsRedis.addDataToTimeSeries(`tv:${device.id_device}`, returnValue)
            processedDeviceCount++;
            if (processedDeviceCount === expectedDeviceCount) {
                await publishMessage('timeSeries', 'newTVData');
                console.log('message is published')
                processedDeviceCount = 0;
            }
        }, 10.7 * 60 * 1000);
    }
}

module.exports = tvSimulate;