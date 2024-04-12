const redis = require('redis');
const { publisher, subscriber } = require('./dbConfig');

const publishMessage = async (channel, message) => {
    await publisher.publish(channel, message)
}

const subscribeToChannel = async (channel, activate) => {
    await subscriber.subscribe(channel, (message) => {
        console.log(message)
        activate(message)
    });
}

function publishMessagesPeriodically(channel, message, interval) {
    setInterval(() => {
        publishMessage(channel, message)
    }, interval);
}
// publishMessagesPeriodically('TimeSeries', 'hey', 10000);
// subscribeToChannel('TimeSeries')


module.exports = { publishMessage, publishMessagesPeriodically, subscribeToChannel }