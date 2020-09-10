require("dotenv").config();
let express = require('express');
let router = express.Router();

const jwt = require('jwt-simple')

const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
const SECRET = process.env.SECRET

var db = require('knex')({
    client: 'pg',
    connection: {
      host : HOST,
      user : "eevaxebn",
      password : PASSWORD,
      database : DATABASE
    }
});

let bodyParser = require('body-parser')
const bcrpyt = require('bcryptjs')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

let passport = require('passport')

let passportService = require('../config/passAuth.js')

let requireSignin = passport.authenticate('local', {session: false})

let requireAuth = passport.authenticate('jwt', {session: false})

let token = (userInfo) => {

    let timeStamp = new Date().getTime();

    return jwt.encode({sub: userInfo.id, iat: timeStamp}, SECRET, "HS256")
}

router.get('/', requireAuth, (req, res) => {

    res.send('Hello, You are logged-in')
})

router.post('/signin', requireSignin, (req, res) => {
    // need to handle bcrypt error, password !match, password success, database error


    // Success case
    res.json({token: token(req.user)})
})

router.post('/signup', (req, res) => {

    let email = req.body.email;

    let user_Name = req.body.userName
    
    // hash and salt
    let password = bcrpyt.hashSync(req.body.password, 8);

    db('users').where({email: email})
        .then(results => {
            if(results.length === 0){
                // no duplicates found
                db('users').insert({user_Name, email, password}).returning('*')
                    .then(user => {
                          
                        //on success, return json web token
                        return res.json({token: token(user)})

                    })
                    .catch(err => {
                        res.status(423).send({error: 'Failed to add to database'})
                    })
            }
            else {
                //duplicates have been found

                return res.status(422).send({error: 'Email already exists'})
            }
        })
})

module.exports = router;