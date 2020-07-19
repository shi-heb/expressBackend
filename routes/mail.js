var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const creds = require('../config/config');

var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
 // var name = req.body.name
 // var email = req.body.email
  var destination =req.body.destination
  var message = "Gongtats ,your account is activated"
  //var content = `name: ${name} \n email: ${email} \n message: ${message} `
  var content = ` message: ${message} `


  var mail = {
    //from: name,
    to:destination,
   // to: 'chiheb.benhassine@esprit.tn',  //Change to email address that you want to receive messages on
    subject: 'New Message from TheoBunk administration',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
})

module.exports = router;