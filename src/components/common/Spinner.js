import React from 'react'
import './Spinner.css'

// Loading indicator used wherever data comes from the server.
//   <Spinner label="Loading menu..." />          block, centred
//   <Spinner size="small" inline />               inside buttons / text
function Spinner({ label = 'Loading...', size = 'medium', inline = false }) {
  return (
    <span
      className={`spinner spinner-${size}${inline ? ' spinner-inline' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="spinner-ring" aria-hidden="true" />
      {label && <span className="spinner-label">{label}</span>}
    </span>
  )
}

export default Spinner
