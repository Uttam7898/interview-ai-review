import { createContext, useState, useEffect } from "react";
import { getMe, login, register, logout } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState(null)

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setAuthError(null)
        try {
            const data = await login({ email, password })
            if (data?.user) {
                setUser(data.user)
                return true
            }
            setUser(null)
            setAuthError("Failed to log in. Please check credentials.")
            return false
        } catch (err) {
            setUser(null)
            setAuthError(err.response?.data?.message || "Invalid email or password")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setAuthError(null)
        try {
            const data = await register({ username, email, password })
            if (data?.user) {
                setUser(data.user)
                return true
            }
            setUser(null)
            setAuthError("Registration failed. Please try again.")
            return false
        } catch (err) {
            setUser(null)
            setAuthError(err.response?.data?.message || "Could not register account")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const initUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                } else {
                    setUser(null)
                }
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        initUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, authError, setAuthError, handleLogin, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}