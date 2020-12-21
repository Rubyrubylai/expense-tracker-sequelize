module.exports = (app) => {
  app.use('/', require('./home'))
  app.use('/records', require('./record'))
  app.use('/users', require('./user'))
  app.use('/auth', require('./auth'))
  app.use('/pieChart', require('./pieChart'))
}