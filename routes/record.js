const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const db = require('../models')
const Record = db.Record

//新增頁面
router.get('/newDeposit', auth, (req, res) => {
	let deposit = true
	res.render('new', { deposit })
})

router.get('/newDeduct', auth, (req, res) => {
	let deduct = true
	res.render('new', { deduct })
})

//新增
function add(req, res, deposit, deduct) {
	const { name, date, category, amount, balance } = req.body
	if (!name || !date || !category || !amount) {
		let errors = []
		errors.push({ messages: '所有欄位皆為必填' })
		return res.render('new', { deposit, deduct, name, date, category, amount, balance, errors })
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
		.then(record => { return res.redirect('/') })
		.catch(err => console.error(err))
	}	
}

router.post('/newDeposit', auth, (req, res) => {
	let deposit = true
	let deduct = false
	add(req, res, deposit, deduct)
})

router.post('/newDeduct', auth, (req, res) => {
	let deposit = false
	let deduct = true
	add(req, res, deposit, deduct)
})

//修改頁面
function editPage(record, res, deposit, deduct) {
	const date = record.date.toISOString().slice(0,10)
	const { name, category, amount, id } = record.get()
	return res.render('edit', { deposit, deduct, record, name, category, amount, id, date }) 
}

router.get('/:id/editDeposit', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		let deposit = true
		let deduct = false
		editPage(record, res, deposit, deduct)
	})
	.catch(err => console.error(err))
})

router.get('/:id/editDeduct', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		let deduct = true
		let deposit = false
		editPage(record, res, deposit, deduct)
	})
	.catch(err => console.error(err))
})

//修改
function edit(record, req, res, deposit, deduct) {
	const { name, date, category, amount, balance } = req.body
		const { id } = req.params
		if (!name || !date || !category || !amount) {
			let errors = []
			errors.push({ messages: '所有欄位皆為必填' })
			return res.render('edit', { deposit, deduct, record, id, name, category, amount, date, errors })
		} 
		else {
			record.name = name
			record.date = date
			record.category = category
			record.amount = amount
			record.balance = balance
			record.save()
			return res.redirect('/')
		}
}

router.put('/:id/editDeposit', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		let deposit = true
		let deduct = false
		edit(record, req, res, deposit, deduct)
	})
	.catch(err => console.error(err))
})

router.put('/:id/editDeduct', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		let deposit = false
		let deduct = true
		edit(record, req, res, deposit, deduct)
	})
	.catch(err => console.error(err))
})

//刪除支出
router.delete('/:id/delete', auth, (req, res) => {
	Record.findOne({ 
		where: { id: req.params.id, UserId: req.user.id } 
	})
	.then(record => {
		record.destroy()
	})
	.then(record => { return res.redirect('/') })
	.catch(err => console.error(err))
})

module.exports = router