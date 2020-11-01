const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record

router.get('/', auth, (req, res) => {
  Record.findAll(
    { where: { userId: req.user.id } }
  )
  .then(records => {
    return res.render('statistic', { records })
  })
})

module.exports = router