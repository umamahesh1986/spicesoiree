import React, { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../../api'
import Spinner from '../common/Spinner'
import {
  OrderItems,
  OrderSummaryLine,
  OrderTimeline,
  StatusBadge,
  formatDateTime,
  formatMoney,
} from '../orders/OrderParts'

const VIEWS = [
  { key: 'open', label: 'Open' },
  { key: 'completed', label: 'Delivered / Picked up' },
  { key: 'closed', label: 'Cancelled & Resolved' },
  { key: 'all', label: 'All' },
]

const REFRESH_MS = 30000

// Buttons for the next allowed statuses (from the server). Statuses that need a
// reason (cancel, delivery failed, dispute, resolve) open a note field first.
function OrderActions({ order, onUpdated }) {
  const [pending, setPending] = useState(null) // { status, label, noteRequired }
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const apply = async (next, noteText = '') => {
    setBusy(true)
    setError('')
    try {
      onUpdated(await adminApi.setOrderStatus(order.id, next.status, noteText))
      setPending(null)
      setNote('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const choose = (next) => {
    setError('')
    if (next.noteRequired) setPending(next)
    else apply(next)
  }

  const setPayment = async (paymentStatus) => {
    setBusy(true)
    setError('')
    try {
      onUpdated(await adminApi.setOrderPayment(order.id, paymentStatus))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="order-admin-actions">
      {!pending && order.allowedNext.length > 0 && (
        <div className="order-actions">
          {order.allowedNext.map((next) => (
            <button
              key={next.status}
              type="button"
              disabled={busy}
              className={`order-btn ${['cancelled', 'delivery_failed'].includes(next.status) ? 'danger' : 'primary'}`}
              onClick={() => choose(next)}
            >
              {next.status === 'cancelled' ? 'Cancel order' : `Mark: ${next.label}`}
            </button>
          ))}
        </div>
      )}

      {pending && (
        <form
          className="order-note-form"
          onSubmit={(e) => {
            e.preventDefault()
            apply(pending, note)
          }}
        >
          <label htmlFor={`note-${order.id}`}>
            {pending.label}: reason / note (required)
          </label>
          <textarea
            id={`note-${order.id}`}
            rows={2}
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
          <div className="order-actions">
            <button type="submit" className="order-btn primary" disabled={busy}>
              Confirm: {pending.label}
            </button>
            <button type="button" className="order-btn" disabled={busy} onClick={() => setPending(null)}>
              Back
            </button>
          </div>
        </form>
      )}

      <label className="order-payment">
        Payment
        <select
          value={order.paymentStatus}
          disabled={busy}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>
      </label>

      {error && <p className="admin-dashboard-error">{error}</p>}
    </div>
  )
}

function AdminOrderCard({ order, onUpdated }) {
  return (
    <article className={`order-card${order.status === 'placed' ? ' order-card-new' : ''}${order.status === 'disputed' ? ' order-card-alert' : ''}`}>
      <header className="order-card-header">
        <div>
          <strong>{order.orderNumber}</strong>
          {order.status === 'placed' && <span className="order-new-flag">NEW</span>}{' '}
          <OrderSummaryLine order={order} />
        </div>
        <StatusBadge status={order.status} label={order.statusLabel} />
      </header>

      <div className="order-admin-grid">
        <div>
          <p className="order-meta">
            <strong>{order.customerName}</strong> ·{' '}
            <a href={`tel:+91${order.customerPhone}`}>{order.customerPhone}</a>
          </p>
          {order.deliveryAddress && <p className="order-meta">📍 {order.deliveryAddress}</p>}
          {order.notes && <p className="order-meta">📝 {order.notes}</p>}
          {order.cancelReason && (
            <p className="order-meta">
              Cancelled by {order.cancelledBy}: {order.cancelReason}
            </p>
          )}
          {order.disputeReason && <p className="order-meta order-alert-text">Dispute: {order.disputeReason}</p>}
          {order.resolutionNote && <p className="order-meta">Resolution: {order.resolutionNote}</p>}
          <p className="order-meta">
            Placed {formatDateTime(order.createdAt)} · {formatMoney(order.total)} · Payment: {order.paymentStatus}
          </p>
        </div>
        <OrderActions order={order} onUpdated={onUpdated} />
      </div>

      <details>
        <summary>Items ({order.items.length}) & history</summary>
        <OrderItems order={order} />
        <OrderTimeline order={order} />
      </details>
    </article>
  )
}

function AdminOrders() {
  const [view, setView] = useState('open')
  const [statusFilter, setStatusFilter] = useState('')
  const [date, setDate] = useState('')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('') // debounced search
  const [meta, setMeta] = useState(null)
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  const [lastLoaded, setLastLoaded] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    try {
      const [metaData, orderData] = await Promise.all([
        adminApi.orderMeta(),
        adminApi.orders({ view, status: statusFilter, date, q: query }),
      ])
      setMeta(metaData)
      setOrders(orderData)
      setError('')
      setLastLoaded(new Date())
    } catch (err) {
      setError(err.message)
    }
  }, [view, statusFilter, date, query])

  useEffect(() => {
    load()
    const timer = setInterval(load, REFRESH_MS) // pick up new orders automatically
    return () => clearInterval(timer)
  }, [load])

  // Show the change immediately, then re-sync so the order moves to the right
  // tab (e.g. a picked-up order leaves "Open") and the counts update.
  const onUpdated = (updated) => {
    setOrders((current) => current.map((o) => (o.id === updated.id ? updated : o)))
    load()
  }

  const counts = meta?.counts || {}

  return (
    <>
      <div className="admin-page-header">
        <h1>Orders</h1>
        <button type="button" onClick={load}>
          Refresh
        </button>
      </div>
      <p className="admin-hint">
        Refreshes every 30 seconds{lastLoaded ? ` · last updated ${formatDateTime(lastLoaded)}` : ''}.
        {meta ? ` ${meta.todayCount} order(s) scheduled for today.` : ''}
      </p>

      {meta && (
        <div className="order-status-chips">
          {meta.statuses
            .filter((s) => s.stage === 'open' && counts[s.key])
            .map((s) => (
              <button
                key={s.key}
                type="button"
                className={`order-chip${statusFilter === s.key ? ' active' : ''}`}
                onClick={() => {
                  setView('open')
                  setStatusFilter(statusFilter === s.key ? '' : s.key)
                }}
              >
                {s.label}: {counts[s.key]}
              </button>
            ))}
        </div>
      )}

      <div className="order-tabs" role="tablist">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            role="tab"
            aria-selected={view === v.key}
            className={view === v.key ? 'active' : ''}
            onClick={() => {
              setView(v.key)
              setStatusFilter('')
            }}
          >
            {v.label}
            {v.key === 'open' && meta ? ` (${meta.openCount})` : ''}
          </button>
        ))}
      </div>

      <div className="admin-filters">
        <input
          type="search"
          placeholder="Order no., name or phone"
          aria-label="Search orders"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          aria-label="Scheduled date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {meta && (
          <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {meta.statuses.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        )}
        {(date || statusFilter || search) && (
          <button
            type="button"
            onClick={() => {
              setDate('')
              setStatusFilter('')
              setSearch('')
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {error && <p className="admin-dashboard-error">{error}</p>}
      {orders === null && !error && <Spinner label="Loading orders..." />}
      {orders && orders.length === 0 && <p>No orders found.</p>}
      {orders && orders.map((order) => (
        <AdminOrderCard key={order.id} order={order} onUpdated={onUpdated} />
      ))}
    </>
  )
}

export default AdminOrders
