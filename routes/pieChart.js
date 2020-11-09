const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record

function show(records) {
  let totalAmount = 0

    //將相同分類的收入或支出合併
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
  console.log(records)
}

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
    let deduct = true
    records = records.filter(record => record.balance === 'deduct')
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
    console.log(records)
    
    return res.render('pieChart', { records, deduct })
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
    records = records.filter(record => record.balance === 'deposit')
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
    console.log(records)

    return res.render('pieChart', { records, deposit })
  })
})

module.exports = router