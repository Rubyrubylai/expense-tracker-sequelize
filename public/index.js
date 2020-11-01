var deduct = document.getElementById('deduct-btn')


deduct.addEventListener('click', e => {
  var category = document.getElementById('category')
  category.appendChild(document.createElement('option')).innerHTML = `
  <option {{#ifEquals category '家居物業'}} selected {{/ifEquals}}>家居物業</option>
  <option {{#ifEquals category '交通出行'}} selected {{/ifEquals}}>交通出行</option>
  <option {{#ifEquals category '休閒娛樂'}} selected {{/ifEquals}}>休閒娛樂</option>
  <option {{#ifEquals category '餐飲食品'}} selected {{/ifEquals}}>餐飲食品</option>
  <option {{#ifEquals category '其他'}} selected {{/ifEquals}}>其他</option>
  `
  console.log(e.target.value)

})