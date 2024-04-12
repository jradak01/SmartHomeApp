const usersRouter = require('express').Router()
dbOperationSQLUsers = require('../sqlFiles/dbOperationUsers')
dbOperationsRedis = require('../redisFiles/dbOperations')

//get
usersRouter.get('/', async (req, res) => {
    const results = await dbOperationSQLUsers.getHouseUsers();
    res.json(results)
})

usersRouter.get('/:id_realestate/:id', async (req, res) => {
    // const results = await dbOperationSQLUsers.getOneUser(req.params.id);
    const results = await dbOperationsRedis
        .getAllDataFromHash(`realestate:${req.params.id_realestate}:user:${req.params.id}`, 0)
    res.json(results)
})
usersRouter.get('/:id', async (req, res) => {
    const getKey = await dbOperationsRedis.getKeys(`realestate:*:user:${req.params.id}`, 0)
    let index = getKey[0].split(':')[1]
    // const results = await dbOperationSQLUsers.getRealEstateOfUser(req.params.id)
    const results = await dbOperationsRedis
        .getAllDataFromHash(`realestate:${index}`, 0);
    res.json(results)
})

usersRouter.post('/getusers/:id', async (req, res) => {
    const getKeys = await dbOperationsRedis.getKeys(`realestate:${req.params.id}:user:*`, 0);
    console.log(getKeys)
    const results = [];

    for (const key of getKeys) {
        const data = await dbOperationsRedis.getAllDataFromHash(key, 0);
        results.push(data);
    }
    // const results = await dbOperationSQLUsers.getHouseUsersOnAddress(req.body.realEstate);
    res.json(results)
})

//post
usersRouter.post('/:id', async (req, res) => {
    // const results = await dbOperationSQLUsers.addHouseUser(req.body);
    const getIndex = await dbOperationsRedis.getDataFromString(`index:house_user`, 0)
    const maxIndex = parseInt(getIndex) + 1
    const newData = {
        id_user: maxIndex,
        ...req.body,
        cold_password: req.body.password,
        new_password: req.body.password
    };
    const results = await dbOperationsRedis.saveDataToHash(
        `realestate:${req.params.id}:user:${maxIndex}`,
        newData, 0
    );
    await dbOperationsRedis.addDataToSet(
        `realestate:${req.params.id}:changes`,
        `post:user:${maxIndex}`, 0
    );
    await dbOperationsRedis.addDataToString(`index:house_user`, maxIndex.toString(), 0)
    res.json(results)
})


//delete
usersRouter.delete('/:realestate_id/:id', async (req, res) => {
    // const results = await dbOperationSQLUsers.deleteHouseUser(req.params.id);
    const results = await dbOperationsRedis
        .delKeys(`realestate:${req.params.realestate_id}:user:${req.params.id}`, 0)
    await dbOperationsRedis.addDataToSet(
        `realestate:${req.params.realestate_id}:changes`,
        `delete:user:${req.params.id}`, 0
    );
    res.json(results)
})
//put
usersRouter.put('/:realestate_id', async (req, res) => {
    // const results = await dbOperationSQLUsers.updateHouseUser(req.body);
    const newData = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        new_password: req.body.password,
        cold_password: req.body.old_password,
        houseEntry: req.body.houseEntry,
        phone: req.body.phone
    }
    const results = await dbOperationsRedis.saveDataToHash(
        `realestate:${req.params.realestate_id}:user:${req.body.id_user}`,
        newData, 0
    );
    await dbOperationsRedis.addDataToSet(
        `realestate:${req.params.realestate_id}:changes`,
        `put:user:${req.body.id_user}`, 0
    );
    res.json(results)
})


module.exports = usersRouter;