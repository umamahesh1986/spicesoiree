import './AnnouncementBar.css'

function AnnouncementBar() {
  const openLocation = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=Matrusi+Nagar+Hyderabad',
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="announcement-bar">
      <div className="announcement-inner">

        <div className="announcement-location">
          <span
            className="location-pin"
            onClick={openLocation}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openLocation()
              }
            }}
            aria-label="Open location in Google Maps"
          ></span>

          <span>Matrusi Nagar, Hyderabad</span>
        </div>

        <div className="announcement-hours">
          <span className="clock-icon">◷</span>
          <span>Open Today: 12:00 PM – 10:30 PM</span>
        </div>

      </div>
    </div>
  )
}

export default AnnouncementBar
