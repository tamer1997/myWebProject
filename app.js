const express = require('express')
const expressHandlebars = require('express-handlebars')

const db = require('./db.js');
const db2 = require('./product-db.js');
const expressSession = require('express-session')
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser')

const postRouter = require('./routers/post-router')
const authRouter = require('./routers/auth-router')
const contactRouter = require('./routers/contact-router')
const productRouter = require('./routers/product-router')
const csurf  = require('csurf')

const app = express()

app.use(function(request, response, next){
	// Make the session available to all views.
	response.locals.session = request.session
	next()
})

app.use(cookieParser())
app.use(express.static('static'))
app.use(express.urlencoded({
	extended: false
}))

/* === SET STORAGE ENGINE  === */ 
const storage = multer.diskStorage({
	destination: 'views/images',
	filename: function(req,file, cb){
		cb(null, file.fieldname + '_'+ Date.now()+path.extname(file.originalname));
	}
})
/* === INIT UPLOAD === */
const upload = multer({storage: storage}).single('img');

app.use(upload)
app.use(csurf({ cookie: true }))
app.use((req, res, next) => {
    const token = req.csrfToken()
    res.locals.token = token
    res.locals.csurfToken = token
    next()
})

app.use(express.static('views/images'))

app.use(expressSession({
	secret: "asdsasdadsasdasdasds",
	saveUninitialized: false,
	resave: false,
}))

app.engine('hbs', expressHandlebars({
	defaultLayout: 'main.hbs'
}))

app.use((req, res, next) => {
	res.locals.session = req.session
	next()
})

app.get('/index', function(request, response){
	db.getAllData(function(error, posts){
		if(error){
			res.send('Posts has not been getten, ERROR --> ' + error)
		}else{			
			const model = {
				posts
			}
			response.render('index.hbs', model)
		}
	})
})

app.get('/', (req, res) => {
    res.redirect('/index')
}) 

app.get('/about', function(request, response){
	response.render('about.hbs')
})
app.use('/posts', postRouter)
app.use('/contact', contactRouter)
app.use('/auth', authRouter)
app.use('/products', productRouter)

app.get('/logout', (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect('/')
})

app.listen(8080)