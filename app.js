const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

app.engine('handlebars', exphbs({ defaultlayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({ secret: 'your secret key', resave: 'false', saveUninitialized: 'true' }))
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))

app.listen('3000', () => {
    console.log(`app is running on port 3000`)
})