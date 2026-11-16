import { Fragment, createElement, useEffect, useState } from 'react'

// Base URL of the Node API. Override per environment with REACT_APP_API_URL
// (e.g. in Client/.env.production: REACT_APP_API_URL=https://api.example.com/api).
export const API_BASE = (
  process.env.REACT_APP_API_URL || 'http://localhost:4000/api'
).replace(/\/$/, '')

// Item images are stored on the API server (/uploads/...). When the website and
// the API run on different origins (e.g. localhost:3000 and :4000), those paths
// must point at the API server. Absolute URLs (https://...) pass through.
const MEDIA_ORIGIN = API_BASE.replace(/\/api$/, '')

export function mediaUrl(path) {
  if (!path) return ''
  return path.startsWith('/uploads/') ? `${MEDIA_ORIGIN}${path}` : path
}

// Rewrites every `image` field in an API payload with mediaUrl().
function resolveMediaUrls(value) {
  if (Array.isArray(value)) return value.map(resolveMediaUrls)
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, v] of Object.entries(value)) {
      out[key] = key === 'image' && typeof v === 'string' ? mediaUrl(v) : resolveMediaUrls(v)
    }
    return out
  }
  return value
}

// path -> { promise, value }. Catalog data rarely changes, so each path is
// fetched once per page load and shared by every component that needs it.
const cache = new Map()

// ---------------------------------------------------------------------------
// Auth token (JWT) storage. The token is sent as "Authorization: Bearer ...".
// ---------------------------------------------------------------------------
const TOKEN_KEY = 'spice_soiree_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // storage unavailable (private mode) - session lasts until reload
  }
}

async function request(path, { body, method = 'GET' } = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    // A rejected token means the session is over: tell the AuthProvider.
    if (response.status === 401 && token) {
      setToken(null)
      window.dispatchEvent(new Event('authExpired'))
    }
    const error = new Error(data?.error || `Request failed (${response.status})`)
    error.status = response.status
    throw error
  }
  return data
}

export function fetchCached(path) {
  if (!cache.has(path)) {
    const entry = {}
    entry.promise = request(path).then(
      (data) => {
        const value = resolveMediaUrls(data)
        entry.value = value
        return value
      },
      (error) => {
        cache.delete(path) // allow a retry on next mount
        throw error
      }
    )
    cache.set(path, entry)
  }
  return cache.get(path).promise
}

// const { data, loading, error } = useApi('/menu')
export function useApi(path) {
  const [state, setState] = useState(() => {
    const value = cache.get(path)?.value
    return { data: value ?? null, loading: value === undefined, error: null }
  })

  useEffect(() => {
    let active = true
    fetchCached(path).then(
      (data) => active && setState({ data, loading: false, error: null }),
      (error) => active && setState({ data: null, loading: false, error })
    )
    return () => {
      active = false
    }
  }, [path])

  return state
}

// Site-wide settings (WhatsApp number, phones, address, hours...). Returns {} until loaded.
export function useSettings() {
  return useApi('/settings').data || {}
}

