const express = require('express')
const nodemailer = require('nodemailer');
const router = express.Router()


/* === SEND MAIL === */
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "tamerkhartabil97@gmail.com",
      pass: "t@moor_kh-08qwe"
    }
});

/* === CONTACT  === */ 
router.get('/contactAdmin', function(request, response){
	response.render('contact.hbs')
})

router.post('/contactAdmin', function(req, res){
	const senderSubject = req.body.senderSubject
	const senderEmail = req.body.senderEmail
	const senderMsgContent = req.body.senderMsgContent

	let mailOptions = {
		from: ''+senderEmail+'',
		to: 'tamerkhartabil97@gmail.com',
		subject: ''+senderSubject+'',
		text: ''+senderMsgContent+''
	};

	transporter.sendMail(mailOptions, function(error){
		if(error){
			res.send('The message has not been sent, ERROR --> ' + error)
		}
		else{
			res.render('product/thanksForContactingMsg.hbs')
		}
		
	});
	
})

module.exports = router