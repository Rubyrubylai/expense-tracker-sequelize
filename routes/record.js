const express = require('express')
const router = express.Router()
const auth = require('../config/auth')
const dateAfter = require('../config/date')
const db = require('../models')
const Record = db.Record

//新增頁面
router.get('/new', auth, (req, res) => {
	let deduct = true
	res.render('new', { deduct })
})


//新增
router.post('/new', auth, (req, res) => {
	console.log(req.query)
	let deposit
	let deduct
	if (req.query === 'deposit') {
		deposit = true
		deduct = false
	}
	else {
		deposit = false
		deduct = true
	}
	add(req, res, deposit, deduct)
})

function add(req, res, deposit, deduct) {
	console.log(req.body.balance)
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
		.then(record => {
			monthYear = dateAfter.monthYear(record.date)
			return res.redirect(`/?monthYear=${monthYear}`) 
		})
		.catch(err => console.error(err))
	}	
}

//修改頁面
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
		let deposit = false
		let deduct = true
		editPage(record, res, deposit, deduct)
	})
	.catch(err => console.error(err))
})

function editPage(record, res, deposit, deduct) {
	const date = record.date.toISOString().slice(0,10)
	const { name, category, amount, id } = record.get()
	return res.render('edit', { deposit, deduct, record, name, category, amount, id, date }) 
}

//修改
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
			monthYear = dateAfter.monthYear(record.date)
			return res.redirect(`/?monthYear=${monthYear}`) 
		}
}


//刪除支出
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