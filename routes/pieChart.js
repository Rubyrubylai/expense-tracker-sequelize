const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const dateAfter = require('../config/date')

const db = require('../models')
const Record = db.Record

router.get('/deduct', auth, (req, res) => {
  Record.findAll(
    { 
      raw: true,
      nest: true,
      where: { userId: req.user.id },
      order: ['category']
    }
  )
  .then(records => {
    let deposit = false
    let deduct = true

    show(deposit, deduct, records, req, res)
  })
})

router.get('/deposit', auth, (req, res) => {
  Record.findAll(
    { 
      raw: true,
      nest: true,
      where: { userId: req.user.id },
      order: ['category']
    }
  )
  .then(records => {
    let deposit = true
    let deduct = false

    show(deposit, deduct, records, req, res)
  })
})

function show(deposit, deduct, records, req, res) {
  let depositAmount = 0
  let deductAmount = 0

  //篩選月份
  var { monthYear } = req.query
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
    if (record.balance === 'deposit') {
        depositAmount += record.amount
    } 
    else {
        deductAmount += record.amount
    }
  })

  //顯示收入或支出
  if (deposit === true) {
    records = records.filter(record => record.balance === 'deposit')
  } 
  if (deduct === true) {
    records = records.filter(record => record.balance === 'deduct')
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
          endRecord[j].percentage += Math.round((records[i].amount/totalAmount)*100)
          break
        }
      }
    }
  }

  return res.render('pieChart', { deposit, deduct, endRecord, totalAmount, depositAmount, deductAmount, monthYear })
}

module.exports = router