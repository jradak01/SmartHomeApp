const fastDeviceRouter = require('express').Router()
dbOperationsRedis = require('../redisFiles/dbOperations')

fastDeviceRouter.get('/:realestate/:id', async (req, res) => {
    const getDeviceKeys = await dbOperationsRedis.getKeys(`realestate:${req.params.realestate}:fastcontrols:${req.params.id}`, 1)
    if (getDeviceKeys && getDeviceKeys.length > 0) {
        let device = await dbOperationsRedis.getAllDataFromHash(getDeviceKeys[0], 1)
        const newDevice = {
            id_device: req.params.id,
            ...device
        }
        res.json(newDevice)
    } else {
        console.log('Nema pronađenih uređaja');
        res.status(404).json({ error: 'Nema pronađenih uređaja' });
    }
})

fastDeviceRouter.put('/:id', async (req, res) => {
    const getDeviceKey = await dbOperationsRedis.getKeys(`realestate:*:fastcontrols:${req.params.id}`, 1)
    if (getDeviceKey && getDeviceKey.length > 0) {
        const results = await dbOperationsRedis.saveDataToHash(
            getDeviceKey[0], req.body, 1
        );
        console.log(results)
        res.json(results)
    } else {
        console.log('Nema pronađenih uređaja');
        res.status(404).json({ error: 'Nema pronađenih uređaja' });
    }
})
fastDeviceRouter.post('/:realestate/:id', async (req, res) => {
    const newData = {
        enabled: req.body.enabled.toString()
    }
    const results = await dbOperationsRedis.saveDataToHash(
        `realestate:${req.params.realestate}:fastcontrols:${req.params.id}`, 
        newData, 1
    );
    res.json(results)
})

module.exports = fastDeviceRouter;
