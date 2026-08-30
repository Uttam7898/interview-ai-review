require('dotenv').config({ path: require('path').join(__dirname, '../Backend/.env') })
const app = require('../Backend/src/app')
const connectToDB = require('../Backend/src/config/database')

module.exports = async (req, res) => {
    await connectToDB()
    return app(req, res)
}
