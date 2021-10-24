const express = require('express')
const db = require('../db');
const router = express.Router()

/* === LOGIN  === */ 
router.get('/login', function(request, response){
	response.render('login.hbs')
})

router.post('/login', function(request, response){
	
	const adminUsername = request.body.username
	const adminPassword = request.body.password
	const validationLoginErr = []

	db.getLoginData(function(error, values){
		if (error){
			res.send('Login failed, ERROR --> ' + error)
		}else{

			if(adminUsername != values.username){
				validationLoginErr.push('Wrong username')
			}
			if(adminPassword != values.password){
				validationLoginErr.push('Wrong password')
			}
			
			if(validationLoginErr.length == 0){
				console.log('here');
				request.session.isLoggedIn = true
				response.redirect('/')
			}
			else{
				const model = {
					validationLoginErr
				}
				response.render('login.hbs', model)
			}
		}
		
	})
	
})

module.exports = router