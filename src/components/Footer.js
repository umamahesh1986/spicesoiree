import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-grid">

        {/* BRAND */}
        <div className="footer-brand">
          <Link aria-label="Spice Soirée home" className="brand" to="/">
            <img
              src="/images/spice-soiree-logo.jpg"
              alt="Spice Soirée Restaurant"
            />
          </Link>

          <p>
            A sanctuary of heritage dining, grand banquet salons, and royal
            Hyderabadi traditions crafted for the discerning palate.
          </p>

          <span className="footer-badge">
            ✦ Heritage hospitality · Miyapur, Hyderabad
          </span>
        </div>

        {/* CONTACT */}
        <div className="footer-column">
          <h2>Contact Us</h2>

          <ul className="footer-contact-list">
            <li>
              <strong>🏢 Address</strong>
              <address>
                Plot No. 1031, Road No. 2/5, Matrusree Nagar,
                Miyapur, Hyderabad 500049
              </address>
            </li>

            <li>
              <strong>✉ Email</strong>
              <a href="mailto:spicesoiree@gmail.com">
                spicesoiree@gmail.com
              </a>
            </li>

            <li>
              <strong>☎ Phone</strong>
              <span className="footer-phone-numbers">
                <a href="tel:+919642498490">96424 98490</a>
                <br />
                <a href="tel:+919849489900">98494 89900</a>
              </span>
            </li>
          </ul>
        </div>

        {/* SERVICE HOURS */}
        <div className="footer-column">
          <h2>Service Hours</h2>

          <div className="footer-hours-card">
            <span className="footer-hours-icon">◷</span>

            <h3>Open Every Day</h3>

            <p>Restaurant Service Hours</p>

            <strong>12:00 PM – 10:30 PM</strong>

            <span className="footer-open-badge">
              ● Open Daily
            </span>
          </div>
        </div>

        {/* LOCATION */}
        <div className="footer-column footer-location">
          <h2>Our Location</h2>

          <div className="footer-location-info">
            <span className="location-pin">📍</span>

            <div>
              <h3>Spice Soirée Restaurant</h3>
              <p>
                Matrusree Nagar, Miyapur,
                Hyderabad, Telangana 500049
              </p>
            </div>
          </div>

          <div className="footer-map">
            <iframe
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Spice%20Soiree%2C%20Matrusri%20Nagar%2C%20Miyapur%2C%20Hyderabad&z=16&output=embed"
              title="Spice Soirée Location Map"
            />
          </div>

          <a
            className="footer-directions"
            href="https://www.google.com/maps/search/?api=1&query=Spice%20Soiree%2C%20Matrusri%20Nagar%2C%20Miyapur%2C%20Hyderabad"
            target="_blank"
            rel="noreferrer"
          >
            Get Directions ↗
          </a>
        </div>

      </div>

      {/* BOTTOM FOOTER */}
      <div className="footer-bottom">

        <span>
          © 2026 Spice Soirée Restaurant. All Rights Reserved.
        </span>

        <span>
          <Link to="/privacy">Privacy</Link>
          {' · '}
          <Link to="/terms">Terms</Link>
          {' · '}
          Thoughtfully prepared in Hyderabad.
        </span>

      </div>

    </footer>
  )
}

export default Footer
