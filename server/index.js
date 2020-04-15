const express = require('express')
const session = require('express-session')
const massive = require('massive')
require('dotenv').config()
const authCtrl = require('./controllers/authController')
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
