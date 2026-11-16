import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Location from './Location'
import {
  clearCart,
  ordersApi,
  readCart,
  repairCart,
  saveCart,
  useApi,
  useSettings,
  whatsappUrl,
} from '../api'
import { useAuth } from '../auth'
import Spinner from './common/Spinner'
import './BookingPage.css'

// YYYY-MM-DD in the browser's local time (what the server expects)
function getDateKey(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatLongDate(isoDate) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${isoDate}T00:00:00`))
}

function BookingPage({ compact = false }) {
  const location = useLocation()
  const settings = useSettings()
  const { user } = useAuth() // route is customer-only, so user is set

  // Booking slots come from GET /api/delivery-slots
  const { data: slotData, loading: slotsLoading } = useApi('/delivery-slots')
  const deliverySlots = slotData || []

  const [cartItems, setCartItems] = useState(() => {
    const saved = readCart()
    if (saved.length) return saved
    return Array.isArray(location.state?.cartItems) ? location.state.cartItems : []
  })

  // Carts saved before orders were stored in the database have no catalog id:
  // match them to the menu automatically and save the repaired cart.
  useEffect(() => {
    let active = true
    repairCart(cartItems).then(
      (repaired) => {
        if (!active || repaired === cartItems) return
        setCartItems(repaired)
        saveCart(repaired)
      },
      () => {} // catalog unavailable: the server will report the problem on submit
    )
    return () => {
      active = false
    }
    // runs once, for the cart loaded when checkout opens
  }, [])

  // Anything still without a catalog id no longer exists on the menu
  const outdatedItems = cartItems.filter((item) => !item.itemType || !item.itemId)

  const [dates] = useState(() => {
    const today = new Date()

    return Array.from({ length: 4 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return date
    })
  })

  const [fulfilmentType, setFulfilmentType] = useState('delivery')
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedDates, setSelectedDates] = useState([])
  const [isMealPickerOpen, setIsMealPickerOpen] = useState(
    cartItems.length > 0
  )
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [placedOrders, setPlacedOrders] = useState(null)

  const isDelivery = fulfilmentType === 'delivery'

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  )

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * Number(item.quantity || 1),
    0
  )

  const toggleDate = (date) => {
    const key = getDateKey(date)

    setBookingError('')

    setSelectedDates((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    )
  }

  const confirmPlan = async () => {
    const missingDetails = []

    if (!customerName.trim()) {
      missingDetails.push('name')
    }

    const phoneDigits = phone.replace(/\D/g, '')

    if (!phone.trim()) {
      missingDetails.push('phone number')
    } else if (phoneDigits.length < 10) {
      missingDetails.push('a valid phone number (at least 10 digits)')
    }

    if (isDelivery && !deliveryLocation.trim()) {
      missingDetails.push('delivery location')
    }

    if (cartItems.length === 0) {
      missingDetails.push('cart items')
    }

    if (selectedDates.length === 0) {
      missingDetails.push(isDelivery ? 'at least one delivery date' : 'at least one pickup date')
    }

    if (!selectedSlot) {
      missingDetails.push(isDelivery ? 'delivery time' : 'pickup time')
    }

    if (missingDetails.length > 0) {
      setBookingError(`Required: ${missingDetails.join(', ')}.`)
      return
    }

    if (outdatedItems.length > 0) {
      setBookingError(
        `These items are no longer on the menu. Please remove them from your cart: ${outdatedItems
          .map((item) => `${item.name}${item.size ? ` (${item.size})` : ''}`)
          .join(', ')}.`
      )
      return
    }

    setBookingError('')
    setSubmitting(true)

    try {
      // Prices are recalculated by the server from the database
      const { orders } = await ordersApi.place({
        fulfilmentType,
        customerName: customerName.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: isDelivery ? deliveryLocation.trim() : '',
        dates: [...selectedDates].sort(),
        timeSlot: selectedSlot,
        notes: notes.trim(),
        items: cartItems.map((item) => ({
          itemType: item.itemType,
          itemId: item.itemId,
          size: item.size,
          cuttingOption: item.cuttingOption || '',
          quantity: Number(item.quantity || 1),
        })),
      })

      clearCart()
      setPlacedOrders(orders)
      window.scrollTo(0, 0)
    } catch (err) {
      setBookingError(
        err.status ? err.message : 'Unable to reach the server. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Optional: also notify the restaurant on WhatsApp with the saved order numbers
  const whatsappMessage = placedOrders
    ? [
        'Hello Spice Soiree, I have placed an order on the website:',
        '',
        ...placedOrders.map(
          (order) =>
            `Order ${order.orderNumber} - ${formatLongDate(order.scheduledDate)}, ${order.timeSlot} - ₹${order.total}`
        ),
        '',
        `Name: ${placedOrders[0].customerName}`,
        `Phone: ${placedOrders[0].customerPhone}`,
        placedOrders[0].fulfilmentType === 'delivery'
          ? `Delivery location: ${placedOrders[0].deliveryAddress}`
          : 'I will pick up from the restaurant.',
      ].join('\n')
    : ''

  return (
    <section
      className={`booking-section${compact ? ' compact-section' : ''}`}
      id="scheduler"
    >
      <div className="booking-layout">

        <div className="booking-story">
          <div className="booking-story-content">

            <span className="eyebrow">
              <span aria-hidden="true">✦</span> Multi-Day Subscriptions
            </span>

            <h2>
              Your week,
              <br />
              <em>beautifully planned.</em>
            </h2>

            <p>
              Avoid weekday morning kitchen chaos. Schedule stone-ground tiffins,
              executive luncheon thalis, or festive handi curries directly to your tower residence.
            </p>

            <div className="booking-story-image">
              <img
                alt="South Indian filter coffee with fresh morning idlis"
                loading="lazy"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD1KLOl-cuxBeQ9d3VGWxuD35IHeTbevC1kXMiw92Kmlmn7t09bReQQaAw6fuYJ5C_o407SOi4z1TfFBBNFypkANUwUv7iprIcYCKJySE9l_XP3U1RRMK_Ikv6qKi3mSmLam9hSp1iCQz4OD1jFYRhb7vmbqBp8C5Kct_490b44LUIHByd2jr347akBUyA5U64ETCehICsaz36nLrstSZz8uo4rgkaqVN3sRxtp4B6"
              />

              <div className="booking-story-image-caption">
                <strong>
                  Daily Artisanal Coconut &amp; Ginger Chutneys
                </strong>
                <span>Stone-ground every dawn at 5:00 AM</span>
              </div>
            </div>
          </div>

          <p className="booking-promise">
            <span aria-hidden="true">✓</span> 100% Zero Preservatives · Cold-Fermented Batches
          </p>
        </div>

        <div className="booking-form">
          {placedOrders ? (
            <div className="booking-steps" role="status">
              <div className="booking-step">
                <h3 className="booking-step-label">
                  <span>✓</span> Order placed successfully
                </h3>
                <p>
                  The restaurant has received your order. You can follow its status
                  under My Orders.
                </p>
                <ul>
                  {placedOrders.map((order) => (
                    <li key={order.id}>
                      <strong>{order.orderNumber}</strong> – {formatLongDate(order.scheduledDate)},{' '}
                      {order.timeSlot} – ₹{order.total} ({order.statusLabel})
                    </li>
                  ))}
                </ul>
              </div>
              <div className="booking-submit">
                <Link className="button button-primary submit-booking" to="/orders">
                  View My Orders <span aria-hidden="true">→</span>
                </Link>
                <p>
                  <a href={whatsappUrl(settings, whatsappMessage)} rel="noreferrer" target="_blank">
                    Also send the order details on WhatsApp
                  </a>
                </p>
              </div>
            </div>
          ) : (
          <>
          <div className="booking-steps">

            {/* STEP 1 */}
            <div className="booking-step">

              <h3 className="booking-step-label">
                <span>1</span> Your Details &amp; {isDelivery ? 'Delivery Location' : 'Pickup'}

                <svg
                  aria-hidden="true"
                  className="booking-location-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 0 0 5Z" />
                </svg>
              </h3>

              <div className="customer-fields">

                <div
                  aria-label="Delivery or pickup"
                  className="slot-options"
                  role="group"
                >
                  {[
                    ['delivery', 'Home Delivery'],
                    ['pickup', 'Pickup from Restaurant'],
                  ].map(([value, label]) => (
                    <button
                      aria-pressed={fulfilmentType === value}
                      className={`slot-option${fulfilmentType === value ? ' selected' : ''}`}
                      key={value}
                      onClick={() => {
                        setFulfilmentType(value)
                        setBookingError('')
                      }}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <label>
                  Name
                  <input
                    autoComplete="name"
                    onChange={(event) => {
                      setCustomerName(event.target.value)
                      setBookingError('')
                    }}
                    placeholder="Your name"
                    required
                    value={customerName}
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    autoComplete="tel"
                    onChange={(event) => {
                      setPhone(event.target.value)
                      setBookingError('')
                    }}
                    placeholder="+91 phone number"
                    required
                    type="tel"
                    value={phone}
                  />
                </label>

                {isDelivery && (
                <label>
                  <span className="delivery-location-label">
                    Delivery Location

                    <Location
                      booking
                      onConfirm={(address) => {
                        setDeliveryLocation(address)
                        setBookingError('')
                      }}
                    />

                    <svg
                      aria-hidden="true"
                      className="booking-location-icon"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                  </span>

                  <input
                    autoComplete="street-address"
                    onChange={(event) => {
                      setDeliveryLocation(event.target.value)
                      setBookingError('')
                    }}
                    placeholder="Flat, building, street, area"
                    required
                    value={deliveryLocation}
                  />
                </label>
                )}

                <label>
                  Notes for the restaurant (optional)
                  <input
                    maxLength={500}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="e.g. less spicy, call on arrival"
                    value={notes}
                  />
                </label>

              </div>
            </div>

            {/* STEP 2 - CART ITEMS */}
            <div className="booking-step">

              <p className="booking-step-label">
                <span>2</span> Your Cart Items
              </p>

              <div className="meal-picker">

                <button
                  aria-expanded={isMealPickerOpen}
                  aria-controls="meal-plan-options"
                  className="meal-picker-trigger"
                  onClick={() =>
                    setIsMealPickerOpen((open) => !open)
                  }
                  type="button"
                >
                  <span>
                    {cartItems.length > 0
                      ? `${cartCount} cart item${cartCount === 1 ? '' : 's'}`
                      : 'No cart items'}
                  </span>

                  <span
                    aria-hidden="true"
                    className="meal-picker-chevron"
                  >
                    {isMealPickerOpen ? '▴' : '▾'}
                  </span>
                </button>

                {isMealPickerOpen && (
                  <div
                    className="meal-picker-options"
                    id="meal-plan-options"
                  >

                    {cartItems.length > 0 ? (
                      <div className="checkout-cart-items">

                        {cartItems.map((item, index) => {
                          const quantity = Number(item.quantity || 1)
                          const itemTotal = Number(item.price || 0) * quantity

                          return (
                            <div
                              className="checkout-cart-dropdown-item"
                              key={`${item.name}-${index}`}
                            >

                              <div className="checkout-cart-item-info">
                                <strong>{item.name}</strong>

                                {item.cuttingOption && (
                                  <span>{item.cuttingOption}</span>
                                )}

                                <span>
                                  Quantity: {quantity}
                                </span>
                              </div>

                              <strong className="checkout-cart-item-total">
                                ₹{itemTotal}
                              </strong>

                            </div>
                          )
                        })}

                        <div className="checkout-cart-total">
                          <span>Total Items: {cartCount}</span>
                          <strong>₹{cartTotal}</strong>
                        </div>

                      </div>
                    ) : (
                      <p className="checkout-cart-empty">
                        Your cart is empty.
                      </p>
                    )}

                    <button
                      className="meal-picker-done"
                      onClick={() => setIsMealPickerOpen(false)}
                      type="button"
                    >
                      Done
                    </button>

                  </div>
                )}

              </div>
            </div>

            {/* STEP 3 */}
            <div className="booking-step">

              <div className="booking-step-heading">
                <h3>
                  <span>3</span> Select {isDelivery ? 'Delivery' : 'Pickup'} Date(s)
                </h3>
                <small>Multi-Select: one order per date</small>
              </div>

              <div
                aria-label="Select delivery dates"
                className="date-options"
              >
                {dates.map((date) => {
                  const key = getDateKey(date)
                  const selected = selectedDates.includes(key)

                  return (
                    <button
                      aria-pressed={selected}
                      className={`date-option${selected ? ' selected' : ''}`}
                      key={key}
                      onClick={() => toggleDate(date)}
                      type="button"
                    >
                      <span>
                        {new Intl.DateTimeFormat(undefined, {
                          weekday: 'long',
                        }).format(date)}
                      </span>

                      <strong>
                        {new Intl.DateTimeFormat(undefined, {
                          day: '2-digit',
                          month: 'short',
                        }).format(date)}
                      </strong>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* STEP 4 */}
            <div className="booking-step">

              <div className="dispatch-heading">
                <h3 className="booking-step-label">
                  <span>4</span> Select {isDelivery ? 'Delivery' : 'Pickup'} Time Slot
                </h3>
              </div>

              <div
                aria-label="Choose a booking slot from 12 PM to 10 PM"
                className="slot-options"
              >
                {slotsLoading && <Spinner label="Loading time slots..." size="small" inline />}
                {deliverySlots.map((slot) => (
                  <button
                    aria-pressed={selectedSlot === slot}
                    className={`slot-option${selectedSlot === slot ? ' selected' : ''}`}
                    key={slot}
                    onClick={() => {
                      setSelectedSlot((current) =>
                        current === slot ? '' : slot
                      )
                      setBookingError('')
                    }}
                    type="button"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* CONFIRM BOOKING */}
          <div className="booking-submit">

            {bookingError ? (
              <p
                aria-live="assertive"
                className="booking-error"
                role="alert"
              >
                {bookingError}
              </p>
            ) : null}

            {selectedDates.length > 1 && (
              <p className="booking-multi-note">
                {selectedDates.length} orders will be placed, one for each date
                (₹{cartTotal} each at current prices).
              </p>
            )}

            <button
              className="button button-primary submit-booking"
              disabled={submitting}
              onClick={confirmPlan}
              type="button"
            >
              {submitting ? 'Placing order...' : 'Place Order'}
              <span aria-hidden="true">→</span>
            </button>

            <p>
              * You can cancel online until the kitchen starts preparing your order. Zero delivery surcharge.
            </p>

          </div>
          </>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingPage
