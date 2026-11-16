// Deployment self-check. If the site does not start, set the hosting panel's
// startup file to diag.js (instead of server.js) and open the site: it lists
// what works and what does not.
// Uses only Node's built-in modules, so it works even if the app itself cannot start.
// Switch the startup file back to server.js afterwards.
const fs = require('fs')
const http = require('http')
const path = require('path')

const checks = []
const check = (label, fn) => {
  try {
    checks.push(`${label}: ${fn()}`)
  } catch (err) {
    checks.push(`${label}: FAILED - ${err.message.split('\n')[0]}`)
  }
}

check('node version', () => process.version)
check('architecture', () => process.arch)
check('folder', () => __dirname)
check('.env present', () => fs.existsSync(path.join(__dirname, '.env')))
check('node_modules present', () => fs.existsSync(path.join(__dirname, 'node_modules', 'express')))
check('public/index.html present', () => fs.existsSync(path.join(__dirname, 'public', 'index.html')))
check('uploads image count', () => fs.readdirSync(path.join(__dirname, 'uploads')).length)
check('uploads writable', () => {
  const probe = path.join(__dirname, 'uploads', '.write-test')
  fs.writeFileSync(probe, 'ok')
  fs.unlinkSync(probe)
  return true
})
check('load express', () => (require('express'), 'ok'))
check('load mysql2', () => (require('mysql2/promise'), 'ok'))
check('load sharp (image uploads)', () => (require('sharp'), 'ok'))
check('load app code', () => {
  // Loads the app modules without starting the server
  require('./src/db')
  require('./src/routes/catalog')
  return 'ok'
})

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(['Spice Soiree deployment check', '', ...checks].join('\n'))
  })
  .listen(process.env.PORT)
