require("dotenv").config();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrpyt = require('bcryptjs')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
const SECRET = process.env.SECRET

var db = require('knex')({
    client: 'pg',
    connection: {
      host : HOST,
      user : USER,
      password : PASSWORD,
      database : DATABASE
    }
});

let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: SECRET
}

let jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

    //payload has object with keys of 'sub' and ''
    db('users').where({id: payload.sub})
        .then(foundUser => {

            // if user is found
            if(foundUser){
                done(null, foundUser)
            }
            // incorrect token
            else {
                done(null, false)
            }
        })
        // Database error
        .catch(err => {
            return done(err, false)
        })
}) 


let options = {usernameField: 'email'};

let localLogin = new LocalStrategy(options, (email, password, done) => {

    // check to see if email exists in database

    db('users').where({email: email})
        .then(results => {
            // check to see if there in an email, return error if not

            if (results != null){
                //compare passwords
                let user = results[0]

                bcrpyt.compare(password, user.password, (err, isMatch) => {
                    if(err) {
                        //error in compare function
                        return done(err)
                    }
                    if (!isMatch) {
                        // password does not match
                        return done(null, false)
                    }
                    // pass back user object
                    return done(null, true)
                })
            }
            else {
                //no email was found, send error
            }
        })
        // database error
        .catch(err => {
            return done(err)
        })

}) 


passport.use(localLogin)
passport.use(jwtLogin)