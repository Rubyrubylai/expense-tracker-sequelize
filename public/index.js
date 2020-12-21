//轉換收入及支出按鈕
var deposit = document.getElementById('deposit')
var deduct = document.getElementById('deduct')
var category = document.getElementById('category')
var selectedCategory = document.getElementById('selectedCategory').value

const ENUM = {
  '收入': {
    title: '收入',
    options: [ '薪水', '獎金', '紅利', '其他收入' ]
  },
  '支出': {
    title: '支出',
    options: [ '家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他支出' ]
  }
}

record(document.getElementById('balance'))

function record(type) {
  document.getElementById('balance').value = type.value
  displayFunction(ENUM[type.value])
}

function displayFunction(item) {
  if (item.title === '收入') {
    deposit.classList.remove('unchecked')
    deduct.classList.add('unchecked')
  }
  else if (item.title === '支出') {
    deduct.classList.remove('unchecked')
    deposit.classList.add('unchecked')
  }
  category.innerHTML= ''
  item.options.forEach(option => {
    category.innerHTML += `
      <option ${(selectedCategory ===  option) ? 'selected' : ''}>${option}</option>
    `
  })
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