import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { useAuth } from '../auth'
import './admin/Admin.css'

// Customer-only screen (route guarded by <RequireAuth role="customer">).
function MyAccount() {
  const navigate = useNavigate()
  const { user, setUser, startSession, logout } = useAuth()

  const [profile, setProfile] = useState({ name: user.name, phone: user.phone || '' })
  const [profileStatus, setProfileStatus] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [savingPassword, setSavingPassword] = useState(false)

  const saveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const { user: updated } = await authApi.updateProfile(profile)
      setUser(updated)
      setProfileStatus({ ok: true, text: 'Profile updated.' })
    } catch (err) {
      setProfileStatus({ ok: false, text: err.message })
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) {
      setPasswordStatus({ ok: false, text: 'New passwords do not match.' })
      return
    }
    setSavingPassword(true)
    try {
      // Server returns a fresh token; other devices are signed out.
      startSession(await authApi.changePassword(passwords.current, passwords.next))
      setPasswords({ current: '', next: '', confirm: '' })
      setPasswordStatus({ ok: true, text: 'Password changed. Other devices have been signed out.' })
    } catch (err) {
      setPasswordStatus({ ok: false, text: err.message })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <main className="account-page">
      <h1>My Account</h1>
      <p>
        Welcome, <strong>{user.name}</strong> ({user.email})
      </p>

      <div className="account-links">
        <Link to="/orders">My Orders</Link>
        <Link to="/menu">Order from Menu</Link>
        <Link to="/PreOrderCurries">Pre-Order Curries</Link>
        <Link to="/FreshMeatEggs">Fresh Meat & Eggs</Link>
        <Link to="/cart">My Cart</Link>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="account-grid">
        <form className="account-card" onSubmit={saveProfile}>
          <h2>Profile</h2>

          <label htmlFor="account-name">Name</label>
          <input
            id="account-name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <label htmlFor="account-email">Email</label>
          <input id="account-email" value={user.email} disabled />

          <label htmlFor="account-phone">Mobile Number</label>
          <input
            id="account-phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            required
          />

          <button type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>

          {profileStatus && (
            <p className={`account-message${profileStatus.ok ? '' : ' error'}`}>
              {profileStatus.text}
            </p>
          )}
        </form>

        <form className="account-card" onSubmit={changePassword}>
          <h2>Change Password</h2>

          <label htmlFor="account-current">Current Password</label>
          <input
            id="account-current"
            type="password"
            autoComplete="current-password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            required
          />

          <label htmlFor="account-new">New Password</label>
          <input
            id="account-new"
            type="password"
            autoComplete="new-password"
            value={passwords.next}
            onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            required
            minLength={8}
          />

          <label htmlFor="account-confirm">Confirm New Password</label>
          <input
            id="account-confirm"
            type="password"
            autoComplete="new-password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            required
          />

          <button type="submit" disabled={savingPassword}>
            {savingPassword ? 'Saving...' : 'Change Password'}
          </button>

          {passwordStatus && (
            <p className={`account-message${passwordStatus.ok ? '' : ' error'}`}>
              {passwordStatus.text}
            </p>
          )}
        </form>
      </div>
    </main>
  )
}

export default MyAccount
