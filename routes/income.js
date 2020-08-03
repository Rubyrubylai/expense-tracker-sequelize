const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

router.get('/', auth, (req, res) => {
    res.render('income')
})

router.get('/new', (req, res) => {
    res.render('new')

})
module.exports = router