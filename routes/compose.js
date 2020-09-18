
require("dotenv").config();
require('../config/passAuth.js')
const apiKey = require('../sgmail')
let express = require('express');
let router = express.Router();
const sgMail = require('@sendgrid/mail') // gives access to the sendgrid api
let bodyParser = require('body-parser')
let passport = require('passport')
let requireAuth = passport.authenticate('jwt', {session: false})

var db = require('../db')

sgMail.setApiKey(apiKey.apiKey)

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/compose', requireAuth, async (req, res)=>{

    try {
      let user_id = req.user.id
      let body = req.body.send.body;
      let title = req.body.send.title;
      let group = req.body.send.group;
      let senderEmail = "senderEmail@email.gov";

      const msg = {
        to: group,
        from: "newsletter@megamailapp.com",
        subject: title,
        html: body,
      };

      console.log(msg)

      

      let sendme = await sgMail.send(msg)
      console.log(sendme)
      console.log('Message sent')

      let response = await db('sent').insert({user_id, body, title, group}).returning('*')  
      
      res.send("Sent")
    }

    catch {
      res.send("error")
    }
})

module.exports = router;