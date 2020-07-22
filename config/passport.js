const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcrypt')

const db = require('../models')
const User = db.User

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ where: { email: email } }).then(user => {
            if (!user) { return done(null, false) }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    return done(null, user)
                }
                return done(null, false)
            })
        })
    }))
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
       User.findOne({ where: { email: profile._json.email } }).then(user => {
            if (!user) {
                var password = Math.random().toString(36).slice(2,10)
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        User.create({
                            email: profile._json.email,
                            name: profile._json.name,
                            password: hash
                       })
                       .then(user => { return done(null, user) })
                       .catch(err => console.error(err))
                    })
                })    
            } else {
                return done(null, user)
            }           
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