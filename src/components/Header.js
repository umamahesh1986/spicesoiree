import { Link, NavLink } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import './Header.css'

  const navigationItems = [
    { pathname: '/home', name: 'Home' },
    { pathname: '/menu', name: 'Menu' },
    { pathname: '/booking', name: 'Pre-orders' },
    { pathname: '/hospitality', name: 'Hotel & Banquets' },
    { pathname: '/weekly-offers', name: 'Weekly Offers' },
    { pathname: '/reviews', name: 'Reviews' },
  ]

  function Header() {
  return (
    <>
      <AnnouncementBar />
      <header className="site-header">
        <div className="header-inner">
          <Link aria-label="Spice Soirée home" className="brand" to="/">
            <img src="/images/spice-soiree-logo.jpg" alt="Spice Soirée Restaurant" />
          </Link>
          <nav aria-label="Main navigation" className="primary-nav">
            {navigationItems.map(({ pathname, name }) => (
              <NavLink key={pathname} to={pathname}>{name}</NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="button button-primary header-book" to="/booking">
              Book dining <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
