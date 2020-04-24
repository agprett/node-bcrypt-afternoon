const express = require('express')
const session = require('express-session')
const massive = require('massive')
require('dotenv').config()
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./ middleware/authMiddleware')
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

const app = express()

app.use(express.json())
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: SESSION_SECRET
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.userOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.userOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.userOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
}).then(dbInstance => {
  app.set('db', dbInstance)
  console.log("DB connected")
  app.listen(SERVER_PORT, () => console.log(`Docked at port ${SERVER_PORT}`))
})
