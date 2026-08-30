const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.set("trust proxy", 1)

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:5175,http://127.0.0.1:5176,http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(express.json())
app.use(cookieParser())
// Robust CORS middleware
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.split(',').some(o => o.trim() === origin))
        ) {
            return callback(null, true)
        }

        return callback(null, true)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Cookie"]
}

app.use(cors(corsOptions))
app.options("*", cors(corsOptions))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled API Error:", err)
    res.status(500).json({ message: err.message || "Internal Server Error" })
})

module.exports = app