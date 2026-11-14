
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const ADMIN_USERNAME = 'admin'
    const ADMIN_EMAIL = 'admin@spicesoiree.com'
    const ADMIN_PASSWORD = 'Spice@Admin2026'

    if (
      username.trim() === ADMIN_USERNAME &&
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      setError('')
      navigate('/admin-dashboard')
    } else {
      setError('Invalid credentials. Admin access denied.')
      setPassword('')
    }
  }

  return (
    <div className="admin-login-page">

      <div className="admin-background-shape shape-one"></div>
      <div className="admin-background-shape shape-two"></div>

      <div className="admin-login-container">

        <div className="admin-login-left">

          <div className="admin-brand">
            <div className="admin-brand-icon">S</div>
            <div>
              <h2>SPICE SOIRÉE</h2>
              <span>RESTAURANT MANAGEMENT</span>
            </div>
          </div>

          <div className="admin-left-content">
            <span className="admin-welcome-tag">
              ADMINISTRATION PORTAL
            </span>

            <h1>
              Manage Your
              <span> Restaurant </span>
              With Excellence.
            </h1>

            <p>
              Welcome to your exclusive administration portal.
              Manage restaurant operations, orders and business
              activities from one secure place.
            </p>

            <div className="admin-feature-list">
              <div>
                <span>✓</span>
                <p>Centralized Management</p>
              </div>

              <div>
                <span>✓</span>
                <p>Smart Restaurant Operations</p>
              </div>

              <div>
                <span>✓</span>
                <p>Exclusive Admin Access</p>
              </div>
            </div>
          </div>

          <div className="admin-left-footer">
            <span>© 2026 Spice Soirée</span>
            <span>Private Admin Portal</span>
          </div>

        </div>

        <div className="admin-login-right">

          <div className="admin-form-wrapper">

            <div className="admin-secure-icon">
              <span>♙</span>
            </div>

            <span className="admin-form-tag">
              SECURE ACCESS
            </span>

            <h2>Admin Portal</h2>

            <p className="admin-subtitle">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit}>

              <div className="admin-input-group">
                <label htmlFor="admin-username">
                  Username
                </label>

                <div className="admin-input-wrapper">
                  <span className="admin-field-icon">♙</span>
                  <input
                    type="text"
                    id="admin-username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError('')
                    }}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="admin-email">
                  Email Address
                </label>

                <div className="admin-input-wrapper">
                  <span className="admin-field-icon">✉</span>
                  <input
                    type="email"
                    id="admin-email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="admin-password">
                  Password
                </label>

                <div className="admin-input-wrapper">
                  <span className="admin-field-icon">♧</span>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="admin-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="admin-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="admin-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="admin-login-button"
              >
                <span>Access Dashboard</span>
                <span className="admin-button-arrow">→</span>
              </button>

            </form>

            <div className="admin-secure-note">
              <span>♢</span>
              Authorized administrators only
            </div>

            <button
              type="button"
              className="admin-back-home"
              onClick={() => navigate('/')}
            >
              ← Back to Website
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminLogin
