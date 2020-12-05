//轉換收入及支出按鈕
var deposit = document.getElementById('deposit')
var deduct = document.getElementById('deduct')
var category = document.getElementById('category')

function record(obj) {
  console.log($(obj).val())
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
  <option {{#ifEquals category "薪水"}} selected {{/ifEquals}}>薪水</option>
  <option {{#ifEquals category "獎金"}} selected {{/ifEquals}}>獎金</option>
  <option {{#ifEquals category "紅利"}} selected {{/ifEquals}}>紅利</option>
  <option {{#ifEquals category "其他收入"}} selected {{/ifEquals}}>其他收入</option>
  `
}

function deductF() {
  deduct.classList.remove('deduct-unchecked')
  deduct.classList.add('deduct-checked')
  deposit.classList.remove('deposit-checked')
  deposit.classList.add('deposit-unchecked')
  category.innerHTML = `
  <option {{#ifEquals category '家居物業'}} selected {{/ifEquals}}>家居物業</option>
  <option {{#ifEquals category '交通出行'}} selected {{/ifEquals}}>交通出行</option>
  <option {{#ifEquals category '休閒娛樂'}} selected {{/ifEquals}}>休閒娛樂</option>
  <option {{#ifEquals category '餐飲食品'}} selected {{/ifEquals}}>餐飲食品</option>
  <option {{#ifEquals category '其他支出'}} selected {{/ifEquals}}>其他支出</option>
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