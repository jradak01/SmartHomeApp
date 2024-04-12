const sensorSimulation = require('./sensorSimulate')
const addSensorData = require('./sensorsData')
const dbOperationsRedis = require('../redisFiles/dbOperations')
const { publishMessage } = require('../redisFiles/dbPubSub');

const musicSimulate = async () => {
    const devices = await addSensorData('music')
    let processedDeviceCount = 0;
    const expectedDeviceCount = devices.length;
    for (const device of devices) {
        setInterval(async () => {
            const returnValue = sensorSimulation.simulateChangingSongs()
            await dbOperationsRedis.addDataToTimeSeries(`music:${device.id_device}`, returnValue)
            processedDeviceCount++;
            if (processedDeviceCount === expectedDeviceCount) {
                await publishMessage('timeSeries', 'newMusicData');
                console.log('message is published')
                processedDeviceCount = 0;
            }
        }, 3.6 * 60 * 1000);
    }
}


module.exports = musicSimulate