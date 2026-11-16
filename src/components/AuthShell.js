import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

// Shared two-panel layout for the Login and Register screens.
function AuthShell({ tag, title, subtitle, children }) {
  const navigate = useNavigate()

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
              <span>BIRYANI • CURRIES • FRESH MEAT</span>
            </div>
          </div>

          <div className="admin-left-content">
            <span className="admin-welcome-tag">WELCOME</span>

            <h1>
              Order Your
              <span> Favourites </span>
              In A Few Taps.
            </h1>

            <p>
              Sign in to place orders, pre-order curries and book fresh meat.
              Restaurant staff use the same screen to reach the admin portal.
            </p>

            <div className="admin-feature-list">
              <div>
                <span>✓</span>
                <p>One login for customers and staff</p>
              </div>
              <div>
                <span>✓</span>
                <p>Your details saved for faster checkout</p>
              </div>
              <div>
                <span>✓</span>
                <p>Secure, encrypted passwords</p>
              </div>
            </div>
          </div>

          <div className="admin-left-footer">
            <span>© 2026 Spice Soirée</span>
            <span>Secure Login</span>
          </div>
        </div>

        <div className="admin-login-right">
          <div className="admin-form-wrapper">
            <div className="admin-secure-icon">
              <span>♙</span>
            </div>

            <span className="admin-form-tag">{tag}</span>
            <h2>{title}</h2>
            <p className="admin-subtitle">{subtitle}</p>

            {children}

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

export function AuthField({ id, label, icon, ...inputProps }) {
  return (
    <div className="admin-input-group">
      <label htmlFor={id}>{label}</label>
      <div className="admin-input-wrapper">
        <span className="admin-field-icon">{icon}</span>
        <input id={id} {...inputProps} />
      </div>
    </div>
  )
}

export function AuthError({ message }) {
  if (!message) return null
  return (
    <div className="admin-error" role="alert">
      <span>!</span>
      {message}
    </div>
  )
}

export default AuthShell
