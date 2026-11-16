import React, { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../../api'
import Spinner from '../common/Spinner'

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function AdminCustomers() {
  const [customers, setCustomers] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    return adminApi.customers().then(
      (data) => {
        setCustomers(data)
        setError('')
      },
      (err) => setError(err.message)
    )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleCustomer = async (customer) => {
    setBusyId(customer.id)
    try {
      await adminApi.setCustomerActive(customer.id, !customer.isActive)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <h1>Customers</h1>
      <p className="admin-hint">Blocking a customer signs them out and stops them from logging in.</p>

      {error && <p className="admin-dashboard-error">{error}</p>}

      <section className="admin-panel">
        {customers === null ? (
          <Spinner label="Loading customers..." />
        ) : customers.length === 0 ? (
          <p>No customers have registered yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Registered</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>{formatDate(customer.lastLoginAt)}</td>
                    <td>
                      <span className={`admin-badge ${customer.isActive ? 'ok' : 'off'}`}>
                        {customer.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={busyId === customer.id}
                        onClick={() => toggleCustomer(customer)}
                      >
                        {customer.isActive ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminCustomers
