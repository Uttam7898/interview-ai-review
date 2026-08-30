const mongoose = require("mongoose")

mongoose.set('bufferCommands', false)

async function connectToDB() {

    try {
        if (!process.env.MONGO_URI) {
            console.warn('MONGO_URI not set — skipping database connection (mock mode)')
            return
        }

        if (mongoose.connection.readyState >= 1) {
            return
        }

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        })

        console.log("Connected to Database")
    }
    catch (err) {
        console.error("MongoDB Connection Error:", err.message)
    }
}

module.exports = connectToDB