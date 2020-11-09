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
    monthYear = dateAfter.monthYear(new Date())
  }

  records.forEach((record, index) => {    
    //總額
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

  //將相同分類的收入或支出合併
  let totalAmount = 0
  records.forEach((record, i) => {
    totalAmount += Number(record.amount)  
    if (i > 1) {
      if (record.category === records[i-1].category) {
        records[i-1].amount += record.amount
        records.splice(i, 1)
      }
    }   
  })
  records = records.map(record => ({
    ...record,
    percentage: Math.round((record.amount/totalAmount)*100)
  }))

  return res.render('pieChart', { deposit, deduct, records, totalAmount, depositAmount, deductAmount, monthYear })
}

module.exports = router