import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersApi } from '../../api'
import {
  OrderItems,
  OrderSummaryLine,
  OrderTimeline,
  StatusBadge,
} from './OrderParts'
import Spinner from '../common/Spinner'
import '../admin/Admin.css'

const REFRESH_MS = 60000

// Customer screen: own orders with live status, cancel and report-a-problem.
function OrderCard({ order, onChange }) {
  const [action, setAction] = useState(null) // 'cancel' | 'dispute' | null
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const updated =
        action === 'cancel'
          ? await ordersApi.cancel(order.id, reason)
          : await ordersApi.dispute(order.id, reason)
      setAction(null)
      setReason('')
      onChange(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="order-card">
      <header className="order-card-header">
        <div>
          <strong>{order.orderNumber}</strong> <OrderSummaryLine order={order} />
        </div>
        <StatusBadge status={order.status} label={order.statusLabel} />
      </header>

      <OrderItems order={order} />

      {order.deliveryAddress && <p className="order-meta">Deliver to: {order.deliveryAddress}</p>}
      {order.notes && <p className="order-meta">Your notes: {order.notes}</p>}
      {order.cancelReason && (
        <p className="order-meta">
          Cancelled by {order.cancelledBy === 'customer' ? 'you' : 'the restaurant'}: {order.cancelReason}
        </p>
      )}
      {order.disputeReason && <p className="order-meta">Problem reported: {order.disputeReason}</p>}
      {order.resolutionNote && <p className="order-meta">Resolution: {order.resolutionNote}</p>}

      <details>
        <summary>Order progress</summary>
        <OrderTimeline order={order} />
      </details>

      {!action && (order.canCancel || order.canDispute) && (
        <div className="order-actions">
          {order.canCancel && (
            <button type="button" className="order-btn danger" onClick={() => setAction('cancel')}>
              Cancel order
            </button>
          )}
          {order.canDispute && (
            <button type="button" className="order-btn" onClick={() => setAction('dispute')}>
              Report a problem
            </button>
          )}
        </div>
      )}

      {action && (
        <form className="order-note-form" onSubmit={submit}>
          <label htmlFor={`reason-${order.id}`}>
            {action === 'cancel' ? 'Why are you cancelling?' : 'What went wrong?'}
          </label>
          <textarea
            id={`reason-${order.id}`}
            rows={2}
            maxLength={1000}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          {error && <p className="admin-dashboard-error">{error}</p>}
          <div className="order-actions">
            <button type="submit" className="order-btn danger" disabled={busy}>
              {action === 'cancel' ? 'Confirm cancellation' : 'Submit problem'}
            </button>
            <button type="button" className="order-btn" onClick={() => setAction(null)} disabled={busy}>
              Back
            </button>
          </div>
        </form>
      )}
    </article>
  )
}

function MyOrders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    return ordersApi.mine().then(
      (data) => {
        setOrders(data)
        setError('')
      },
      (err) => setError(err.message)
    )
  }, [])

  useEffect(() => {
    load()
    // Keep statuses fresh while the page is open
    const timer = setInterval(load, REFRESH_MS)
    return () => clearInterval(timer)
  }, [load])

  const replace = (updated) =>
    setOrders((current) => current.map((o) => (o.id === updated.id ? updated : o)))

  const active = (orders || []).filter((o) => o.stage === 'open')
  const past = (orders || []).filter((o) => o.stage !== 'open')

  return (
    <main className="account-page">
      <h1>My Orders</h1>
      <div className="account-links">
        <Link to="/account">My Account</Link>
        <Link to="/menu">Order more food</Link>
      </div>

      {error && <p className="admin-dashboard-error">{error}</p>}
      {orders === null && !error && <Spinner label="Loading your orders..." />}
      {orders && orders.length === 0 && (
        <p>
          You haven't placed any orders yet. <Link to="/menu">Browse the menu</Link>
        </p>
      )}

      {active.length > 0 && (
        <section>
          <h2>Current orders</h2>
          {active.map((order) => (
            <OrderCard key={order.id} order={order} onChange={replace} />
          ))}
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2>Past orders</h2>
          {past.map((order) => (
            <OrderCard key={order.id} order={order} onChange={replace} />
          ))}
        </section>
      )}
    </main>
  )
}

export default MyOrders
