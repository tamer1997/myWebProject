const express = require('express')
const validators = require('../validators')
const db = require('../product-db')
const { ftruncate } = require('fs');

const router = express.Router()

router.get('/', function(request, response){
	db.getAllData(function(error, products){
		if(error){
			res.send('Can not get data for the product with id = ' + id + ', ERROR' + error)
		}else{
			const model = {
				products
			}
			response.render('product/products.hbs', model)
		}
	})
})

/* === CREATE PRODUCT  === */
router.get('/create', function(request, response){
	response.render('product/create-product.hbs')
})

router.post('/create', (req,res) => {
	
		const name = req.body.name
		const description = req.body.description
		const Filename = req.file.filename
		const price = req.body.price
		const errors = validators.getValidationProductError(name, description, price)

		if(errors.length == 0){
	
			db.uploadProduct(name, description, Filename, price, function(error, id){
				console.log(name, description, price, Filename, id)
				res.redirect('/products/'+id)
			
			})
			
		}else{

			const model = {
				errors,
				name,
				description,
				price
			}

			res.render('product/create-product.hbs', model)
		}
	
})

/* === GET PRODUCT BY ID  === */
router.get('/:id', function(request, response){	
	const id = request.params.id	
	db.getDataById(id, function(error, product){
		if(error){
			res.send('Can not get data for the product with id = ' + id + ', ERROR' + error)
		}else{
			const model = {
				product
			}
			response.render('product/product.hbs', model);
		}
	
	})	
})

/* === DELETE PRODUCT  === */ 
router.get('/deleteProduct/:id', function(request, response){
	
	const id = request.params.id
	
	db.getDataById(id, function(error, product){
		
		if(error){
			res.send('Delete product went wrong, ERROR --> ' + error)
		}else{

			const model = {
				product
			}
			response.render('product/delete-product.hbs', model)
		}
		
	})
	
})

router.post('/deleteProduct/:id', function(req, res){
	const id = req.params.id
	db.deleteDataById(id, function(error){
		if(error){
			res.send('Product with id = ' + id + ' has not been deleted , ERROR --> ' + error)
		}
		else{
			res.redirect('/products')
		}
	})
})

/* === EDIT PRODUCT  === */
router.get('/editProduct/:id', function(req, res){

	const id = req.params.id
	db.getDataById(id,function(error, products){
			if(error){
				res.send('Can not get data for the product with id = ' + id + ', ERROR' + error)
			}else{
				const model = {
					products
				}
				res.render('product/edit-product.hbs', model)
			}
	})
})

router.post('/editProduct/:id', (req, res) => {
    const name = req.body.name
	const description = req.body.description
	const price = req.body.price
	const errors = validators.getValidationProductError(name, description, price)
	const id = req.params.id

		if(errors.length == 0){

			db.updateProduct(name, description, price, id, function(error){
				if(error){
					res.send('Product with id = ' + id + ' has not been edited , ERROR --> ' + error)
				}else{
					res.redirect('/products/'+id)
				}
	
			})    

		}else{
			const model = {
				errors,
				name,
				description,
				price,
				products: {
					id,
					name,
					description,
					price
				}
			}
	
			res.render('product/edit-product.hbs', model)

		}

})

module.exports = router



