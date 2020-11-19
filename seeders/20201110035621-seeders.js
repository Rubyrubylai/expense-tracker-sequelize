'use strict';
const bcrypt = require('bcrypt')
const faker = require('faker')
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
const balance = ['deposit', 'deduct']

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'Amy',
      email: 'amy@example.com',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      name: 'Nick',
      email: 'nick@example.com',
      password: bcrypt.hashSync('a123456', bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})

    queryInterface.bulkInsert('Records',
      Array.from({length: 25}).map(d => 
        ({
          name: faker.lorem.word(),
          amount: Math.floor(Math.random()*10000)+1,
          category: category[Math.floor(Math.random()*4)],
          date: faker.date.between(faker.date.past(), faker.date.recent()),
          balance: '收入',
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: Math.ceil(Math.random()*2),
        })
      ), {}
    )

    return queryInterface.bulkInsert('Records',
      Array.from({length: 25}).map(d => 
        ({
          name: faker.lorem.word(),
          amount: Math.floor(Math.random()*10000)+1,
          category: category[Math.floor(Math.random()*5+4)],
          date: faker.date.between(faker.date.past(), faker.date.recent()),
          balance: '支出',
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: Math.ceil(Math.random()*2),
        })
      ), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    return queryInterface.bulkDelete('Records', null, {})
  }
};
