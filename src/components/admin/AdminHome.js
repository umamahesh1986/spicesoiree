import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api'
import Spinner from '../common/Spinner'

function AdminHome() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    adminApi.summary().then(setSummary, (err) => setError(err.message))
  }, [])

  const stats = summary
    ? [
        { label: 'New Orders (awaiting action)', value: summary.newOrders, to: '/admin/orders' },
        { label: 'Open Orders', value: summary.openOrders, to: '/admin/orders' },
        { label: 'Orders Scheduled Today', value: summary.todayOrders, to: '/admin/orders' },
        { label: 'Disputed Orders', value: summary.disputedOrders, to: '/admin/orders' },
        { label: 'Menu Items', value: summary.menuItems, to: '/admin/menu' },
        { label: 'Pre-Order Curries', value: summary.preorderItems, to: '/admin/preorder' },
        { label: 'Fresh Meat Products', value: summary.meatProducts, to: '/admin/meat' },
        { label: 'Customers', value: summary.customers, to: '/admin/customers' },
        { label: 'Blocked Customers', value: summary.blockedCustomers, to: '/admin/customers' },
      ]
    : []

  return (
    <>
      <h1>Dashboard</h1>
      <p className="admin-hint">Item counts show items currently visible on the website.</p>

      {error && <p className="admin-dashboard-error">{error}</p>}
      {!summary && !error && <Spinner label="Loading dashboard..." />}

      <section className="admin-stats">
        {stats.map((stat) => (
          <Link className="admin-stat" key={stat.label} to={stat.to}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </Link>
        ))}
      </section>
    </>
  )
}

export default AdminHome
