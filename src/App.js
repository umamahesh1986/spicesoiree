import { useLayoutEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import FineDiningPage from './components/FineDiningPage'
import RestaurantMenu from './components/RestaurantMenu'
import BookingPage from './components/BookingPage'
import HospitalityPage from './components/HospitalityPage'
import WeekOffersPage from './components/WeekOffersPage'
import ReviewsPage from './components/ReviewsPage'
import Footer from './components/Footer'
import './App.css'

function HomeScrollReset() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if (pathname === '/') {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
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
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

function HeaderFooterPage() {
  return (
    <div className="app">
      <Header />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <HomeScrollReset />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="fine-dining" element={<FineDiningPage />} />
          <Route path="menu" element={<RestaurantMenu />} />
          <Route path="daily-weekend-menu" element={<RestaurantMenu />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="hospitality" element={<HospitalityPage />} />
          <Route path="weekly-offers" element={<WeekOffersPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
        <Route path="Footer" element={<HeaderFooterPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
