const LocalStrategy = require('passport-local').Strategy

const db = require('../models')
const User = db.User

module.exports = passport => { 
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ where: { email: email } }).then(user => {
            if (!user) { return done(null, false) }
            if (user.password != password) { return done(null, false) }
            return done(null, user)

        })
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findByPk(id).then((user) => {
            user = user.get()
            done(null, user)
        })
    })
}