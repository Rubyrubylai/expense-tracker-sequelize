//轉換收入及支出按鈕
var deposit = document.getElementById('deposit')
var deduct = document.getElementById('deduct')
var category = document.getElementById('category')
var selectedCategory = document.getElementById("selectedCategory").value
const h = (selectedCategory ===  "家居物業") ? 'selected' : ''
const t = (selectedCategory ===  "交通出行") ? 'selected' : ''
const l = (selectedCategory ===  "休閒娛樂") ? 'selected' : ''
const r = (selectedCategory ===  "餐飲食品") ? 'selected' : ''
const e = (selectedCategory ===  "其他支出") ? 'selected' : ''
const s = (selectedCategory ===  "薪水") ? 'selected' : ''
const b = (selectedCategory ===  "獎金") ? 'selected' : ''
const d = (selectedCategory ===  "紅利") ? 'selected' : ''
const i = (selectedCategory ===  "其他收入") ? 'selected' : ''

function record(obj) {
  if ($(obj).val() === '收入') {
    depositF()
    document.getElementById('balance').value = $(obj).val()
  }
  else {
    deductF()
    document.getElementById('balance').value = $(obj).val()
  }
}

//進到頁面時，顯示收入或支出
if (document.getElementById('balance').value === '收入') {
  depositF()
}
else {
  deductF()
}

function depositF() {
  deposit.classList.remove('deposit-unchecked')
  deposit.classList.add('deposit-checked')
  deduct.classList.remove('deduct-checked')
  deduct.classList.add('deduct-unchecked')
  category.innerHTML = `
  <option ${s}>薪水</option>
  <option ${b}>獎金</option>
  <option ${d}>紅利</option>
  <option ${i}>其他收入</option>
  `
}

function deductF() {
  deduct.classList.remove('deduct-unchecked')
  deduct.classList.add('deduct-checked')
  deposit.classList.remove('deposit-checked')
  deposit.classList.add('deposit-unchecked')
  category.innerHTML = `
  <option ${h}>家居物業</option>
  <option ${t}>交通出行</option>
  <option ${l}>休閒娛樂</option>
  <option ${r}>餐飲食品</option>
  <option ${e}>其他支出</option>
  `
}

//若表單沒有填寫完整，預防進到下一頁
var submit = document.getElementById('submit')
var date = document.getElementById('date')
var amount = document.getElementById('amount')
var billName = document.getElementById('billName')

submit.addEventListener('click', setType)

function setType(e) {
  if (!date.value || !amount.value || !billName.value) {
    e.preventDefault()
  }
}