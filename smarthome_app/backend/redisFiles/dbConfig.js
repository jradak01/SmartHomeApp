const configs = require('../utils/config');
const redis = require('redis');

const redisOptions = {
  host: 'localhost',
  port: configs.REDIS_PORT,
};

const redisClient = redis.createClient(redisOptions);
const publisher = redis.createClient(redisOptions);
const subscriber = redis.createClient(redisOptions);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
  console.error('Error while connecting to Redis', err);
});

publisher.on('connect', () => {
  console.log('Connected to Redis (publisher)');
});
publisher.on('error', (err) => {
  console.error('Error while connecting to Redis', err);
});

subscriber.on('connect', () => {
  console.log('Connected to Redis (subscriber)');
});
subscriber.on('error', (err) => {
  console.error('Error while connecting to Redis', err);
});

subscriber.on('message', (channel, message) => {
  console.log(`Received message from channel ${channel}: ${message}`);
});

redisClient.connect()
publisher.connect()
subscriber.connect()

module.exports = { redisClient, publisher, subscriber };
