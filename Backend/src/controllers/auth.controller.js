const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

const mongoose = require("mongoose")

function isMockMode() {
    return (process.env.MOCK_AI === "true") || (!process.env.MONGO_URI) || (mongoose.connection.readyState !== 1)
}

// In-memory stores for mock mode
const mockUsers = new Map()
const mockBlacklist = new Set()

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret"

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    if (isMockMode()) {
        const exists = Array.from(mockUsers.values()).find(u => u.username === username || u.email === email)
        if (exists) {
            return res.status(400).json({ message: "Account already exists with this email address or username" })
        }

        const hash = await bcrypt.hash(password, 10)
        const id = `mock-${Math.random().toString(36).slice(2,9)}`
        const user = { _id: id, username, email, password: hash }
        mockUsers.set(id, user)

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" })
        const isProd = process.env.NODE_ENV === 'production'
const cookieOptions = { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd }
        res.cookie("token", token, cookieOptions)

            return res.status(201).json({ message: "User registered successfully", token, user: { id: user._id, username: user.username, email: user.email } })
    }

    const isUserAlreadyExists = await userModel.findOne({ $or: [ { username }, { email } ] })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({ username, email, password: hash })

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" })
    const isProd = process.env.NODE_ENV === 'production'
const cookieOptions = { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd }

    res.cookie("token", token, cookieOptions)

        res.status(201).json({ message: "User registered successfully", token, user: { id: user._id, username: user.username, email: user.email } })

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body
    if (isMockMode()) {
        let user = Array.from(mockUsers.values()).find(u => u.email.toLowerCase() === email.toLowerCase())
        if (!user) {
            // In mock mode without MongoDB, auto-create the user so login always succeeds for testing
            const hash = await bcrypt.hash(password, 10)
            const id = `mock-${Math.random().toString(36).slice(2, 9)}`
            const username = email.split('@')[0] || "user"
            user = { _id: id, username, email, password: hash }
            mockUsers.set(id, user)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" })

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" })
        const isProd = process.env.NODE_ENV === 'production'
        const cookieOptions = { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd }
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({ message: "User loggedIn successfully.", token, user: { id: user._id, username: user.username, email: user.email } })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" })
    const isProd = process.env.NODE_ENV === 'production'
    const cookieOptions = { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd }

    res.cookie("token", token, cookieOptions)
    res.status(200).json({ message: "User loggedIn successfully.", token, user: { id: user._id, username: user.username, email: user.email } })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token
    const isProd = process.env.NODE_ENV === 'production'
    const cookieOptions = { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd }
    if (token) {
        if (isMockMode()) {
            mockBlacklist.add(token)
        } else {
            await tokenBlacklistModel.create({ token })
        }
    }

    res.clearCookie("token", cookieOptions)

    res.status(200).json({ message: "User logged out successfully" })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    if (isMockMode()) {
        let user = mockUsers.get(req.user.id)
        if (!user) {
            // Reconstruct mock user if server restarted in mock mode
            const username = req.user.username || "user"
            user = { _id: req.user.id, username, email: `${username}@example.com` }
            mockUsers.set(req.user.id, user)
        }
        return res.status(200).json({ message: "User details fetched successfully", user: { id: user._id, username: user.username, email: user.email } })
    }

    const user = await userModel.findById(req.user.id)

    res.status(200).json({ message: "User details fetched successfully", user: { id: user._id, username: user.username, email: user.email } })

}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}