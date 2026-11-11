import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FineDiningPage from './FineDiningPage'
import WeekOffersPage from './WeekOffersPage'
import BookingPage from './BookingPage'
import HospitalityPage from './HospitalityPage'
import ReviewsPage from './ReviewsPage'
import './Home.css'

const heroImages = [
  {
    title: 'Nizami Dum Biryani',
    description: 'Saffron basmati, slow-cooked to perfection',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABPpOY1jejMhacJBqQ6gM-taWLZY5yHS776HGbyYlwrIfPJVXvJKSjCWPzJQMZCnB092HLfzOF8UQ3QwncMnHL5dL42xffXx_K9-L39B78wfRgKMN6wYAaqkIKtNovN9wm_FGfSBoM_cw0vxH99qY-q0eKeg-b3If4dXrd-V7QfeBkTl2yrdye7UyHSJzfbnV2c2t1UrJeR313fH9NkIsWJDKYEZmbG4zJ_RrSP0lM',
  },
  {
    title: 'Artisanal Hyderabadi Dining',
    description: 'Kitchen dispatch: 30–45 mins',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2duHTX-y9IP1B5Cux2Ezm9qnkR29y17aZjWNssjY3iaM7TpMXI6VYLi34JYUPPRbyePDoDWRJ4UJd3-Ic8ZVqdMSuVSw2Vl-LEn9EQxL1z7OiJXg-ru4Ydvp6kMMPSnnKLl6_aFU9dFqnOgqbh7LDhq79uVkd8F8Co5M1rsAcOeHLJfWYn5zs5bRukYk-WxmJ-I7aQ21ylSYDYHn6SmgYP3QL3kzDiFs0bDtvO8Io',
  },
  {
    title: 'Signature Morning Tiffins',
    description: 'Pre-book by 6:00 PM previous eve',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDn0JJqrsznAe3Kms2DY8P5mduFBphq4JKnnvX_Q7vbmhVYNMVQCcYqEaz45kEGZ99cbKws9cmUNPJrp_ac_keRqtAqDkqXDBwQ_BReCbGp34uu9dwFY9mqo-GoVm_IfAX5BhYO_8zB1mmL7OkWqqs-RlcgHSVxEOjYh42zjK-I74QV7bVVyYEWigSW6r095Qk35QClDOvvVHDEHrMHWuGfyA0_uNey0To1phx_IzYA',
  },
  {
    title: 'Weekend Handi Curries',
    description: 'Pre-book by Friday 6:00 PM',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGqBJ0xA85xtPlvVEcwM0pmwrVacpM4Ya2E0sUXFCsJSufulZv8NYqRnFSJdhufnV3cOzNmthcWmUISEMBUDG_ESc6aHso9nDTeRC3lG3ftmq52zOm2wLmFUchmL29LvqnBR1_2C5GiDAR9G8gwxc46bfL4VLQkjxBlLtKpbcI7U8JTlSMxMkrfjl_ysnrBPbF12wAMAVLQYGRYe-AE0PjYTHXO7pi3lfzUX6HickC',
  },
]

function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const slide = heroImages[activeSlide]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroImages.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  const changeSlide = (direction) => {
    setActiveSlide((current) => (current + direction + heroImages.length) % heroImages.length)
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-inner">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55 }}
            className="hero-copy"
          >
            <span className="eyebrow">✦ &nbsp; Miyapur’s Crown Epicurean Destination</span>
            <h1>Where <em>Spice</em> Meets Pure Splendour.</h1>
            <p>
              Indulge in artisanal slow-dum Hyderabadi biryanis, morning tiffins
              tempered in cold-pressed ghee, and exquisite banquet suites.
              Handcrafted by master royal ustads for discerning palates.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/booking">Book dining & suites <span>→</span></Link>
              <Link className="button button-secondary" to="/fine-dining">Explore Daily & Weekend Menu <span>→</span></Link>
            </div>
            <div className="hero-stats">
              <div><strong>4.9 / 5.0</strong><span>1,400+ epicurean reviews</span></div>
              <div><strong>Luxury suites</strong><span>Hotel & grand ballrooms</span></div>
              <div><strong>Copper deg</strong><span>Royal dum heritage</span></div>
            </div>
          </motion.div>
          <div className="hero-visual">
            <img key={slide.image} src={slide.image} alt={slide.title} />
            <div className="curator-badge">
              <span>✦</span>
              <div><small>Curated by</small><strong>Master Ustads of Deccan</strong></div>
            </div>
            <div aria-label="Featured images" className="hero-top-controls">
              <button aria-label="Previous featured image" onClick={() => changeSlide(-1)} type="button">‹</button>
              <div className="slide-dots">
                {heroImages.map((item, index) => (
                  <button
                    aria-label={`Show ${item.title}`}
                    aria-pressed={index === activeSlide}
                    className={index === activeSlide ? 'active' : ''}
                    key={item.title}
                    onClick={() => setActiveSlide(index)}
                    type="button"
                  />
                ))}
              </div>
              <button aria-label="Next featured image" onClick={() => changeSlide(1)} type="button">›</button>
            </div>
            <div className="hero-caption">
              <span className="hero-live-dot" />
              <div className="hero-caption-copy"><strong>{slide.title}</strong><span>{slide.description}</span></div>
              <span className="live-tag">Live Today</span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Our highlights" className="highlights-bar">
        <div><span>✦</span><p><strong>Cold-pressed ghee</strong><small>Zero additives</small></p></div>
        <div><span>⌁</span><p><strong>Hot doorstep delivery</strong><small>Thermal-sealed handi</small></p></div>
        <div><span>⌂</span><p><strong>Boutique hotel suites</strong><small>24-hour room dining</small></p></div>
        <div><span>♧</span><p><strong>The Saffron Ballroom</strong><small>Banquets up to 450 guests</small></p></div>
      </section>

      <FineDiningPage compact />
      <WeekOffersPage />
      <BookingPage compact />
      <HospitalityPage compact />
      <ReviewsPage compact />
    </main>
  )
}

export default Home
