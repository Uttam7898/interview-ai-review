import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
    withCredentials: true
})

// Dynamic request interceptor to ensure auth token is always included
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => Promise.reject(error))

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        // persist token (dev fallback if cookies not set)
        if (response.data && response.data.token) {
            localStorage.setItem('auth_token', response.data.token)
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        }

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        if (response.data && response.data.token) {
            localStorage.setItem('auth_token', response.data.token)
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
        }

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        // clear persisted token
        localStorage.removeItem('auth_token')
        delete api.defaults.headers.common['Authorization']

        return response.data

    } catch (err) {
        throw err
    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }

}