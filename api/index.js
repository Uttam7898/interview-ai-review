const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') })
require('dotenv').config()

const app = require('../Backend/src/app')
const connectToDB = require('../Backend/src/config/database')

// Ensure DB is connected before processing requests
app.use(async (req, res, next) => {
    try {
        await connectToDB()
    } catch (err) {
        console.error("DB connection error in serverless request:", err)
    }
    next()
})

module.exports = app
