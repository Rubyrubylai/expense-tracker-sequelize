const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record
const User = db.User

//新增支出頁面
router.get('/new', auth, (req, res) => {
	let record = true
	res.render('new', { record })
})

//新增支出
router.post('/new', auth, (req, res) => {
	const { name, date, category, amount } = req.body
	let record = true
	if (!name || !date || !category || !amount) {
		let errors = []
		errors.push({ messages: '所有欄位皆為必填' })
		return res.render('new', { record, name, date, category, amount, errors })
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
		const { name, category, amount, id } = record.get()
		return res.render('edit', { record, name, category, amount , id, date }) 
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
			return res.render('edit', { record, id, name, category, amount, date, errors })
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