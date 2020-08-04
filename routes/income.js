const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const User = db.User
const Income = db.Income

//瀏覽全部收入
router.get('/', auth, (req, res) => {
    Income.findAll({
        where: {  UserId: req.user.id },
        raw: true,
        nest: true
    })
    .then(incomes => {
        incomes.forEach(income => {
          return income.date = income.date.toISOString().slice(0,10) 
        })
        return res.render('income', { incomes }) 
    })
    .catch(err => console.error(err))
})

//進入新增收入的頁面
router.get('/new', (req, res) => {
    res.render('newIncome')
})

//新增收入
router.post('/new', (req, res) => {
    const { name, date, category, amount } = req.body
    Income.create({
        name,
        date,
        category,
        amount,
        UserId: req.user.id
    })
    .then(income => { return res.redirect('/incomes') })
    .catch(err => console.error(err))
})

//進入編輯收入的頁面
router.get('/:id/edit', (req, res) => {

})

//編輯收入
router.put('/:id/edit', (req, res) => {
    
})

//刪除收入
router.delete('/:id/delete', (req, res) => {
    Income.destroy({ 
        where: {
            UserId: req.user.id,
            id: req.params.id
        } 
    })
    .then(income => { return res.redirect('/incomes') })
    .catch(err => console.error(err))
})

module.exports = router