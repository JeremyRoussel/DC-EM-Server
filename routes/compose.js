
require("dotenv").config();
require('../config/passAuth.js')
const apiKey = require('../sgmail')
let express = require('express');
let router = express.Router();
const sgMail = require('@sendgrid/mail') // gives access to the sendgrid api
let bodyParser = require('body-parser')
let passport = require('passport')
let requireAuth = passport.authenticate('jwt', {session: false})


sgMail.setApiKey(apiKey)

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.post('/compose', requireAuth, (req, res)=>{


    let body = req.body.send.body;
    let title = req.body.send.title;
    let group = req.body.send.group;
    let senderEmail = "senderEmail@email.gov";

    const msg = {
      to: "dgelok@gmail.com",
      from: "newsletter@megamailapp.com",
      subject: "This is a title",
      html: "This is an email",
    };

    sgMail.send(msg).then(() => {
      console.log('Message sent')
    }).catch((error) => {
      console.log(error.response.body)
    })

    res.send("Email sent successfully!")


})








module.exports = router;