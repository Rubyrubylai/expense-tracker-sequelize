var deposit = document.getElementById('deposit')
var deduct = document.getElementById('deduct')
var category = document.getElementById('category')

deposit.addEventListener('click', switchToDeposit)

function switchToDeposit(e) {
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
  document.getElementById('balance').value = e.target.value
}

deduct.addEventListener('click', switchToDeduct)

function switchToDeduct(e) {
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
  document.getElementById('balance').value = e.target.value
}

var submit = document.getElementById('submit')
var date = document.getElementById('date')
var amount = document.getElementById('amount')
var billName = document.getElementById('billName')

submit.addEventListener('click', setType)

function setType(e) {
  if (!date.value || !amount.value || !billName.value) {
    if (document.getElementById('balance').value === '收入') {
      deposit.classList.remove('deposit-unchecked')
      deposit.classList.add('deposit-checked')
      deduct.classList.remove('deduct-checked')
      deduct.classList.add('deduct-unchecked')
    }
    else {
      deduct.classList.remove('deduct-unchecked')
      deduct.classList.add('deduct-checked')
      deposit.classList.remove('deposit-checked')
      deposit.classList.add('deposit-unchecked')
    }
    e.preventDefault()
  }
}
