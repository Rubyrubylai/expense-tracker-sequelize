const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record

router.get('/', auth, (req, res) => {
  Record.findAll(
    { 
      raw: true,
      nest: true,
      where: { userId: req.user.id } 
    }
  )
  .then(records => {
    console.log(records)
    return res.render('pieChart', { records })
  })
})

module.exports = router