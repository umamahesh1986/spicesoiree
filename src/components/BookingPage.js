import { useState } from 'react'
import { mealCategories } from './FineDiningPage'

import Location from './Location'
import './BookingPage.css'

const deliverySlots = [
  '12:00 – 1:00 PM',
  '1:00 – 2:00 PM',
  '2:00 – 3:00 PM',
  '3:00 – 4:00 PM',
  '4:00 – 5:00 PM',
  '5:00 – 6:00 PM',
  '6:00 – 7:00 PM',
  '7:00 – 8:00 PM',
  '8:00 – 9:00 PM',
  '9:00 – 10:00 PM',
]

function getDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function BookingPage({ compact = false }) {
  const [dates] = useState(() => {
    const today = new Date()
    return Array.from({ length: 4 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return date
    })
  })
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [selectedDates, setSelectedDates] = useState([])
  const [selectedMeals, setSelectedMeals] = useState([])
  const [selectedRestaurantMeals, setSelectedRestaurantMeals] = useState([])
  const [restaurantMealSizes, setRestaurantMealSizes] = useState({})
  const [isMealPickerOpen, setIsMealPickerOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [bookingError, setBookingError] = useState('')

  const toggleDate = (date) => {
    const key = getDateKey(date)
    setBookingError('')
    setSelectedDates((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    )
  }

  const toggleMeal = (meal) => {
    setSelectedMeals((current) =>
      current.includes(meal)
        ? current.filter((item) => item !== meal)
        : [...current, meal],
    )
    setBookingError('')
  }

  const toggleRestaurantMeal = (meal, size, price) => {
    setSelectedRestaurantMeals((current) => {
      const existing = current.some((item) => item.key === meal.key)
      return existing
        ? current.filter((item) => item.key !== meal.key)
        : [...current, { ...meal, size, price }]
    })
    setBookingError('')
  }

  const updateRestaurantMealSize = (key, size, price) => {
    setRestaurantMealSizes((current) => ({ ...current, [key]: size }))
    setSelectedRestaurantMeals((current) =>
      current.map((meal) => meal.key === key ? { ...meal, size, price } : meal),
    )
  }

  const confirmPlan = () => {
    const missingDetails = []
    if (!customerName.trim()) missingDetails.push('name')
    const phoneDigits = phone.replace(/\D/g, '')
    if (!phone.trim()) {
      missingDetails.push('phone number')
    } else if (phoneDigits.length < 10) {
      missingDetails.push('a valid phone number (at least 10 digits)')
    }
    if (!deliveryLocation.trim()) missingDetails.push('delivery location')
    if (selectedMeals.length + selectedRestaurantMeals.length === 0) missingDetails.push('meal plan')
    if (selectedDates.length === 0) missingDetails.push('at least one delivery date')
    if (!selectedSlot) missingDetails.push('delivery time')

    if (missingDetails.length > 0) {
      setBookingError(`Required: ${missingDetails.join(', ')}.`)
      return
    }

    const formattedDates = dates
      .filter((date) => selectedDates.includes(getDateKey(date)))
      .map((date) => new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date))
    const message = [
      'Hello Spice Soiree, I would like to confirm my meal plan:',
      '',
      `Name: ${customerName.trim()}`,
      `Phone: ${phone.trim()}`,
      `Delivery location: ${deliveryLocation.trim()}`,
      `Meal plan: ${[
        ...selectedMeals,
        ...selectedRestaurantMeals.map(({ title, name, size, price }) => `${title}: ${name} (${size} - ₹${price})`),
      ].join(', ')}`,
      `Delivery date(s): ${formattedDates.join(', ')}`,
      `Preferred booking time: ${selectedSlot}`,
    ].join('\n')
    setBookingError('')
    window.open(
      `https://wa.me/919849489900?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <section className={`booking-section${compact ? ' compact-section' : ''}`} id="scheduler">
      <div className="booking-layout">
        <div className="booking-story">
          <div className="booking-story-content">
            <span className="eyebrow"><span aria-hidden="true">✦</span> Multi-Day Subscriptions</span>
            <h2>Your week,<br /><em>beautifully planned.</em></h2>
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
                <strong>Daily Artisanal Coconut &amp; Ginger Chutneys</strong>
                <span>Stone-ground every dawn at 5:00 AM</span>
              </div>
            </div>
          </div>
          <p className="booking-promise"><span aria-hidden="true">✓</span> 100% Zero Preservatives · Cold-Fermented Batches</p>
        </div>

        <div className="booking-form">
          <div className="booking-steps">
            <div className="booking-step">
              <h3 className="booking-step-label">
                <span>1</span> Your Details &amp; Delivery Location
                <svg aria-hidden="true" className="booking-location-icon" viewBox="0 0 24 24">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                </svg>
              </h3>
              <div className="customer-fields">
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
                    <svg aria-hidden="true" className="booking-location-icon" viewBox="0 0 24 24">
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
              </div>
            </div>

            <div className="booking-step">
              <p className="booking-step-label">
                <span>2</span> Choose Meal Plan or Handi Package
              </p>
              <div className="meal-picker">
                <button
                  aria-expanded={isMealPickerOpen}
                  aria-controls="meal-plan-options"
                  className="meal-picker-trigger"
                  onClick={() => setIsMealPickerOpen((open) => !open)}
                  type="button"
                >
                  <span>
                    {selectedMeals.length + selectedRestaurantMeals.length > 0
                      ? `${selectedMeals.length + selectedRestaurantMeals.length} item${selectedMeals.length + selectedRestaurantMeals.length === 1 ? '' : 's'} selected`
                      : 'Select a meal plan'}
                  </span>
                  <span aria-hidden="true" className="meal-picker-chevron">{isMealPickerOpen ? '▴' : '▾'}</span>
                </button>
                {isMealPickerOpen ? (
                  <div className="meal-picker-options" id="meal-plan-options">
                    <h4 className="meal-picker-title">Spice Soirée Menus</h4>
                    <h5 className="meal-picker-group-title">Karthika Masam Veg Specials</h5>
                    {mealCategories.map(({ category, image, items }) => (
                      <fieldset className="meal-category" key={category}>
                        <legend>{category}</legend>
                        <img alt={`${category} menu`} className="meal-category-image" loading="lazy" src={image} />
                        <div className="meal-category-items">
                          {items.map((item) => (
                            <label className="meal-option" key={item}>
                              <input
                                checked={selectedMeals.includes(item)}
                                onChange={() => toggleMeal(item)}
                                type="checkbox"
                                value={item}
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                    <h5 className="meal-picker-group-title">Restaurant Menu · Items &amp; Prices</h5>
                    {restaurantMenuCategories.map(({ title, priceLabel, sizes, items }) => (
                      <fieldset className="meal-category meal-category-restaurant-menu" key={title}>
                        <legend>{title} <span>({priceLabel})</span></legend>
                        <div className="meal-category-items">
                          {items.map(({ name, prices, sizes: itemSizes = sizes }) => {
                            const key = `${title}:${name}`
                            const selectedMeal = selectedRestaurantMeals.find((meal) => meal.key === key)
                            const selectedSize = selectedMeal?.size || restaurantMealSizes[key] || itemSizes[0]
                            const selectedPrice = prices[itemSizes.indexOf(selectedSize)]
                            const meal = { key, title, name }
                            return (
                              <div className="restaurant-meal-option" key={name}>
                                <label className="meal-option">
                                  <input
                                    checked={Boolean(selectedMeal)}
                                    onChange={() => toggleRestaurantMeal(meal, selectedSize, selectedPrice)}
                                    type="checkbox"
                                    value={key}
                                  />
                                  <span>{name}</span>
                                </label>
                                <select
                                  aria-label={`Size and price for ${name}`}
                                  onChange={(event) => {
                                    const sizeIndex = itemSizes.indexOf(event.target.value)
                                    updateRestaurantMealSize(key, event.target.value, prices[sizeIndex])
                                  }}
                                  value={selectedSize}
                                >
                                  {itemSizes.map((size, index) => (
                                    <option key={size} value={size}>{size} — ₹{prices[index]}</option>
                                  ))}
                                </select>
                              </div>
                            )
                          })}
                        </div>
                      </fieldset>
                    ))}
                    <button
                      className="meal-picker-done"
                      onClick={() => setIsMealPickerOpen(false)}
                      type="button"
                    >
                      Done
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="booking-step">
              <div className="booking-step-heading">
                <h3><span>3</span> Select Delivery Date(s)</h3>
                <small>Multi-Select Enabled</small>
              </div>
              <div aria-label="Select delivery dates" className="date-options">
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
                      <span>{new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(date)}</span>
                      <strong>{new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'short' }).format(date)}</strong>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="booking-step">
              <div className="dispatch-heading">
                <h3 className="booking-step-label"><span>4</span> Select Preferred Booking Slot</h3>
              </div>
              <div aria-label="Choose a booking slot from 12 PM to 10 PM" className="slot-options">
                {deliverySlots.map((slot) => (
                  <button
                    aria-pressed={selectedSlot === slot}
                    className={`slot-option${selectedSlot === slot ? ' selected' : ''}`}
                    key={slot}
                    onClick={() => {
                      setSelectedSlot((current) => current === slot ? '' : slot)
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

          <div className="booking-submit">
            {bookingError ? (
              <p aria-live="assertive" className="booking-error" role="alert">{bookingError}</p>
            ) : null}
            <button className="button button-primary submit-booking" onClick={confirmPlan} type="button">
              Confirm Details &amp; Send to WhatsApp <span aria-hidden="true">→</span>
            </button>
            <p>* Reschedule or cancel complimentary up to 6:00 PM prior evening. Zero delivery surcharge.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingPage
