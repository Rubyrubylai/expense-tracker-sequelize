const express = require('express')
const exphbs = require('express-handlebars')
const app = express()


app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))

app.listen('3000', () => {
    console.log(`app is running on port 3000`)
})