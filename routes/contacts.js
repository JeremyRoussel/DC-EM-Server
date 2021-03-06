require("dotenv").config();
let express = require('express');
let router = express.Router();

const jwt = require('jwt-simple')

var db = require('../db')

let bodyParser = require('body-parser')
// const bcrpyt = require('bcryptjs')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

let passport = require('passport')

require('../config/passAuth.js')

let requireAuth = passport.authenticate('jwt', {session: false})
// let requireSignin = passport.authenticate('local', {session: false})

router.get('/contacts', requireAuth, (req, res) => {

    let userID = req.user.id
    console.log(`Contacts - Get request, logged-in as: ${req.user.email}`)
    
    db('contacts').where({user_id: userID}).returning('*')
        .then(contacts => {

            console.log(contacts)
            res.json(contacts)
        })
        .catch(err => {

            res.status(433).send({error: 'Failed to locate records'})
        })
})

router.post('/contacts', requireAuth, (req, res) => {

    console.log(`Made it past requireAuth`)
    console.log(`req.foundUser:`, req.user)

    // Object.keys(req).forEach(key => {
    //     console.log(key)
    // });

    let user_id = req.user.id
    // console.log(`Contacts - Post request, logged-in as: ${req.user.email}`)
    
    // insert
    // let {email, group, hobbies, first_Name, last_Name, phone} = {...req.body.contact}

    let email = req.body.email
    let group = req.body.group
    let hobbies = req.body.hobbies
    let first_Name = req.body.first_Name
    let last_Name = req.body.last_Name
    let phone = req.body.phone

    db('contacts').insert({user_id, email, group, hobbies, first_Name, last_Name, phone}).returning('*')
        .then(record => {

            console.log(record[0])
            res.json(record[0])
        })
        .catch(err => {

            res.status(433).send({error: 'Failed to insert record'})
        })
})

module.exports = router;
