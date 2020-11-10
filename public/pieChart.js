const category = [
  '薪水',
  '獎金',
  '紅利',
  '其他收入',
  '家居物業',
  '交通出行',
  '休閒娛樂',
  '餐飲食品',
  '其他支出'
]

const amounts = [0, 0, 0, 0, 0, 0, 0, 0, 0]

var records = document.getElementById('records').children
for (let i = 0; i < records.length; i++) {
  const index = category.indexOf(records[i].querySelector('.category').innerHTML)
  amounts[index] += Number(records[i].querySelector('.amount').innerHTML)
}

var ctx = document.getElementById('myChart').getContext('2d')
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: category,
    datasets: [{
      data: amounts,
      backgroundColor: [
        '#E000E0',
        '#26FFFF',
        '#CCCCFF',
        '#1C1CFF',
        '#FF8282',
        '#FFD78C',
        '#FFFFB5',
        '#FFFF26',
        '#26FF26'
      ],
    }]
  },
  options: {
    legend:{
      display:false
    },   
  }
})

