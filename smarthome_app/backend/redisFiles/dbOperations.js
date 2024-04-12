const redis = require('redis');
const { redisClient } = require('./dbConfig');

const saveDataToHash = async (key, data, db) => {
  await redisClient.select(db);
  try {
    const result = await redisClient.hSet(key, data);
    return result
  } catch (err) {
    console.error('Error while saving:', err);
  }
};
const saveFieldDataToHash = async (key, field, value, db) => {
  await redisClient.select(db);
  try {
    const result = await redisClient.hSet(key, field, value);
    return result;
  } catch (err) {
    console.error('Error while saving:', err);
  }
};
const getDataFromHash = async (hashKey, field, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.hGet(hashKey, field);
    return result;
  } catch (err) {
    console.error('Retrieval error:', err);
    return null;
  }
};
const getAllDataFromHash = async (hashKey, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.hGetAll(hashKey);
    return result;
  } catch (err) {
    console.error('Retrieval error:', err);
    return null;
  }
};

const addDataToTimeSeries = async (sensorKey, value) => {
  try {
    await redisClient.select(1);
    const result = await redisClient.sendCommand(['XADD', `${sensorKey}`, '*', 'value', value], function (err, reply) {
      console.log(err, reply);
    });
    return result;
  } catch (error) {
    console.error('Error adding hset:', error);
    throw error;
  }
};

const getLastDataFromTimeSeries = async (sensorKey) => {
  try {
    await redisClient.select(1);
    const result = await redisClient.sendCommand(['XRANGE', sensorKey, '-', '+'], function (err, reply) {
      console.log(err, reply);
    })
    const lastMessage = result[result.length - 1][1];
    return lastMessage;
  } catch (error) {
    console.error('Error retrieving last stream from Time Series:', error);
    throw error;
  }
};

const getTodaysDataFromTimeSeries = async (sensorKey, number = '10') => {
  try {
    await redisClient.select(1);
    const result = await redisClient.sendCommand(['XREAD','COUNT', number, 'STREAMS', sensorKey, '0'+'-'+'0'], function (err, reply) {
      console.log(err, reply);
    })
    return result;
  } catch (error) {
    console.error('Error retrieving last stream from Time Series:', error);
    throw error;
  }
}

const addDataToSet = async (key, set, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.sAdd(key, set);
    return result;
  } catch (error) {
    console.error('Error adding set:', error);
    throw error;
  }
};

const getDataFromSet = async (key, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.sMembers(key);
    return result;
  } catch (error) {
    console.error('Error retrieving set:', error);
    throw error;
  }
};

const addDataToString = async (key, value, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.set(key, value);
    return result;
  } catch (error) {
    console.error('Error adding string', error);
  }
}

const getDataFromString = async (key, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.get(key);
    return result;
  } catch (err) {
    console.error('Retrieval error:', err);
    return null;
  }
}

const getKeys = async (pattern, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.keys(pattern);
    return result;
  } catch (err) {
    console.error('Retrieval error:', err);
    return null;
  }
}

const delKeys = async (key, db) => {
  try {
    await redisClient.select(db);
    const result = await redisClient.del(key);
    return result;
  } catch (err) {
    console.error('Data can not be removed', err)
    return null
  }
}


module.exports = {
  saveDataToHash,
  saveFieldDataToHash,
  getDataFromHash,
  getAllDataFromHash,
  addDataToTimeSeries,
  getLastDataFromTimeSeries,
  getTodaysDataFromTimeSeries,
  addDataToSet,
  getDataFromSet,
  addDataToString,
  getDataFromString,
  getKeys,
  delKeys,
}