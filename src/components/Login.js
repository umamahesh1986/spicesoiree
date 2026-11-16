import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROLES, homeForRole, useAuth } from '../auth'
import AuthShell, { AuthError, AuthField } from './AuthShell'

// Single login screen for admins and customers.
// After login: admin -> /admin, customer -> the page they came from (or /account).
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from
  const cameFromCheckout = Boolean(from) && !from.pathname.startsWith('/admin')

  function destinationFor(loggedInUser) {
    if (loggedInUser.role === ROLES.ADMIN) return { pathname: '/admin' }
    // Customers go back to the page that asked them to log in (e.g. checkout)
    if (cameFromCheckout) return from
    return { pathname: homeForRole(loggedInUser.role) }
  }

  // Already logged in: skip the form
  if (user && !submitting) {
    const target = destinationFor(user)
    return <Navigate to={target.pathname} state={target.state} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const loggedInUser = await login(identifier.trim(), password)
      const target = destinationFor(loggedInUser)
      navigate(target.pathname, { replace: true, state: target.state })
    } catch (err) {
      setError(
        err.status
          ? err.message
          : 'Unable to reach the server. Please try again.'
      )
      setPassword('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      tag="SECURE LOGIN"
      title="Login"
      subtitle={
        cameFromCheckout
          ? 'Please log in to continue with your order'
          : 'Enter your details to continue'
      }
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          id="login-identifier"
          label="Email or Mobile Number"
          icon="✉"
          type="text"
          placeholder="you@example.com or 98765 43210"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value)
            setError('')
          }}
          autoComplete="username"
          required
        />

        <div className="admin-input-group">
          <label htmlFor="login-password">Password</label>
          <div className="admin-input-wrapper">
            <span className="admin-field-icon">♧</span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="login-password"
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

        <AuthError message={error} />

        <button
          type="submit"
          className="admin-login-button"
          disabled={submitting}
        >
          <span>{submitting ? 'Logging in...' : 'Login'}</span>
          <span className="admin-button-arrow">→</span>
        </button>
      </form>

      <div className="admin-secure-note">
        New customer?&nbsp;
        <Link to="/register" state={location.state}>
          Create an account
        </Link>
      </div>
    </AuthShell>
  )
}

export default Login
