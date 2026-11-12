import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Header.css'

const navigationItems = [
  {
    pathname: '/',
    name: 'Home',
  },
  {
    pathname: '/menu',
    name: 'Menu',
    dropdown: [
      { category: 'All Items', name: 'All Menu' },
      { category: 'Biryani', name: 'Biryani' },
      { category: 'Starters', name: 'Starters' },
      { category: 'BBQ & Tandoori', name: 'BBQ & Tandoori' },
      { category: 'Chinese', name: 'Chinese' },
      { category: 'Breads', name: 'Breads' },
      { category: 'Veg Specials', name: 'Veg Specials' },
    ],
  },
  {
    pathname: '/PreOrderCurries',
    name: 'Pre-Order',
    dropdown: [
      { pathname: '/PreOrderCurries/veg', name: 'Veg Curries' },
      { pathname: '/PreOrderCurries/non-veg', name: 'Non-Veg Curries' },
    ],
  },
  {
    pathname: '/FreshMeatEggs',
    name: 'Fresh Meat & Eggs',
    dropdown: [
      { pathname: '/FreshMeatEggs', name: 'All Products' },
      { pathname: '/FreshMeatEggs/chicken', name: 'Chicken' },
      { pathname: '/FreshMeatEggs/boneless', name: 'Boneless Chicken' },
      { pathname: '/FreshMeatEggs/mutton', name: 'Mutton' },
      { pathname: '/FreshMeatEggs/keema', name: 'Mutton Keema' },
      { pathname: '/FreshMeatEggs/eggs', name: 'Eggs' },
      { pathname: '/FreshMeatEggs/cutting-options', name: 'Cutting Options' },
    ],
  },
  {
    pathname: '/catering',
    name: 'Catering',
  },
  {
    pathname: '/AboutUs',
    name: 'About Us',
  },
  {
    pathname: '/contact',
    name: 'Contact',
  },
]

function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-inner">
        <div className="announcement-location">
          <span>📍</span>
          Matrusi Nagar, Hyderabad
        </div>

        <div className="announcement-hours">
          <span>◷</span>
          Open Today: 12:00 PM – 10:30 PM
        </div>
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="10.8" cy="10.8" r="7" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="27"
      height="27"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 3h2l2.5 13h12L21 7H5" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="43"
      height="43"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 3a12 12 0 0 0-10.3 18.2L4 28l7-1.8A12 12 0 1 0 16 3Z" />
      <path d="M11 10c-.7 1-.8 2.1-.3 3.2 1.4 3.1 3.9 5.6 7 7 1.1.5 2.2.4 3.2-.3l1.1-1.4-3.5-1.7-1.5 1.5c-1.7-.7-3.2-2.2-3.9-3.9l1.5-1.5-1.7-3.5L11 10Z" />
    </svg>
  )
}

function Header() {
  const location = useLocation()
  const [openDropdown, setOpenDropdown] = useState(null)

  // Route change ayinappudu dropdown close avuthundi
  useEffect(() => {
    setOpenDropdown(null)
  }, [location.pathname])

  const toggleDropdown = (name) => {
    setOpenDropdown((current) =>
      current === name ? null : name
    )
  }

  const isParentActive = (item) => {
    if (item.pathname === '/') {
      return location.pathname === '/'
    }

    return (
      location.pathname === item.pathname ||
      location.pathname.startsWith(`${item.pathname}/`)
    )
  }

  return (
    <>
      <AnnouncementBar />

      <header className="site-header">
        <div className="header-inner">

          <Link to="/" className="brand">
            <img
              src="/images/spice-soiree-logo.jpg"
              alt="Spice Soirée Restaurant"
            />
          </Link>

          <nav className="primary-nav">

            {navigationItems.map((item) => (
              item.dropdown ? (
                <div
                  className={`nav-dropdown ${
                    openDropdown === item.name ? 'dropdown-open' : ''
                  }`}
                  key={item.name}
                >

                  <div className="dropdown-heading">

                    <NavLink
                      to={item.pathname}
                      end={item.name === 'Menu'}
                      className={
                        isParentActive(item)
                          ? 'dropdown-trigger active'
                          : 'dropdown-trigger'
                      }
                    >
                      {item.name}
                    </NavLink>

                    <button
                      type="button"
                      className="dropdown-arrow-btn"
                      aria-label={`Toggle ${item.name} dropdown`}
                      aria-expanded={openDropdown === item.name}
                      onClick={() => toggleDropdown(item.name)}
                    >
                      <span
                        className={
                          openDropdown === item.name
                            ? 'dropdown-arrow arrow-open'
                            : 'dropdown-arrow'
                        }
                      >
                        ⌄
                      </span>
                    </button>

                  </div>

                  <div className="dropdown-menu">

                    {item.dropdown.map((subItem) => (
                      <NavLink
                        key={subItem.name}
                        to={
                          item.name === 'Menu'
                            ? '/menu'
                            : subItem.pathname
                        }
                        state={
                          item.name === 'Menu'
                            ? { category: subItem.category }
                            : undefined
                        }
                        end
                        onClick={() => setOpenDropdown(null)}
                      >
                        {subItem.name}
                      </NavLink>
                    ))}

                  </div>

                </div>
              ) : (
                <NavLink
                  key={item.pathname}
                  to={item.pathname}
                  end
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  {item.name}
                </NavLink>
              )
            ))}

          </nav>

          <div className="header-actions">

            <button
              type="button"
              className="search-button"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            <Link to="/cart" className="cart-button">
              <CartIcon />
              <span className="cart-count">0</span>
            </Link>

            <a
              href="https://wa.me/919849489900"
              target="_blank"
              rel="noreferrer"
              className="whatsapp-button"
            >
              <WhatsAppIcon />

              <span className="whatsapp-content">
                <small>Order on WhatsApp</small>
                <strong>98494 89900</strong>
              </span>
            </a>

          </div>

        </div>
      </header>
    </>
  )
}

export default Header
