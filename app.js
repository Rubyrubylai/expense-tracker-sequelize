const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const handlebars = require('handlebars')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

app.engine('handlebars', exphbs({ defaultlayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({ secret: 'your secret key', resave: 'false', saveUninitialized: 'true' }))
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

handlebars.registerHelper('ifEquals', (a, b ,options) => {
    if (a==b) {
        return options.fn(this)
    }
    else {
        return options.inverse(this)
    }
})

app.use(methodOverride('_method'))

app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.isAuthenticated = req.isAuthenticated
    next()
})

app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auth'))

app.listen('3000', () => {
    console.log(`app is running on port 3000`)
})