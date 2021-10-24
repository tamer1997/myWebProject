const express = require('express')
const validators = require('../validators')
const db = require('../db')
const { copyFileSync } = require('fs');

const router = express.Router()

/* === CREATE POST  === */
router.get('/create', function(request, response){
	response.render('create-post.hbs')
})

router.post('/create', (req,res) => {
	
		const title = req.body.title
		const description = req.body.description
		const Filename = req.file.filename
		const errors = validators.getValidationErrors(title, description)

		if(!req.session.isLoggedIn){
			errors.push("Not logged in.")
		}
		if (errors.length == 0){

			db.uploadPost(title, description, Filename, function(error, id){
				if(error){
					res.send('Post has not been uploaded, ERROR --> ' + error)
				}else{

					res.redirect('/posts/'+id)
				}
			
			})
		}else{
			const model = {
				errors,
				title,
				description
			}

			res.render('create-post.hbs', model)
		}
		
})

/* === GET POST BY ID  === */
router.get('/:id', function(request, response){
	
	const id = request.params.id	
	db.getDataById(id, function(error, post){

		if(error){
			res.send('Can not get data for the post with id = ' + id + ', ERROR' + error)
		}else{
			db.getCommentsByPostId(id, function(error, comments){
				if (error){

					res.send('Can not get comments for the post with id = ' + id + ', ERROR' + error)

				}else{
					const model = {
						post,
						comments
					}
					console.log(comments);
					response.render('post.hbs', model);
				}
			})
		}
	})	
})

/* === EDIT POST  === */
router.get('/editPost/:id', function(req, res){

	const id = req.params.id
	db.getDataById(id,function(error, posts){
		
		if(error){
			res.send('Can not get data for the post with id = ' + id + ', ERROR' + error)
		}else{
			const model = {
				posts
			}
			res.render('edit-post.hbs', model)
		}
	})
})

router.post('/editPost/:id', (req, res) => {
    const title = req.body.title
	const description = req.body.description
	const errors = validators.getValidationErrors(title, description)
	const id = req.params.id

	if(errors.length == 0){
        db.updatePost(title, description, id, function(error){
            if(error){
				res.send('Post with id = ' + id + ' has not been edited , ERROR --> ' + error)
			}else{
                res.redirect('/posts/'+id)
            }

        })    
	}else{
		const model = {
			errors,
			title,
			description,
			posts: {
				id,
				title,
				description
			}
		}

		res.render('edit-post.hbs', model)
	}
})

/* === DELETE POST  === */ 
router.get('/deletePost/:id', function(request, response){
	
	const id = request.params.id
	
	db.getDataById(id, function(error, post){
		
		if(error){
			res.send('Can not data for the post with id = ' + id + ', ERROR' + error)
		}
		
		const model = {
			post
		}
		
		response.render('delete-post.hbs', model)
		
	})
	
})

router.post('/deletePost/:id', function(req, res){
	const id = req.params.id
	db.deleteDataById(id, function(error){
		if(error){
			res.send('Post with id = ' + id + ' has not been deleted , ERROR --> ' + error)
		}
		else{
			res.redirect('/')
		}
	})
})

/* === COMMENT POST  === */ 
router.post('/comment', function(req, res){

	const postId = req.body.postId;
	const name = req.body.name;
	const comment = req.body.comment;
	const errors = validators.getValidationCommentError(name, comment)

	if (errors.length == 0){
		db.uploadComment(postId, name, comment, function(error){
			if(error){
				res.send('Your comment has not been entered, ERROR --> ' + error)
			}else{
				res.redirect('/posts/'+postId)	
			}
		})
	}else{
		const model = {
			errors,
			name,
			comment
		}

		res.render('edit-comment.hbs', model)
	}
})

router.get('/:postId/deleteComment/:id', function(request, response){
	
	const id = request.params.id
	const postId = request.params.postId
	db.getCommentById(id, function(error, comment){
		
		if(error){
			res.send('Can not get comment for the post with id = ' + id + ', ERROR' + error)
		}
		
		const model = {
			comment,
			postId
		}
		
		response.render('delete-comment.hbs', model)
		
	})
	
})

router.post('/deleteComment/:id', function(req, res){

	const id = req.params.id
	const postId = req.body.postId
	db.deleteCommentById(id, function(error){
		if(error){
			res.send('Comment with id = ' + id + ' has not been deleted , ERROR --> ' + error)
		}
		else{
			res.redirect('/posts/'+postId)
		}
	})
})


router.get('/:postId/updateComment/:id', function(req, res){

	const id = req.params.id
	const postId = req.params.postId
	db.getCommentById(id,function(error, comments){
		if(error){
			res.send('Comment with id = ' + id + ' has not been updated , ERROR --> ' + error)
		}else{
			const model = {
				comments,
				postId
			}
			console.log(model)
			res.render('edit-comment.hbs', model)
		}
	})
})

router.post('/updateComment/:id', (req, res) => {

    const name = req.body.name
	const comment = req.body.comment
	const postId = req.body.postId
	const id = req.params.id

	db.updateComment(name, comment, id, function(error){
		if(!error){
			res.redirect('/posts/'+postId)
		}else{
			res.send('Comment with id = ' + id + ' has not been updated , ERROR --> ' + error)
		}
	})    
})

module.exports = router

