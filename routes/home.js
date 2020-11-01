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

        records.forEach((record, index) => {
            //日期格式
            let currentYear = record.date.getFullYear()
            let currentMonth = record.date.getMonth() + 1
            let currentDate = record.date.getDate()
            record.date = currentYear + '/' + currentMonth + '/' + currentDate
            //總額
            if (record.balance === 'deposit') {
                depositAmount += record.amount
            } 
            else {
                deductAmount += record.amount
            }
            //如果日期相同則省略
            if (index >= 1) {
                if (record.date === records[index-1].date) {
                    record.date = ''
                }
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

module.exports = router