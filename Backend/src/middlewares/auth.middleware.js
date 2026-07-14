const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



const USE_MOCK = !process.env.MONGO_URI

async function authUser(req, res, next) {

    const token = req.cookies.token

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