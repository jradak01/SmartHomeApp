const sensorSimulation = require('./sensorSimulate')
const addSensorData = require('./sensorsData')
const dbOperationsRedis = require('../redisFiles/dbOperations')
const { publishMessage } = require('../redisFiles/dbPubSub');

const sensorSimulate = async () => {
    const sensors = await addSensorData('sensor')
    let processedSensorCount = 0;
    const expectedSensorCount = sensors.length;
    for (const sensor of sensors) {
        const filteredSettings = sensor.settings.filter((setting) => setting.name === 'measure');
        let sensorValue = filteredSettings[0].value === '°C' ? 54 : 100;
        setInterval(async () => {
            const returnValue = sensorSimulation.simulateSensor(sensorValue)
            await dbOperationsRedis.addDataToTimeSeries(`sensor:${sensor.id_device}`, returnValue.toString())
            processedSensorCount++; // Povećaj brojač obrađenih senzora
            if (processedSensorCount === expectedSensorCount) {
                await publishMessage('timeSeries', 'newSensorData');
                console.log('message is published')
                processedSensorCount = 0;
            }
        }, 60 * 1000);
    }
};

module.exports = sensorSimulate;
