import express from 'express'
import payload from 'payload'

require('dotenv').config()
const app = express()

// Initialize Payload
payload.init({
  secret: process.env.PAYLOAD_SECRET,
  mongoURL: process.env.MONGODB_URI,
  express: app,
  onInit: () => {
    payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
  },
})

if (process.argv[2] === 'import') {
  const {importFromFirestore} = require('./import')

  importFromFirestore()
    .then(() => process.exit())
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
} else {
  // Redirect root to Admin panel
  app.get('/', (_, res) => {
    res.redirect('/admin')
  })

  app.listen(3000)
}



