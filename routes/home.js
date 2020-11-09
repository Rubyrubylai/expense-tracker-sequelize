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

        let month = new Date().getMonth() + 1
        let Year = new Date().getFullYear()
        var monthYear = Year + '-' + month

        let { balance, category } = req.query
        
        
        //篩選收入或支出
        if (balance) {
            records = records.filter(records => {
                return records.balance === balance
            })
        }
        //篩選類別
        else if (category) {
            records = records.filter(records => {
                return records.category === category
            })
        }
        //篩選月份
        else if (req.query.monthYear) {
            monthYear = req.query.monthYear
            records = records.filter(records => {
                return Number(records.date.getMonth()+1) === Number(monthYear.slice(5,7))
            })
        }
        else {
            //預設為這個月
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
        
        return res.render('index', { records, depositAmount, deductAmount, totalAmount, monthYear })

    })
    .catch(err => console.error(err))   
})

module.exports = router