export function whatsappUrl(settings, text) {
  const base = `https://wa.me/${settings.whatsapp_number || ''}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

// ---------------------------------------------------------------------------
// Auth endpoints (admins and customers)
// ---------------------------------------------------------------------------
export const authApi = {
  login: (identifier, password) =>
    request('/auth/login', { method: 'POST', body: { identifier, password } }),
  register: (details) =>
    request('/auth/register', { method: 'POST', body: details }),
  me: () => request('/auth/me'),
  updateProfile: (details) =>
    request('/auth/me', { method: 'PUT', body: details }),
  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword },
    }),
  logoutAll: () => request('/auth/logout-all', { method: 'POST' }),
}

// ---------------------------------------------------------------------------
// Customer orders (server rejects non-customer tokens with 403)
// ---------------------------------------------------------------------------
export const ordersApi = {
  // details: { fulfilmentType, customerName, customerPhone, deliveryAddress,
  //            dates: ['YYYY-MM-DD'], timeSlot, notes, items: [{ itemType, itemId, size, cuttingOption, quantity }] }
  place: (details) => request('/orders', { method: 'POST', body: details }),
  mine: () => request('/orders'),
  get: (id) => request(`/orders/${id}`),
  cancel: (id, reason) => request(`/orders/${id}/cancel`, { method: 'POST', body: { reason } }),
  dispute: (id, reason) => request(`/orders/${id}/dispute`, { method: 'POST', body: { reason } }),
}

// ---------------------------------------------------------------------------
// Admin-only endpoints (server rejects non-admin tokens with 403)
// ---------------------------------------------------------------------------
// Public catalog paths per admin catalog type, so edits show up on the website
// without a page reload.
const PUBLIC_PATH_FOR_TYPE = {
  menu: '/menu',
  preorder: '/preorder',
  meat: '/fresh-meat',
}

async function catalogWrite(type, promise) {
  const result = await promise
  cache.delete(PUBLIC_PATH_FOR_TYPE[type])
  return result
}

export const adminApi = {
  summary: () => request('/admin/summary'),
  customers: () => request('/admin/customers'),
  setCustomerActive: (id, isActive) =>
    request(`/admin/customers/${id}`, { method: 'PATCH', body: { isActive } }),

  // type: 'menu' | 'preorder' | 'meat'
  catalog: (type) => request(`/admin/catalog/${type}`),
  createItem: (type, item) =>
    catalogWrite(type, request(`/admin/catalog/${type}`, { method: 'POST', body: item })),
  updateItem: (type, id, item) =>
    catalogWrite(type, request(`/admin/catalog/${type}/${id}`, { method: 'PUT', body: item })),
  setItemFlags: (type, id, flags) =>
    catalogWrite(type, request(`/admin/catalog/${type}/${id}`, { method: 'PATCH', body: flags })),

  // Orders. filters: { view: open|completed|closed|all, status, date, q }
  orderMeta: () => request('/admin/orders/meta'),
  orders: (filters = {}) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value)
    ).toString()
    return request(`/admin/orders${query ? `?${query}` : ''}`)
  },
  setOrderStatus: (id, status, note) =>
    request(`/admin/orders/${id}/status`, { method: 'POST', body: { status, note } }),
  setOrderPayment: (id, paymentStatus) =>
    request(`/admin/orders/${id}/payment`, { method: 'PATCH', body: { paymentStatus } }),

  // Uploads an image file; resolves to { url: '/uploads/...' } (store this path on the item)
  uploadImage: async (file) => {
    const form = new FormData()
    form.append('image', file)
    const token = getToken()
    const response = await fetch(`${API_BASE}/admin/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      const error = new Error(data?.error || `Upload failed (${response.status})`)
      error.status = response.status
      throw error
    }
    return data
  },
}

// Cart (localStorage) helpers shared by checkout
export const CART_KEY = 'spice_soiree_cart'

export function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(cart) ? cart : []
  } catch {
    return []
  }
}

// Cart lines saved before orders went to the database have no itemType/itemId.
// Match them to the live catalog by name (+ size), so customers don't have to
// re-add them. Old carts only ever held menu and fresh-meat items (pre-order
// curries used a different storage key back then). Lines that can't be matched
// are returned unchanged and checkout asks the customer to re-add them.
//
// Also refreshes images saved as old client paths (/images/...), which moved to
// the server's /uploads folder.
const needsRepair = (item) =>
  !item.itemType || !item.itemId || (item.image || '').startsWith('/images/')

export async function repairCart(items) {
  if (!items.some(needsRepair)) return items

  const [menu, preorder, meat] = await Promise.all([
    fetchCached('/menu'),
    fetchCached('/preorder'),
    fetchCached('/fresh-meat'),
  ])
  const catalogs = { menu: menu.items, preorder: preorder.items, meat: meat.products }

  return items.map((item) => {
    if (!needsRepair(item)) return item

    let match = null
    if (item.itemType && item.itemId) {
      const found = catalogs[item.itemType]?.find((c) => c.id === item.itemId)
      if (found) match = { itemType: item.itemType, entry: found }
    } else {
      const menuItem = menu.items.find((m) => m.name === item.name && item.size in m.prices)
      const product = meat.products.find((p) => p.name === item.name)
      if (menuItem) match = { itemType: 'menu', entry: menuItem }
      else if (product) match = { itemType: 'meat', entry: product }
    }

    if (!match) return item
    return { ...item, itemType: match.itemType, itemId: match.entry.id, image: match.entry.image }
  })
}

export function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('cartUpdated'))
}

export function clearCart() {
  try {
    localStorage.removeItem(CART_KEY)
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('cartUpdated'))
}

// Renders "line one\nline two" from the database as line one<br />line two.
export function multiline(text = '') {
  return text
    .split('\n')
    .map((line, i) =>
      createElement(Fragment, { key: i }, i > 0 ? createElement('br') : null, line)
    )
}
