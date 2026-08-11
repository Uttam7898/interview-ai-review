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
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-side calls)
        if (!origin) return callback(null, true)

        // Check explicit allowed origins or any vercel app domain
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, true)
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`))
    },
    credentials: true
}))

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
module.exports = app