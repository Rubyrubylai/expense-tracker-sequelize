const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/records')
})

module.exports = router