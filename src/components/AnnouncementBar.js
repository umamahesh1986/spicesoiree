import Location from './Location'
import './AnnouncementBar.css'

function AnnouncementBar() {
  return (
    <div className="announcement">
      <div className="announcement-contact">
        <Location />
        <span aria-hidden="true" className="announcement-divider" />
        <a className="announcement-phone" href="tel:+919642498490">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.56 3.58.56.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.19 2.46.56 3.58a1 1 0 0 1-.25 1.01l-2.19 2.2Z" /></svg>
          96424 98490
        </a>
        <span aria-hidden="true">/</span>
        <a className="announcement-phone" href="tel:+919849489900">98494 89900</a>
      </div>
      <span className="announcement-offer">
        <span aria-hidden="true">✦</span> Complimentary Royal Tasting &amp; Doorstep Delivery until 30 Dec 2026
      </span>
    </div>
  )
}

export default AnnouncementBar
