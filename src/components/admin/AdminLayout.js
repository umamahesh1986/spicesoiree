import React from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth'
import './Admin.css'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/menu', label: 'Menu Items' },
  { to: '/admin/preorder', label: 'Pre-Order Curries' },
  { to: '/admin/meat', label: 'Fresh Meat & Eggs' },
  { to: '/admin/customers', label: 'Customers' },
]

// Shell for every admin screen (route is guarded by <RequireAuth role="admin">).
function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <strong>SPICE SOIRÉE</strong>
          <span>Admin Portal</span>
        </div>
        <div className="admin-topbar-actions">
          <span>Signed in as {user.name}</span>
          <Link to="/">View Website</Link>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className="admin-sidenav" aria-label="Admin sections">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
