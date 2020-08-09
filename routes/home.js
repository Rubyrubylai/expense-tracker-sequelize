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
        //一開始設定record為true
        let record = true
        //篩選類別
        //當點選收入時，將record的部分設為false去隱藏
        if (req.query.income) {
            record = false
        }
        else if (req.query.category) {
            incomes = incomes.filter(income => {
                return income.category === req.query.category
            })
        }
        //篩選月份
        else if (req.query.month) {
            incomes = incomes.filter(income => {
                return income.date.getMonth() === req.query.month-1
            })
        }
        else {
            //篩選為今天日期
            incomes = incomes.filter(income => {   
                return income.date.toLocaleDateString() === new Date().toLocaleDateString('zh-TW', {timeZone: 'Asia/Taipei'})
            })
        }

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
            let income = true
            //篩選類別
            if (req.query.record) {
                income = false
            }
            else if (req.query.category) {
                records = records.filter(record => {
                    return record.category === req.query.category
                })
            }
            //篩選月份
            else if (req.query.month) {
                records = records.filter(record => {
                    return record.date.getMonth() === req.query.month-1
                })
            }
            else {
                //篩選為今天日期
                records = records.filter(record => {
                    return record.date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
                })
            }

            records.forEach(record => {
                record.date = record.date.toISOString().slice(0,10)
                expenseAmount += record.amount
            })

            //月份
            let month = []
            for (i=1; i<=12 ; i++) {
                month.push(i)
            }

            //總金額
            let totalAmount = incomeAmount - expenseAmount
            
            return res.render('index', { income, record, records, incomes, incomeAmount, expenseAmount, totalAmount, month })
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