const express = require('express')
const app = express()
require('express-async-errors')

const usersRouter = require('./controllers/users')
const estateRouter = require('./controllers/realEstates')
const devicesRouter = require('./controllers/devices')
const loginRouter = require('./controllers/login')
const fastDeviceRouter = require('./controllers/fastDevice')

const sensorSimulate = require('./sensors/sensorActions')
const userSimulate = require('./sensors/userActions')
const tvSimulate = require('./sensors/tvActions')
const musicSimulate = require('./sensors/musicActions')
const wifiSimulate = require('./sensors/wifiActions')
const alertSimulate = require('./sensors/alertActions')
// const task = require('./scheduler/scheduleLOG')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/estates', estateRouter)
app.use('/api/devices', devicesRouter)
app.use('/api/fastdevice', fastDeviceRouter)

sensorSimulate()
userSimulate()
tvSimulate()
musicSimulate()
wifiSimulate()
alertSimulate()

// task.start()

module.exports = app