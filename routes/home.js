const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record
const Income = db.Income

//總覽頁面
router.get('/', auth, (req, res) => {
    Income.findAll({ 
        where: { UserId: req.user.id },
        raw: true,
        nest: true
    })
    .then(incomes => {
        let incomeAmount = 0
       
        //篩選為今天日期
        incomes = incomes.filter(income => {
            return income.date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
        })

        incomes.forEach(income => {
            //日期格式
            income.date = income.date.toISOString().slice(0,10)
            //總額
            incomeAmount += income.amount
        })

        Record.findAll({ 
            where: { UserId: req.user.id },
            raw: true,
            nest: true
        })
        .then(records => {
            let expenseAmount = 0

             //篩選為今天日期
             records = records.filter(record => {
                return record.date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
            })

            records.forEach(record => {
                record.date = record.date.toISOString().slice(0,10)
                expenseAmount += record.amount
            })

            let totalAmount = incomeAmount - expenseAmount
            
            return res.render('index', { records, incomes, incomeAmount, expenseAmount, totalAmount })
        })
    })
    .catch(err => console.error(err))   
})

//進入新增收入或支出的頁面
// router.get('/new', (req, res) => {
//     res.render('new')
// })


// 進入編輯頁面(若資料庫分類收入和支出)
// router.get('/:id/edit', (req, res) => {
//     if (req.query.edit === 'expense') { 
//         Record.findOne({ where: { UserId: req.user.id, id: req.params.id }}).then(record => {
//             date = record.date.toISOString().slice(0, 10)
//             return res.render('edit', { record: record.get(), date})
//         })
        
//     }
//     if (req.query.edit === 'income') { return res.render('editIncome') }
// })


module.exports = router