const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcrypt')

const db = require('../models')
const Record = db.Record
const User = db.User

//登入頁面
router.get('/login', (req, res) => {
    return res.render('login')
})

//登入
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login'
    })(req, res, next)
})

//註冊頁面
router.get('/register', (req, res) => {
    return res.render('register')
})

//註冊
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err
            User.create({
                name,
                email,
                password: hash
            })
            .then(user => { return res.redirect('/users/login') })
            .catch(err => console.error(err))
        })
    })
    
})

//登出頁面
router.get('/logout', (req, res) => {
    req.logout()
    return res.redirect('/')
})

module.exports = router