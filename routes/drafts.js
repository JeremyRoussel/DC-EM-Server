require('dotenv').config();
let express = require('express');
let router = express.Router();

let jwt = require('jwt-simple')

var db = require('../db')

let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));


let passport = require('passport')

require('../config/passAuth')

let requireAuth = passport.authenticate('jwt', {session: false});
// DO WE NEED THIS HERE? ***********************************************
// let requireSignin = passport.authenticate('local', {session: false});

router.get('/drafts', requireAuth, (req, res) =>{

    let userID = req.user.id;
    console.log(`Making a get request to DRAFTS as ${req.user.email}, id: ${req.user.id}`);

    db('drafts').where({user_id: userID}).returning('*')
    .then(drafts =>{
        console.log(drafts)
        res.json(drafts)
    })
    .catch(error =>{
        res.status(433).send({error: "No records for that username"})
    })
})

router.post('/drafts', requireAuth, (req, res) =>{

    let user_id = req.user.id;

    let title = req.body.drafts.title
    let body = req.body.drafts.body
    let group = req.body.drafts.group

    db('drafts').insert({user_id, title, body, group}).returning('*')
    .then(record =>{
        console.log(record[0])
        res.json(record[0])
    })
    .catch(error =>{
        res.status(433).send({error: "Could not add draft"})
    })
})

router.put('/drafts', requireAuth, (req, res) =>{

    let userID = req.user.id

    let title = req.body.drafts.title
    let body = req.body.drafts.body
    let group = req.body.drafts.group
    let id = req.body.drafts.postID

    // console.log(title, body, group, id)
    // console.log(Sid)

    // update({userID: userID, title: title, body: body, group: group}).
    db('drafts').where({id}).update({title, body, group}).returning('*')
    .then(record =>{
        console.log(`update response, record:`, record)
        res.json(record)
    })
    .catch(error =>{
        res.status(433).send({error: "Could not update draft"})
    })
})

router.delete('/drafts/:id', requireAuth, (req, res) =>{

    // console.log(req.params.id)
    let id = req.params.id

    db('drafts').where({id}).del().returning('*')
    .then(record =>{
        console.log(`update response, record: ${record}`)
        res.json(record)
    })
    .catch(error =>{
        res.status(433).send({error: "Could not delete draft"})
    })
})


module.exports = router;
