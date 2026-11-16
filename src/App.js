
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

import Login from './components/Login'
import Register from './components/Register'

import AdminLayout from './components/admin/AdminLayout'
import AdminHome from './components/admin/AdminHome'
import AdminItems from './components/admin/AdminItems'
import AdminCustomers from './components/admin/AdminCustomers'
import AdminOrders from './components/admin/AdminOrders'

import MyOrders from './components/orders/MyOrders'
import MyAccount from './components/MyAccount'

import { AuthProvider, RequireAuth, ROLES } from './auth'

import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

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

function HomePage() {
  return (
    <main>
      <Home />
    </main>
  )
}

function SiteLayout() {
  return (
    <div className="app">
      <AnnouncementBar />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />

        <Routes>

          {/* Customer Login and Registration */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Login */}
          <Route
            path="/AdminLogin"
            element={<AdminLogin />}
          />

          {/* Dynamic Admin Portal */}
          <Route
            path="/admin"
            element={
              <RequireAuth role={ROLES.ADMIN}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminHome />} />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="menu"
              element={<AdminItems type="menu" />}
            />

            <Route
              path="preorder"
              element={<AdminItems type="preorder" />}
            />

            <Route
              path="meat"
              element={<AdminItems type="meat" />}
            />

            <Route
              path="customers"
              element={<AdminCustomers />}
            />

            <Route
              path="*"
              element={<Navigate to="/admin" replace />}
            />
          </Route>

          {/* Main Website */}
          <Route element={<SiteLayout />}>

            <Route index element={<HomePage />} />

            <Route
              path="home"
              element={<Navigate to="/" replace />}
            />

            <Route path="menu" element={<Menu />} />
            <Route path="menu/:category" element={<Menu />} />
            <Route path="daily-weekend-menu" element={<Menu />} />

            <Route
              path="PreOrderCurries"
              element={<PreOrderCurries />}
            />

            <Route
              path="PreOrderCurries/:category"
              element={<PreOrderCurries />}
            />

            <Route
              path="FreshMeatEggs"
              element={<FreshMeatEggs />}
            />

            <Route
              path="FreshMeatEggs/:category"
              element={<FreshMeatEggs />}
            />

            <Route path="catering" element={<Catering />} />
            <Route path="Catering" element={<Catering />} />

            <Route path="AboutUs" element={<AboutUs />} />
            <Route path="AboutUs/:category" element={<AboutUs />} />

            <Route path="contact" element={<Contact />} />
            <Route path="Contact" element={<Contact />} />

            <Route
              path="weekly-offers"
              element={<WeekOffersPage />}
            />

            <Route
              path="cart"
              element={<Cart />}
            />

            {/* Customer Protected Pages */}
            <Route
              path="booking"
              element={
                <RequireAuth role={ROLES.CUSTOMER}>
                  <BookingPage />
                </RequireAuth>
              }
            />

            <Route
              path="orders"
              element={
                <RequireAuth role={ROLES.CUSTOMER}>
                  <MyOrders />
                </RequireAuth>
              }
            />

            <Route
              path="account"
              element={
                <RequireAuth role={ROLES.CUSTOMER}>
                  <MyAccount />
                </RequireAuth>
              }
            />

          </Route>

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
