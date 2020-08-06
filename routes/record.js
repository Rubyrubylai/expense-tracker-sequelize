const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record
const User = db.User

//瀏覽全部支出
router.get('/', auth, (req, res) => {
	Record.findAll({ 
		where: { UserId: req.user.id },
		raw: true,
		nest: true
	 })
	.then(records => {
		//篩選月份
		if (req.query.month) {
			records = records.filter(record => { 
				return record.date.getMonth() === req.query.month-1 
			})		
		}
		//篩選類別
		if (req.query.category) {
			records = records.filter(record => { 
				return record.category === req.query.category 
			})			
		}
		//總金額
		var totalAmount = 0
		records.forEach(record => {
			totalAmount += record.amount
			return record.date = record.date.toISOString().slice(0,10)
		})
		//月份
		let month =[]
		for (i=1; i<=12; i++){
			month.push(i)
		}

		return res.render('index', { records: records, totalAmount: totalAmount, month: month })
	})
	.catch(err => console.error(err))
})

//新增支出頁面
router.get('/new', auth, (req, res) => {
	res.render('new')
})

//新增支出
router.post('/new', auth, (req, res) => {
	const { name, date, category, amount } = req.body
	if (!name || !date || !category || !amount) {
		let errors = []
		errors.push({ messages: '所有欄位皆為必填' })
		return res.render('new', { name, date, category, amount, errors })
	} 
	else {
		Record.create({
			name,
			date,
			category,
			amount,
			UserId: req.user.id
		})
		.then(record => { return res.redirect('/') })
		.catch(err => console.error(err))
	}	
})

//修改支出頁面
router.get('/:id/edit', auth, (req, res) => {
	Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
	.then(record => { 
		const date = record.date.toISOString().slice(0,10)
		return res.render('edit', { record: record.get(), date }) 
	})
	.catch(err => console.error(err))
})

//修改支出
router.put('/:id/edit', auth, (req, res) => {
	Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
	.then(record => {
		const { name, date, category, amount } = req.body
		const { id } = req.params
		if (!name || !date || !category || !amount) {
			let errors = []
			errors.push({ messages: '所有欄位皆為必填' })
			return res.render('edit', { record: { id, name, category, amount }, date, errors })
		} else {
				record.name = name
				record.date = date
				record.category = category
				record.amount = amount
				record.save()
				return res.redirect('/')
			}
	})
	.catch(err => console.error(err))
})

//刪除支出
router.delete('/:id/delete', auth, (req, res) => {
	Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
	.then(record => {
		record.destroy()
	})
	.then(record => { return res.redirect('/') })
	.catch(err => console.error(err))
})

module.exports = router