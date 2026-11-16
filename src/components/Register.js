import React, { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { homeForRole, useAuth } from '../auth'
import AuthShell, { AuthError, AuthField } from './AuthShell'

// Customer self-registration. Admin accounts cannot be created here;
// the server always assigns role = customer.
function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, register } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from

  if (user && !submitting) {
    return <Navigate to={homeForRole(user.role)} replace />
  }

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })
      // Back to the page that required login (e.g. booking), else My Account
      if (from) navigate(from.pathname, { replace: true, state: from.state })
      else navigate('/account', { replace: true })
    } catch (err) {
      setError(
        err.status ? err.message : 'Unable to reach the server. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      tag="NEW CUSTOMER"
      title="Create Account"
      subtitle="Register once to order faster next time"
    >
      <form onSubmit={handleSubmit}>
        <AuthField
          id="register-name" name="name" label="Full Name" icon="♙"
          placeholder="Your name" autoComplete="name"
          value={form.name} onChange={update} required
        />
        <AuthField
          id="register-email" name="email" type="email" label="Email Address" icon="✉"
          placeholder="you@example.com" autoComplete="email"
          value={form.email} onChange={update} required
        />
        <AuthField
          id="register-phone" name="phone" type="tel" label="Mobile Number" icon="☎"
          placeholder="10-digit mobile number" autoComplete="tel"
          value={form.phone} onChange={update} required
        />
        <AuthField
          id="register-password" name="password" type="password" label="Password" icon="♧"
          placeholder="At least 8 characters, letters and numbers" autoComplete="new-password"
          value={form.password} onChange={update} required minLength={8}
        />
        <AuthField
          id="register-confirm" name="confirmPassword" type="password" label="Confirm Password" icon="♧"
          placeholder="Re-enter password" autoComplete="new-password"
          value={form.confirmPassword} onChange={update} required
        />

        <AuthError message={error} />

        <button type="submit" className="admin-login-button" disabled={submitting}>
          <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
          <span className="admin-button-arrow">→</span>
        </button>
      </form>

      <div className="admin-secure-note">
        Already have an account?&nbsp;
        <Link to="/login" state={location.state}>
          Login
        </Link>
      </div>
    </AuthShell>
  )
}

export default Register
