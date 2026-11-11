import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link aria-label="Spice Soirée home" className="brand" to="/">
            <img src="/images/spice-soiree-logo.jpg" alt="Spice Soirée Restaurant" />
          </Link>
          <p>
            A sanctuary of heritage dining, grand banquet salons, and royal
            Hyderabadi traditions crafted for the discerning palate.
          </p>
          <span className="footer-badge">✦ Heritage hospitality · Miyapur, Hyderabad</span>
        </div>
        <div>
          <h2>Contact</h2>
          <ul className="footer-contact-list">
            <li>
              <strong>🏢 Address</strong>
              <address>Plot No. 1031, Road No. 2/5, Matrusree Nagar, Miyapur 500049</address>
            </li>
            <li>
              <strong>✉ Email</strong>
              <a href="mailto:spicesoiree@gmail.com">spicesoiree@gmail.com</a>
            </li>
            <li>
              <strong>☎ Phone</strong>
              <span className="footer-phone-numbers">
                <a href="tel:+919642498490">96424 98490</a>
                ,{' '}
                <a href="tel:+919849489900">98494 89900</a>
              </span>
            </li>
          </ul>
        </div>
        <div>
          <h2>Service Hours</h2>
          <ul className="hours-list">
            <li><strong>Artisanal Morning Tiffins</strong><span>07:00 AM – 11:00 AM Daily</span></li>
            <li><strong>Grand Banquet Lunch</strong><span>12:00 PM – 03:30 PM Daily</span></li>
            <li><strong>Royal Twilight Dinner</strong><span>07:00 PM – 11:30 PM Daily</span></li>
            <li><strong>Hotel Suite Room Service</strong><span>24 Hours Concierge Delivery</span></li>
          </ul>
        </div>
        <div>
          <h2>Our Venues</h2>
          <ul className="footer-links">
            <li><Link to="/fine-dining">Spice Soirée Restaurant</Link></li>
            <li><Link to="/hospitality">The Saffron Grand Ballroom</Link></li>
            <li><Link to="/hospitality">Private Dining Salons</Link></li>
            <li><Link to="/hospitality">Heritage Guest Suites</Link></li>
          </ul>
        </div>
        <div>
          <h2>Location</h2>
          <div className="footer-map">
            <iframe
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Spice%20Soiree%2C%20Matrusri%20Nagar%2C%20Miyapur%2C%20Hyderabad&z=17&output=embed"
              title="Map showing Spice Soirée in Miyapur, Hyderabad"
            />
            <a
              aria-label="Open Spice Soirée in Google Maps"
              className="footer-map-marker-link"
              href="https://www.google.com/maps/search/?api=1&query=Spice%20Soiree%2C%20Matrusri%20Nagar%2C%20Miyapur%2C%20Hyderabad"
              rel="noreferrer"
              target="_blank"
            />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Spice Soirée Restaurant & Luxury Hospitality Ltd.</span>
        <span><Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link> · Thoughtfully prepared in Hyderabad.</span>
      </div>
    </footer>
  )
}

export default Footer
