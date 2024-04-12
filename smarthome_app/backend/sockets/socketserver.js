const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5000 });
const dbOperations = require('../redisFiles/dbOperations');
const { subscribeToChannel } = require('../redisFiles/dbPubSub');

wss.on('connection', (ws) => {
    console.log('New connection established');
    ws.on('message', (message) => {
        console.log(message.toString())
        if (message.toString() === 'Mounted') {
            handleWebSocketMessage('User')
            handleWebSocketMessage('Sensor')
            handleWebSocketMessage('TV')
            handleWebSocketMessage('Music')
        }
    })
    ws.on('close', () => {
        console.log('Veza zatvorena');
    });
});

wss.on('listening', () => {
    console.log('WebSocket server started');
});

wss.on('error', (error) => {
    console.error('Error starting WebSocket server:', error);
});

const sendWebSocketMessageToClient = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
    if (message === 'newSensorData') {
        handleWebSocketMessage('Sensor');
    } if (message === 'newUserData') {
        handleWebSocketMessage('User')
    } if (message === 'newTVData') {
        handleWebSocketMessage('TV')
    } if (message === 'newMusicData') {
        handleWebSocketMessage('Music')
    } if (message === 'newWiFiData') {
        handleWebSocketMessage('Wifi')
    } if (message.split(':')[0] === 'newAlertData') {
        const parts = message.split(':');
        const info = parts[1];
        const realestate = parts[2]
        handleWebSocketMessage(`Alert:${info}:${realestate}`)
    }
}

subscribeToChannel('timeSeries', sendWebSocketMessageToClient);

const handleWebSocketMessage = async (message) => {
    console.log('Primljena poruka:', message);
    try {
        let lastData = [];
        if (message === 'Sensor') {
            const sensorKeys = await dbOperations.getKeys(`sensor:*`, 1);
            for (const key of sensorKeys) {
                const data = await dbOperations.getLastDataFromTimeSeries(key);
                lastData.push({
                    sensor: key.split(':')[1],
                    value: data[1],
                });
            }
        } if (message === 'User') {
            const userKeys = await dbOperations.getKeys(`user:*`, 1);
            for (const key of userKeys) {
                const data = await dbOperations.getLastDataFromTimeSeries(key);
                lastData.push({
                    user: key.split(':')[1],
                    value: data[1],
                });
            }
        } if (message === 'TV') {
            const tvKeys = await dbOperations.getKeys(`tv:*`, 1);
            for (const key of tvKeys) {
                const data = await dbOperations.getLastDataFromTimeSeries(key);
                lastData.push({
                    tv: key.split(':')[1],
                    value: data[1],
                });
            }
        } if (message === 'Music') {
            const musicKeys = await dbOperations.getKeys(`music:*`, 1);
            for (const key of musicKeys) {
                const data = await dbOperations.getLastDataFromTimeSeries(key);
                lastData.push({
                    music: key.split(':')[1],
                    value: data[1],
                });
            }
        } if (message === 'Wifi') {
            const wifiKeys = await dbOperations.getKeys(`wifi:*`, 1);
            for (const wifiKey of wifiKeys) {
                const data = await dbOperations.getLastDataFromTimeSeries(wifiKey);
                lastData.push({
                    wifi: wifiKey.split(':')[1],
                    value: data[1],
                });
                console.log(lastData)
            }
        } if (message.split(':')[0] === 'Alert') {
            const parts = message.split(':')
            const estate = parts[2]
            const alertKey = await dbOperations.getKeys(`realestate:alert:${estate}`, 1);
            if (alertKey.length>0) {
                const data = await dbOperations.getTodaysDataFromTimeSeries(alertKey[0]);
                let iterData = data[0][1]
                if (iterData.length > 0) {
                    for (let i = 0; i < data[0][1].length; i++) {
                        const el = iterData[i]
                        lastData.push({
                            alert: parts[1],
                            timestamp: el[0],
                            value: el[1][1]
                        });
                    }
                    console.log(lastData)
                }
            }
        }
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(lastData));
            }
        });
    } catch (error) {
        console.error('Greška prilikom dohvaćanja posljednjih podataka:', error);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ error: 'Greška prilikom dohvaćanja posljednjih podataka' }));
            }
        });
    }
}

