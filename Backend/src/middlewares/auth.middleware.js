const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



const USE_MOCK = !process.env.MONGO_URI

async function authUser(req, res, next) {

    console.log('Auth middleware - cookies:', req.cookies)

    // Accept token from cookie or Authorization header (Bearer)
    const headerToken = req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]
    const token = req.cookies.token || headerToken

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    if (!USE_MOCK) {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "token is invalid"
            })
        }
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-jwt-secret")

        req.user = decoded

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


module.exports = { authUser }