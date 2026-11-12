
import './AnnouncementBar.css'

function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-inner">

        <div className="announcement-location">
          <span className="location-pin"></span>
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
