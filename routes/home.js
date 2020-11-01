const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record

//總覽頁面
router.get('/', auth, (req, res) => {
    Record.findAll({ 
        where: { UserId: req.user.id },
        raw: true,
        nest: true
    })
    .then(records => {
        //日期由大到小排序
        records.sort((a, b) => {
            return b.date - a.date
        })

        //篩選收入或支出
        if (req.query.balance) {
            records = records.filter(records => {
                return records.balance === req.query.balance
            })
        }
        //篩選類別
        else if (req.query.category) {
            records = records.filter(records => {
                return records.category === req.query.category
            })
        }
        //篩選月份
        else if (req.query.month) {
            records = records.filter(records => {
                return records.date.getMonth() === req.query.month-1
            })
        }
        else {
            //篩選為這個月
            records = records.filter(records => {   
                return records.date.getMonth() === new Date().getMonth()
            })
        }
        
        let depositAmount = 0
        let deductAmount = 0

        records.forEach(records => {
            //日期格式
            records.date = records.date.toISOString().slice(0,10)
            //總額
            if (records.balance === 'deposit') {
                depositAmount += records.amount
            } 
            else {
                deductAmount += records.amount
            }
        })

        let totalAmount = depositAmount - deductAmount

        //月份
        let month = []
        for (i=1; i<=12 ; i++) {
            month.push(i)
        }
        
        return res.render('index', { records, depositAmount, deductAmount, totalAmount, month })

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