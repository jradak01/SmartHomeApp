const estateRouter = require('express').Router()
dbOperationRealEstate = require('../sqlFiles/dbOperationRealEstate')

// get real estate

estateRouter.get('/:id', async (req, res) => {
    // const results = await dbOperationRealEstate.getRooms(req.params.id);
    const getKeys = await dbOperationsRedis.getKeys(`realestate:${req.params.id}:room:*`, 0);
    const results = [];

    for (const key of getKeys) {
        const data = await dbOperationsRedis.getAllDataFromHash(key, 0);
        results.push(data);
    }
    res.json(results)
})

module.exports = estateRouter;