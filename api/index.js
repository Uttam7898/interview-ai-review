const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../Backend/.env') })
require('dotenv').config()

const app = require('../Backend/src/app')
const connectToDB = require('../Backend/src/config/database')

let isDbConnected = false

module.exports = async (req, res) => {
    try {
        if (!isDbConnected) {
            await connectToDB()
            isDbConnected = true
        }
    } catch (err) {
        console.error("DB connection error in serverless function:", err)
    }

    return app(req, res)
}

