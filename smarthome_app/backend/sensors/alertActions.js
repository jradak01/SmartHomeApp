const sensorSimulation = require('./sensorSimulate')
const dbOperationsRedis = require('../redisFiles/dbOperations')
const { publishMessage } = require('../redisFiles/dbPubSub');

const alertSimulate = async () => {
    const activeEstates = await dbOperationsRedis.getKeys(`realestate:??`, 0)
    for (const estate of activeEstates) {
        setInterval(async () => {
            const returnValue = sensorSimulation.simulateAlerts()
            const getKey = estate.split(':')[1]
            let type = 'info'
            if (returnValue.includes("Intrusion")
                || returnValue.includes("Fire")) {
                type = 'danger'
            } else if (returnValue.includes("Water")
                || returnValue.includes("Carbon")) {
                type = 'warning'
            }else {
                type='info'
            }
            await dbOperationsRedis.addDataToTimeSeries(`realestate:alert:${getKey}`, returnValue)
            await publishMessage('timeSeries', `newAlertData:${type}:${getKey}`);
            processedDeviceCount++;
        }, 37 * 60 * 1000);
    }
}


module.exports = alertSimulate