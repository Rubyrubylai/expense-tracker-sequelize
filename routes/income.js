const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const User = db.User
const Income = db.Income

//瀏覽全部收入
router.get('/', auth, (req, res) => {
    Income.findAll({
        where: { UserId: req.user.id },
        raw: true,
        nest: true
    })
    .then(incomes => {
        //月份
        let month =[]
        for (i=1; i<=12; i++) {
            month.push(i)
        }

        //篩選月份
        if (req.query.month) {
            incomes = incomes.filter(income => {
                return income.date.getMonth()+1 === Number(req.query.month)
            })
        }

        //篩選類別
        if (req.query.category) {
            incomes = incomes.filter(income => {
                return income.category === req.query.category
            })
        }

        var totalAmount = 0
        incomes.forEach(income => {
            //總額
            totalAmount += income.amount
            //日期的形式
            return income.date = income.date.toISOString().slice(0,10) 
        })
        return res.render('income', { incomes, totalAmount, month }) 
    })
    .catch(err => console.error(err))
})

//進入新增收入的頁面
router.get('/new', auth, (req, res) => {
    res.render('newIncome')
})

//新增收入
router.post('/new', auth, (req, res) => {
    const { name, date, category, amount } = req.body
    if (!name || !date || !category || !amount) {
        let errors = []
        errors.push({ messages: '所有欄位皆為必填' })
        return res.render('newIncome', { name, date, category, amount, errors })
    }
    else {
        Income.create({
            name,
            date,
            category,
            amount,
            UserId: req.user.id
        })
        .then(income => { return res.redirect('/incomes') })
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