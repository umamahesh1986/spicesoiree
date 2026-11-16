import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { authApi, getToken, setToken } from './api'
import Spinner from './components/common/Spinner'

export const ROLES = Object.freeze({ ADMIN: 'admin', CUSTOMER: 'customer' })

// Where each role lands after logging in (or when it opens a page for the other role)
export function homeForRole(role) {
  return role === ROLES.ADMIN ? '/admin' : '/account'
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true while an existing token is being checked with GET /api/auth/me
  const [loading, setLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) return undefined
    let active = true
    authApi
      .me()
      .then(({ user }) => active && setUser(user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Any API call rejected with 401 clears the session (see api.js)
  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('authExpired', onExpired)
    return () => window.removeEventListener('authExpired', onExpired)
  }, [])

  const startSession = useCallback(({ token, user }) => {
    setToken(token)
    setUser(user)
    return user
  }, [])

  const login = useCallback(
    async (identifier, password) =>
      startSession(await authApi.login(identifier, password)),
    [startSession]
  )

  const register = useCallback(
    async (details) => startSession(await authApi.register(details)),
    [startSession]
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser, startSession }),
    [user, loading, login, register, logout, startSession]
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}

// Route guard.
//   <RequireAuth role="admin"><AdminDashboard /></RequireAuth>
// Not logged in  -> /login (and back here afterwards)
// Wrong role     -> that role's own home screen
export function RequireAuth({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return createElement(Spinner, { label: 'Checking your login...' })
  }
  if (!user) {
    return createElement(Navigate, {
      to: '/login',
      replace: true,
      state: { from: location },
    })
  }
  if (role && user.role !== role) {
    return createElement(Navigate, { to: homeForRole(user.role), replace: true })
  }
  return children
}
