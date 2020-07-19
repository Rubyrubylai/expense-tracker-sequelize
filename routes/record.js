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
		var totalAmount = 0
		records.forEach(record => {
			totalAmount += record.amount
			return record.date = record.date.toISOString().slice(0,10)
		})
		let month =[]
		for (i=1; i<=12; i++){
			month.push(i+'月')
		}
		console.log(req.query.category)
		//if (req.body.category)
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
	Record.create({
		name,
		date,
		category,
		amount,
		UserId: req.user.id
	})
	.then(record => { return res.redirect('/') })
	.catch(err => console.error(err))

})

//修改支出頁面
router.get('/:id/edit', auth, (req, res) => {
	Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
	.then(record => { 
		return res.render('edit', { record: record.get() }) 
	})
	.catch(err => console.error(err))
})

//修改支出
router.put('/:id/edit', auth, (req, res) => {
	Record.findOne({ where: { id: req.params.id, UserId: req.user.id } })
	.then(record => {
		record.name = req.body.name
		record.date = req.body.date
		record.category = req.body.category
		record.amount = req.body.amount
		return record.save()
	})
	.then(record => { return res.redirect('/') })
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