const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const User = db.User
const Income = db.Income

//進入新增收入的頁面
router.get('/new', auth, (req, res) => {
    let income = true
    res.render('new', { income })
})

//新增收入
router.post('/new', auth, (req, res) => {
    const { name, date, category, amount } = req.body
    let income = true
    if (!name || !date || !category || !amount) {
        let errors = []
        errors.push({ messages: '所有欄位皆為必填' })
        return res.render('new', { income, name, date, category, amount, errors })
    }
    else {
        Income.create({
            name,
            date,
            category,
            amount,
            UserId: req.user.id
        })
        .then(income => { return res.redirect('/') })
        .catch(err => console.error(err))
    }
})

//進入編輯收入的頁面
router.get('/:id/edit', auth, (req, res) => {
    Income.findOne({ where: { UserId: req.user.id, id: req.params.id } })
    .then(income => {
        const date = income.date.toISOString().slice(0,10)
        const { name, category, amount, id } = income.get()
        return res.render('edit', { income, name, category, amount, id, date })
    })
    .catch(err => console.error(err))
})

//編輯收入
router.put('/:id/edit', auth, (req, res) => {
    Income.findOne({ where: { UserId: req.user.id, id: req.params.id } })
    .then(income => {
        const { name, date, category, amount } = req.body
        const { id } = req.params
        if (!name || !date || !category || !amount) {
            let errors = []
            errors.push({ messages: '所有欄位皆為必填' })
            return res.render('edit', { income, name, category, amount, id , date, errors })
        }
        else {
            income.name = name
            income.date = date
            income.category = category
            income.amount = amount
            income.save()
            return res.redirect('/')
        }  
    })
    .catch(err => console.error(err))
})

//刪除收入
router.delete('/:id/delete', auth, (req, res) => {
    Income.destroy({ where: { UserId: req.user.id, id: req.params.id } })
    .then(income => { return res.redirect('/') })
    .catch(err => console.error(err))
})

module.exports = router