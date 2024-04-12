const sensorSimulation = require('./sensorSimulate')
const addUsers = require('./userData')
const dbOperationsRedis = require('../redisFiles/dbOperations')
const { publishMessage } = require('../redisFiles/dbPubSub');

const userSimulate = async () => {
    const users = await addUsers()
    let processedUserCount = 0;
    const expectedUserCount = users.length;
    for (const user of users){
        setInterval(async() =>{
            const returnValue = sensorSimulation.simulateUsersInHouse()
            await dbOperationsRedis.addDataToTimeSeries(`user:${user.id_user}`, returnValue.toString())
            processedUserCount++;
            if (processedUserCount === expectedUserCount) {
                await publishMessage('timeSeries', 'newUserData');
                console.log('message is published')
                processedUserCount = 0;
            }
        }, 15.3 * 60 * 1000);
    }
}

module.exports=userSimulate