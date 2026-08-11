import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ submitting, setSubmitting ] = useState(false)

    const { authError, setAuthError, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const success = await handleRegister({ username, email, password })
        setSubmitting(false)
        if (success) {
            navigate("/")
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                    </div>
                    <h1>Create Account</h1>
                    <p>Start building personalized AI interview strategies</p>
                </div>

                {authError && (
                    <div className="auth-error-alert" role="alert">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span>{authError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => { setAuthError(null); setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='alexdev' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            value={email}
                            onChange={(e) => { setAuthError(null); setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='alex@example.com' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => { setAuthError(null); setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='••••••••' required />
                    </div>

                    <button type="submit" disabled={submitting} className='button primary-button auth-submit-btn'>
                        {submitting ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer-text">Already have an account? <Link to={"/login"}>Log in</Link></p>
            </div>
        </main>
    )
}

export default Register