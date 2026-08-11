import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import './navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <header className="main-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <div className="brand-text">
                        <span className="brand-name">Interview<span className="brand-accent">AI</span></span>
                        <span className="brand-tag">Strategy Engine</span>
                    </div>
                </Link>

                <div className="navbar-actions">
                    {user && (
                        <div className="user-profile-badge">
                            <div className="avatar">
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="username">{user.username || user.email}</span>
                        </div>
                    )}
                    
                    <button onClick={onLogout} className="logout-btn" title="Sign Out">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar
