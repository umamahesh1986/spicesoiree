import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { adminApi, mediaUrl } from '../../api'
import Spinner from '../common/Spinner'

// One screen for all three catalogs; the differences live in this config.
//   pricing: 'sizes' -> list of { size, price }   (menu, pre-order)
//            'single' -> one price + unit + cuts   (fresh meat)
export const ITEM_TYPES = {
  menu: {
    title: 'Menu Items',
    singular: 'menu item',
    pricing: 'sizes',
    defaultSizes: [{ size: 'Half', price: '' }, { size: 'Full', price: '' }],
    fields: [
      { name: 'name', label: 'Item name', required: true },
      { name: 'section', label: 'Section heading', hint: 'e.g. CHICKEN STARTERS' },
      { name: 'mainHeading', label: 'Main heading (optional)', hint: 'e.g. VEGETARIAN STARTERS' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'isBestseller', label: 'Show "Bestseller" badge', type: 'checkbox' },
    ],
  },
  preorder: {
    title: 'Pre-Order Curries',
    singular: 'curry',
    pricing: 'sizes',
    defaultSizes: [{ size: 'Half', price: '' }, { size: 'Full', price: '' }],
    fields: [
      { name: 'name', label: 'Curry name', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image', label: 'Image', type: 'image' },
    ],
  },
  meat: {
    title: 'Fresh Meat & Eggs',
    singular: 'product',
    pricing: 'single',
    fields: [
      { name: 'name', label: 'Product name', required: true },
      { name: 'subtitle', label: 'Subtitle', hint: 'e.g. (Curry Cut)' },
      { name: 'price', label: 'Price (₹, added to cart)', type: 'number', required: true },
      { name: 'unit', label: 'Unit', required: true, hint: 'kg, tray, ...' },
      { name: 'displayPrice', label: 'Price label shown to customers', hint: 'e.g. ₹1,100 / kg' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'cuttingAllowed', label: 'Customer must choose a cutting option', type: 'checkbox' },
    ],
  },
}

const STATUS_FILTERS = {
  all: { label: 'All items', test: () => true },
  visible: { label: 'Visible', test: (i) => i.isActive },
  hidden: { label: 'Hidden', test: (i) => !i.isActive },
  outOfStock: { label: 'Out of stock', test: (i) => !i.inStock },
}

function emptyForm(config, categories) {
  const form = {
    id: null,
    categoryId: categories[0]?.id ?? '',
    isActive: true,
    inStock: true,
    sortOrder: '',
    prices: config.pricing === 'sizes' ? config.defaultSizes.map((p) => ({ ...p })) : [],
    cutsText: '',
  }
  for (const field of config.fields) {
    form[field.name] = field.type === 'checkbox' ? false : ''
  }
  if (config.pricing === 'single') form.unit = 'kg'
  return form
}

function formFromItem(config, item) {
  const form = {
    id: item.id,
    categoryId: item.categoryId,
    isActive: item.isActive,
    inStock: item.inStock,
    sortOrder: item.sortOrder,
    prices: (item.prices || []).map((p) => ({ size: p.size, price: String(p.price) })),
    cutsText: (item.cuts || []).join('\n'),
  }
  for (const field of config.fields) {
    form[field.name] = item[field.name] ?? (field.type === 'checkbox' ? false : '')
  }
  return form
}

function payloadFromForm(config, form) {
  const payload = {
    categoryId: Number(form.categoryId),
    isActive: form.isActive,
    inStock: form.inStock,
  }
  if (form.sortOrder !== '' && form.sortOrder !== null) payload.sortOrder = Number(form.sortOrder)
  for (const field of config.fields) payload[field.name] = form[field.name]
  if (config.pricing === 'sizes') {
    payload.prices = form.prices
      .filter((p) => p.size.trim() || p.price !== '')
      .map((p) => ({ size: p.size.trim(), price: p.price === '' ? null : Number(p.price) }))
  } else {
    payload.cuts = form.cutsText.split('\n').map((c) => c.trim()).filter(Boolean)
  }
  return payload
}

function priceSummary(item) {
  if (item.prices) return item.prices.map((p) => `${p.size} ₹${p.price}`).join(' · ')
  return `₹${item.price} / ${item.unit}`
}

// Upload goes to POST /api/admin/uploads; the returned /uploads/... path is
// stored on the item when the form is saved.
function ImageField({ value, onChange, onUploadingChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow choosing the same file again
    if (!file) return
    setUploading(true)
    onUploadingChange(true)
    setError('')
    try {
      const { url } = await adminApi.uploadImage(file)
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      onUploadingChange(false)
    }
  }

  return (
    <div className="admin-span-2 admin-image-field">
      <span className="admin-field-label">Image</span>
      <div className="admin-image-row">
        {value ? (
          <img className="admin-image-preview" src={mediaUrl(value)} alt="Item preview" />
        ) : (
          <div className="admin-image-empty">No image</div>
        )}
        <div className="admin-image-controls">
          <label className={`admin-upload-button${uploading ? ' is-busy' : ''}`}>
            {uploading ? <Spinner size="small" inline label="Uploading..." /> : value ? 'Replace image' : 'Upload image'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onFile}
              disabled={uploading}
              hidden
            />
          </label>
          <input
            aria-label="Image URL"
            placeholder="...or paste an image URL"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <button type="button" className="admin-link-button" onClick={() => onChange('')}>
              Remove image
            </button>
          )}
          <small className="admin-hint">JPG, PNG, WebP or GIF up to 8 MB. Saved as an optimised WebP (max 1200px).</small>
          {error && <p className="admin-dashboard-error">{error}</p>}
        </div>
      </div>
    </div>
  )
}

function ItemForm({ config, categories, initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }))
  const setPrice = (index, key, value) =>
    setForm((f) => ({
      ...f,
      prices: f.prices.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(payloadFromForm(config, form), form.id)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <form className="admin-panel admin-item-form" onSubmit={submit}>
      <h2>{form.id ? `Edit ${config.singular}` : `Add ${config.singular}`}</h2>

      <div className="admin-form-grid">
        <label>
          Category *
          <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        {config.fields.map((field) =>
          field.type === 'image' ? (
            <ImageField
              key={field.name}
              value={form[field.name]}
              onChange={(value) => set(field.name, value)}
              onUploadingChange={setUploading}
            />
          ) : field.type === 'checkbox' ? (
            <label className="admin-checkbox" key={field.name}>
              <input
                type="checkbox"
                checked={Boolean(form[field.name])}
                onChange={(e) => set(field.name, e.target.checked)}
              />
              {field.label}
            </label>
          ) : (
            <label key={field.name} className={field.type === 'textarea' ? 'admin-span-2' : ''}>
              {field.label}{field.required ? ' *' : ''}
              {field.type === 'textarea' ? (
                <textarea
                  rows={2}
                  value={form[field.name]}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  min={field.type === 'number' ? 0 : undefined}
                  step={field.type === 'number' ? '0.01' : undefined}
                  placeholder={field.hint}
                  value={form[field.name]}
                  onChange={(e) => set(field.name, e.target.value)}
                  required={field.required}
                />
              )}
            </label>
          )
        )}

        <label>
          Display order
          <input
            type="number"
            placeholder="Leave empty to add at the end"
            value={form.sortOrder}
            onChange={(e) => set('sortOrder', e.target.value)}
          />
        </label>

        <label className="admin-checkbox">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
          Visible on website
        </label>

        <label className="admin-checkbox">
          <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} />
          In stock
        </label>
      </div>


      {config.pricing === 'sizes' && (
        <fieldset className="admin-prices">
          <legend>Sizes & prices *</legend>
          {form.prices.map((p, index) => (
            <div className="admin-price-row" key={index}>
              <input
                aria-label={`Size ${index + 1}`}
                placeholder="Size (e.g. Half, 6 pcs)"
                value={p.size}
                onChange={(e) => setPrice(index, 'size', e.target.value)}
              />
              <input
                aria-label={`Price ${index + 1}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="Price ₹"
                value={p.price}
                onChange={(e) => setPrice(index, 'price', e.target.value)}
              />
              <button
                type="button"
                className="admin-link-button"
                onClick={() => set('prices', form.prices.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-link-button"
            onClick={() => set('prices', [...form.prices, { size: '', price: '' }])}
          >
            + Add size
          </button>
        </fieldset>
      )}

      {config.pricing === 'single' && form.cuttingAllowed && (
        <label className="admin-block-label">
          Cutting options * (one per line)
          <textarea
            rows={5}
            value={form.cutsText}
            onChange={(e) => set('cutsText', e.target.value)}
            placeholder={'Curry Cut - Small\nCurry Cut - Medium'}
          />
        </label>
      )}

      {error && <p className="admin-dashboard-error">{error}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={saving || uploading}>
          {saving ? 'Saving...' : form.id ? 'Save Changes' : `Add ${config.singular}`}
        </button>
        <button type="button" className="admin-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function AdminItems({ type }) {
  const config = ITEM_TYPES[type]

  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // form initial values, or null
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = useCallback(() => {
    return adminApi.catalog(type).then(
      (result) => {
        setData(result)
        setError('')
      },
      (err) => setError(err.message)
    )
  }, [type])

  useEffect(() => {
    setData(null)
    setEditing(null)
    setNotice('')
    setSearch('')
    setCategoryFilter('')
    setStatusFilter('all')
    load()
  }, [load])

  const visibleItems = useMemo(() => {
    if (!data) return []
    const term = search.trim().toLowerCase()
    return data.items.filter(
      (item) =>
        (!term || item.name.toLowerCase().includes(term)) &&
        (!categoryFilter || String(item.categoryId) === categoryFilter) &&
        STATUS_FILTERS[statusFilter].test(item)
    )
  }, [data, search, categoryFilter, statusFilter])

  const replaceItem = (updated) =>
    setData((d) => ({ ...d, items: d.items.map((i) => (i.id === updated.id ? updated : i)) }))

  const toggle = async (item, flag) => {
    setBusyId(item.id)
    setNotice('')
    try {
      replaceItem(await adminApi.setItemFlags(type, item.id, { [flag]: !item[flag] }))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const save = async (payload, id) => {
    const saved = id
      ? await adminApi.updateItem(type, id, payload)
      : await adminApi.createItem(type, payload)
    setEditing(null)
    setNotice(`"${saved.name}" ${id ? 'updated' : 'added'}.`)
    await load()
  }

  return (
    <>
      <div className="admin-page-header">
        <h1>{config.title}</h1>
        {data && !editing && (
          <button type="button" onClick={() => setEditing(emptyForm(config, data.categories))}>
            + Add {config.singular}
          </button>
        )}
      </div>
      <p className="admin-hint">
        Hidden items are removed from the website. Out-of-stock items stay visible but cannot be added to the cart.
      </p>

      {error && <p className="admin-dashboard-error">{error}</p>}
      {notice && <p className="admin-notice">{notice}</p>}

      {editing && data && (
        <ItemForm
          key={editing.id ?? 'new'}
          config={config}
          categories={data.categories}
          initial={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      )}

      {!data && !error && <Spinner label="Loading items..." />}

      {data && (
        <section className="admin-panel">
          <div className="admin-filters">
            <input
              type="search"
              placeholder="Search by name"
              aria-label="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select aria-label="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All categories</option>
              {data.categories.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
            <select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {Object.entries(STATUS_FILTERS).map(([key, f]) => (
                <option key={key} value={key}>{f.label}</option>
              ))}
            </select>
            <span className="admin-hint">{visibleItems.length} of {data.items.length}</span>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Website</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id} className={item.isActive ? '' : 'admin-row-hidden'}>
                    <td>
                      {item.image ? <img className="admin-thumb" src={mediaUrl(item.image)} alt="" loading="lazy" /> : null}
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                      {item.isBestseller && <span className="admin-badge ok">Bestseller</span>}
                    </td>
                    <td>{item.category}</td>
                    <td className="admin-wrap">{priceSummary(item)}</td>
                    <td>
                      <button
                        type="button"
                        className={`admin-toggle ${item.isActive ? 'ok' : 'off'}`}
                        disabled={busyId === item.id}
                        onClick={() => toggle(item, 'isActive')}
                        title={item.isActive ? 'Click to hide from website' : 'Click to show on website'}
                      >
                        {item.isActive ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`admin-toggle ${item.inStock ? 'ok' : 'warn'}`}
                        disabled={busyId === item.id}
                        onClick={() => toggle(item, 'inStock')}
                        title={item.inStock ? 'Click to mark out of stock' : 'Click to mark in stock'}
                      >
                        {item.inStock ? 'In stock' : 'Out of stock'}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          setNotice('')
                          setEditing(formFromItem(config, item))
                          window.scrollTo(0, 0)
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleItems.length === 0 && <p>No items match these filters.</p>}
          </div>
        </section>
      )}
    </>
  )
}

export default AdminItems
