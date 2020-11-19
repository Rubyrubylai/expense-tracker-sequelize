const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const dateAfter = require('../config/date')

const db = require('../models')
const Record = db.Record

router.get('/', auth, (req, res) => {
  Record.findAll(
    { 
      raw: true,
      nest: true,
      where: { userId: req.user.id },
      order: ['category']
    }
  )
  .then(records => {
    var { monthYear, balance } = req.query

    let deduct
    let depositAmount = 0
    let deductAmount = 0

    //篩選月份
    if (monthYear) {
      records = records.filter(records => {
          return Number(records.date.getMonth()+1) === Number(monthYear.slice(5,7))
      })
    }
    else {
      //預設為目前年月份
      records = records.filter(records => {
        return Number(records.date.getMonth()) === Number(new Date().getMonth())
      })
      monthYear = dateAfter.monthYear(new Date())
    }

    //顯示收入和支出總額
    records.forEach((record, index) => {    
      if (record.balance === '收入') {
          depositAmount += record.amount
      } 
      else {
          deductAmount += record.amount
      }
    })


    //顯示收入或支出
    if (balance === '收入') {
      records = records.filter(record => record.balance === '收入')
      deduct = false
    } 
    else {
      records = records.filter(record => record.balance === '支出')
      deduct = true
    }

    //計算收入或支出總額，用來做百分比
    let totalAmount = 0
    records.forEach((record, i) => {
      totalAmount += Number(record.amount)  
    })

    //將相同分類的收入或支出合併
    let tempArr = []
    let endRecord = []
    for (let i=0; i<records.length; i++) {
      if (tempArr.indexOf(records[i].category) === -1) {
        endRecord.push({
          category: records[i].category,
          amount: records[i].amount,
          percentage: Math.round((records[i].amount/totalAmount)*100)
        })
        tempArr.push(records[i].category)
      }
      else {
        for (let j=0; j<endRecord.length; j++) {
          if (endRecord[j].category === records[i].category) {
            endRecord[j].amount += records[i].amount
            endRecord[j].percentage = Math.round((endRecord[j].amount/totalAmount)*100)
            break
          }
        }
      }
    }

    return res.render('pieChart', { deduct, endRecord, totalAmount, depositAmount, deductAmount, monthYear })
    
  })
})

module.exports = router