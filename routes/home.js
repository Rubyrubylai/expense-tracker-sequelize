const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const dateAfter = require('../config/date')

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

        let { balance, category, monthYear } = req.query        
        
        //篩選收入或支出
        if (balance) {
            records = records.filter(records => {
                return records.balance === balance
            })
            records = records.filter(records => {
                return Number(records.date.getMonth()+1) === Number(monthYear.slice(5,7))
            })
        }
        //篩選類別
        else if (category) {
            records = records.filter(records => {
                return records.category === category
            })
            records = records.filter(records => {
                return Number(records.date.getMonth()+1) === Number(monthYear.slice(5,7))
            })
        }
        //篩選月份
        else if (monthYear) {
            records = records.filter(records => {
                return Number(records.date.getMonth()+1) === Number(monthYear.slice(5,7))
            })
        }
        //預設為這個月
        else {
            monthYear = dateAfter.monthYear(new Date())
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
        })

        let endRecord = {}
        records.forEach(record => { 
            if(endRecord[record.date]) {
                endRecord[record.date].push({
                    name: record.name,
                    amount: record.amount,
                    category: record.category,
                    balance: record.balance,
                    id: record.id
                })
            } else {
                endRecord[record.date] = [{
                    name: record.name,
                    amount: record.amount,
                    category: record.category,
                    balance: record.balance,
                    id: record.id
                }]
            }
        })

        let totalAmount = depositAmount - deductAmount
        
        return res.render('index', { endRecord, depositAmount, deductAmount, totalAmount, monthYear, balance })

    })
    .catch(err => console.error(err))   
})

module.exports = router