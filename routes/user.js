const express = require('express')
const router = express.Router()

const db = require('../models')
const Record = db.Record
const User = db.User

//登入頁面
router.get('/login', (req, res) => {
    return res.render('login')
})

//登入
router.post('/login', (req, res) => {
    
})

//註冊頁面
router.get('/register', (req, res) => {
    return res.render('register')
})

//註冊
router.post('/login', (req, res) => {

})

//登出頁面
router.get('/logout', (req, res) => {
    return res.redirect('/')
})

module.exports = router