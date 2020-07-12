const express = require('express')
const router = express.Router()

const db = require('../models')
const Record = require('../models/record')
const User = require('../models/user')

//瀏覽全部支出
router.get('/', (req, res) => {
    res.render('index')
})

//新增支出頁面
router.get('/new', (req, res) => {
    res.render('new')
})

//新增支出
router.post('/new', (req, res) => {
    res.send('hello')
})

//修改支出頁面
router.get('/:id/edit', (req, res) => {
    res.render('edit')
})

//修改支出
router.get('/:id/edit', (req, res) => {
    res.render('edit')
})

//刪除支出
router.get('/:id/delete', (req, res) => {
    res.send('hello')
})

module.exports = router