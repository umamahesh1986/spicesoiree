import React from 'react'

// Shared pieces for the customer "My Orders" and admin "Orders" screens.
// Status labels / allowed actions come from the server; only colours live here.

const BADGE_TONE = {
  placed: 'new',
  confirmed: 'info',
  preparing: 'progress',
  ready: 'progress',
  out_for_delivery: 'transit',
  delivery_failed: 'alert',
  delivered: 'done',
  picked_up: 'done',
  disputed: 'alert',
  resolved: 'muted',
  cancelled: 'muted',
}

export function StatusBadge({ status, label }) {
  return <span className={`order-badge tone-${BADGE_TONE[status] || 'info'}`}>{label}</span>
}

export function formatDate(isoDate) {
  if (!isoDate) return ''
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${isoDate}T00:00:00`))
}

export function formatDateTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatMoney(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

export function OrderItems({ order }) {
  return (
    <table className="order-items">
      <tbody>
        {order.items.map((item, index) => (
          <tr key={index}>
            <td>
              {item.name}
              {item.size && <small> · {item.size}</small>}
              {item.cuttingOption && <small> · {item.cuttingOption}</small>}
            </td>
            <td>
              {item.quantity} × {formatMoney(item.unitPrice)}
              {item.unit && item.itemType === 'meat' ? ` / ${item.unit}` : ''}
            </td>
            <td>{formatMoney(item.lineTotal)}</td>
          </tr>
        ))}
        {Number(order.deliveryFee) > 0 && (
          <tr>
            <td colSpan={2}>Delivery fee</td>
            <td>{formatMoney(order.deliveryFee)}</td>
          </tr>
        )}
        <tr className="order-items-total">
          <td colSpan={2}>Total</td>
          <td>{formatMoney(order.total)}</td>
        </tr>
      </tbody>
    </table>
  )
}

export function OrderTimeline({ order }) {
  return (
    <ol className="order-timeline">
      {order.history.map((entry, index) => (
        <li key={index}>
          <span className="order-timeline-time">{formatDateTime(entry.at)}</span>
          <span>
            {/* same from/to status = a non-status event such as a payment update */}
            {entry.fromStatus && entry.fromStatus === entry.toStatus ? (
              <em>{entry.note}</em>
            ) : (
              <>
                <strong>{entry.label}</strong>
                {entry.note && <> – {entry.note}</>}
              </>
            )}
            <small> ({entry.by === 'customer' ? 'customer' : 'restaurant'})</small>
          </span>
        </li>
      ))}
    </ol>
  )
}

export function OrderSummaryLine({ order }) {
  return (
    <span className="order-summary-line">
      {formatDate(order.scheduledDate)} · {order.timeSlot} ·{' '}
      {order.fulfilmentType === 'pickup' ? 'Pickup' : 'Delivery'}
    </span>
  )
}
