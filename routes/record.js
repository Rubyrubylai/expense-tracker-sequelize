const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const dateAfter = require('../config/date')
const db = require('../models')
const Record = db.Record

//新增頁面
router.get('/new', auth, (req, res) => {
	res.render('new')
})

//新增
router.post('/new', auth, (req, res) => {
	const { name, date, category, amount, balance } = req.body
	if (!name || !date || !category || !amount) {
		let errors = []
		errors.push({ messages: '所有欄位皆為必填' })
		return res.render('new', { name, date, category, amount, balance, errors })
	} 
	else {
		Record.create({
			name,
			date,
			category,
			amount,
			balance,
			UserId: req.user.id
		})
		.then(record => {
			monthYear = dateAfter.monthYear(record.date)
			return res.redirect(`/?monthYear=${monthYear}`) 
		})
		.catch(err => console.error(err))
	}	

})

//修改頁面
router.get('/:id/edit', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		const date = record.date.toISOString().slice(0,10)
		const { name, category, amount, id, balance } = record.get()
		return res.render('edit', { name, category, amount, id, balance, date }) 
	})
	.catch(err => console.error(err))
})

//修改
router.put('/:id/edit', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		const { name, date, category, amount, balance } = req.body
		const { id } = req.params
		if (!name || !date || !category || !amount) {
			let errors = []
			errors.push({ messages: '所有欄位皆為必填' })
			return res.render('edit', { record, id, name, category, amount, date, errors })
		} 
		else {
			record.name = name
			record.date = date
			record.category = category
			record.amount = amount
			record.balance = balance
			record.save()
			monthYear = dateAfter.monthYear(record.date)
			return res.redirect(`/?monthYear=${monthYear}`) 
		}
	})
	.catch(err => console.error(err))
})

//刪除
router.delete('/:id/delete', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		monthYear = dateAfter.monthYear(record.date)
		record.destroy()
		return res.redirect(`/?monthYear=${monthYear}`) 
	})
	.catch(err => console.error(err))
})

module.exports = router