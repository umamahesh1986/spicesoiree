import { useEffect, useState } from 'react'
import './Location.css'

const defaultMapCenter = [17.4940686, 78.3979752]

function googleMapsEmbedUrl(position, searchQuery) {
  const query = encodeURIComponent(searchQuery || `${position[0]},${position[1]}`)
  return `https://www.google.com/maps?q=${query}&z=17&output=embed`
}

function Location({ booking = false, onConfirm }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const position = defaultMapCenter
  const [mapSearchQuery, setMapSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const searchLocation = async (event) => {
    event.preventDefault()
    const query = searchInput.trim()
    if (!query) {
      setStatus('Enter a place or address to search.')
      return
    }

    setMapSearchQuery(query)
    setSelectedLocation(query)
    setStatus('Showing Google Maps search results.')
  }

  const confirmLocation = () => {
    if (!selectedLocation) {
      setStatus('Search for a place before confirming your delivery location.')
      return
    }

    onConfirm?.(selectedLocation)
    setSearchInput('')
    setIsOpen(false)
  }

  const openLocationPicker = () => {
    setIsOpen(true)
  }

  return (
    <div className={`location-control${booking ? ' booking-location-control' : ''}`}>
      {booking ? (
        <button
          aria-label="Choose delivery location on map"
          className="location-trigger"
          onClick={openLocationPicker}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
        </button>
      ) : null}
      <a
        aria-label="Open Spice Soirée address in Google Maps"
        className="location-trigger"
        href="https://www.google.com/maps/search/?api=1&query=Spice%20Soiree%2C%20Plot%20No.%201031%2C%20Road%20No.%202%2F5%2C%20Matrusree%20Nagar%2C%20Miyapur%20500049"
        rel="noreferrer"
        target="_blank"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
        </svg>
      </a>
      <span className="location-label">Matrusree Nagar, Miyapur, Hyderabad</span>
      {isOpen ? (
        <div
          className="location-picker-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false)
          }}
        >
          <section aria-labelledby="location-picker-title" aria-modal="true" className="location-picker-modal" role="dialog">
            <header className="location-picker-header">
              <div>
                <h2 id="location-picker-title">Select Your Location</h2>
                <p>Search for a delivery address in Hyderabad.</p>
              </div>
              <button aria-label="Close location picker" className="location-picker-close" onClick={() => setIsOpen(false)} type="button">×</button>
            </header>

            <form className="location-picker-search" onSubmit={searchLocation} role="search">
              <label className="visually-hidden" htmlFor="location-query">Search for a location</label>
              <input
                autoComplete="street-address"
                autoFocus
                id="location-query"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search for a location..."
                type="search"
                value={searchInput}
              />
              <button type="submit">Search</button>
            </form>

            <div className="location-map">
              <iframe
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={googleMapsEmbedUrl(position, mapSearchQuery)}
                title="Google Map showing your delivery location"
              />
            </div>

            <div className="location-picker-details">
              <div className="location-selection">
                <strong>Selected Location</strong>
                <p>{selectedLocation || 'Search for a place to set the delivery location.'}</p>
                {status ? <span aria-live="polite" className="location-picker-status" role="status">{status}</span> : null}
              </div>
              <div className="location-picker-actions">
                <button className="location-cancel-button" onClick={() => setIsOpen(false)} type="button">Cancel</button>
                <button className="location-confirm-button" disabled={!selectedLocation} onClick={confirmLocation} type="button">Confirm Location</button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default Location
