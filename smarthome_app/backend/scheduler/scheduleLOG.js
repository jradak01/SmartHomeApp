dbOperationsRedis = require('../redisFiles/dbOperations')
scheduledMethodes = require('./schedulerMethods')
const cron = require('node-cron');

const saveLogs = cron.schedule('0 0 8,20 * * *', async () => {
  try {
    const keys = await dbOperationsRedis.getKeys(`realestate:??`, 0)
    if (keys && keys.length > 0) {
      for (let k=0; k < keys.length; k++) {
        let estate = keys[k].split(':1')
        await scheduledMethodes.getChangesFromRedisToSQL(estate)
        await scheduledMethodes.getLogsForSQL(estate)
        await scheduledMethodes.deleteDataRedis(estate)
      }
    }
  } catch (err) {
    console.err('Error while trying to schedule:', err);
  }
});

module.exports = saveLogs;