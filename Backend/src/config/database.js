const mongoose = require("mongoose")



async function connectToDB() {

    try {
        if (!process.env.MONGO_URI) {
            console.warn('MONGO_URI not set — skipping database connection (mock mode)')
            return
        }

        await mongoose.connect(process.env.MONGO_URI)

        console.log("Connected to Database")
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = connectToDB