require("dotenv").config();
let express = require('express');
let router = express.Router();

const jwt = require('jwt-simple')

var db = require('../db')

let bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

let passport = require('passport');
const { decodeBase64 } = require("bcryptjs");

require('../config/passAuth')

let requireAuth = passport.authenticate('jwt', {session: false})

router.get('/sent', requireAuth, (req, res) =>{
    let userID = req.user.id;
    console.log(`Sent - get request as ${req.user.email}`)

    db('sent').where({user_id: userID}).returning('*')
        .then(sent =>{
            console.log(sent)
            res.json(sent)
        })
        .catch(err =>{
            res.status(433).send({error: 'Failed to find sent'})
        })
})


router.post('sent', requireAuth, (req, res) =>{

    console.log('Sent Post route made it past Auth!')
    console.log(req.user)

    let user_id = req.user.id;

    let title = req.body.sent.title
    let body = req.body.sent.body
    let group = req.body.sent.group

    db('sent').insert({user_id, title, body, group}).returning('*')
        .then(record =>{
            console.log(record[0])
            res.json(record[0])
        })
        .catch(err =>{
            res.status(433).send({error: 'Failed to insert new record'})
        })
})

module.exports = router;