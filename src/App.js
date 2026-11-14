import { useLayoutEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'

import AnnouncementBar from './components/AnnouncementBar'
import Header from './components/Header'
import Home from './components/Home'
import FineDiningPage from './components/FineDiningPage'
import Menu from './components/Menu'
import PreOrderCurries from './components/PreOrderCurries'
import FreshMeatEggs from './components/FreshMeatEggs'
import Catering from './components/Catering'
import AboutUs from './components/AboutUs'
import Contact from './components/Contact'
import Cart from './components/Cart'
import BookingPage from './components/BookingPage'
import AdminLogin from './components/AdminLogin'
import HospitalityPage from './components/HospitalityPage'
import WeekOffersPage from './components/WeekOffersPage'
import ReviewsPage from './components/ReviewsPage'
import Footer from './components/Footer'

import './App.css'

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Temporary page for pages not created yet
function ComingSoon() {
  const { category } = useParams()

  return (
    <main className="coming-soon">
      <h1>
        {category
          ? category.replaceAll('-', ' ').toUpperCase()
          : 'Coming Soon'}
      </h1>
      <p>This page is coming soon.</p>
    </main>
  )
}

// Home page
function HomePage() {
  return (
    <main>
      <Home />
    </main>
  )
}

// Common layout
function SiteLayout() {
  return (
    <div className="app">

      {/* Announcement Bar - Top Level */}
      <AnnouncementBar />

      {/* Main Header */}
      <Header />

      {/* All Page Routes */}
      <Outlet />

      {/* Footer */}
      <Footer />

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        {/* Admin Login - Separate Page */}
        <Route
          path="/AdminLogin"
          element={<AdminLogin />}
        />

        {/* Main Website Routes */}
        <Route element={<SiteLayout />}>

          {/* Home */}
          <Route index element={<HomePage />} />

          <Route
            path="home"
            element={<Navigate to="/" replace />}
          />

          {/* Menu */}
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:category" element={<Menu />} />
          <Route path="daily-weekend-menu" element={<Menu />} />

          {/* Pre-Order */}
          <Route
            path="PreOrderCurries"
            element={<PreOrderCurries />}
          />

          <Route
            path="PreOrderCurries/:category"
            element={<PreOrderCurries />}
          />

          {/* Fresh Meat & Eggs */}
          <Route
            path="FreshMeatEggs"
            element={<FreshMeatEggs />}
          />

          <Route
            path="FreshMeatEggs/:category"
            element={<FreshMeatEggs />}
          />

          {/* Catering */}
          <Route path="catering" element={<Catering />} />
          <Route path="Catering" element={<Catering />} />

          {/* About Us */}
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path="AboutUs/:category" element={<AboutUs />} />

          {/* Contact */}
          <Route path="contact" element={<Contact />} />
          <Route path="Contact" element={<Contact />} />

          {/* Weekly Offers */}
          <Route
            path="weekly-offers"
            element={<WeekOffersPage />}
          />

          {/* Cart */}
          <Route path="cart" element={<Cart />} />

          {/* Booking Page */}
          <Route
            path="booking"
            element={<BookingPage />}
          />

        </Route>

        {/* Invalid URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App
