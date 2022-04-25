let createError = require('http-errors');
let express = require('express');
let session = require('express-session');
const flash = require('connect-flash');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
// const Category = require('./models/category.model');
//const Article = require('./models/article.model');  //création d'un article
// const Validator = require('node-input-validator');
const User = require('./models/user.model');   //Passport local
const Article = require('./models/article.model');
const dotenv = require('dotenv').config();


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));

// Init Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Stockage des articles du connected User dans une variable locale: res.locals.articles
app.use((req, res, next)=>{
	if(req.isAuthenticated()){		//permet de savoir s'il est authentifié, alors on va récupérer les articles sauvegardés en son nom
		Article.find({author: req.user._id}, (err, articles)=>{		//on recherche les articles avec le nom de l'author = user._id
			if(err){
				console.log(err);
			}else{
				res.locals.articles = articles;		//on sauvegarde les articles récupérés en local.
			}
				next()	//que l'on soit dans le if ou dans le else, à un moment on devra passer au middleware suivant, alors on peut
					//mettre next() en dehors des blocs.
		})
	}else{
		next();
	}
})



//Init flash
app.use(flash());
app.use((req, res, next)=>{
  if(req.user){
    res.locals.user = req.user; //ainsi partout où on ira sur le site, on aura les infos sur le currentUser (ici locals.user)
  }
  res.locals.error = req.flash('error');
  res.locals.warning = req.flash('warning');
  res.locals.success = req.flash('success');
  res.locals.errorForm = req.flash('errorForm');
  next();
})



// Prise en charge du JSON
app.use(bodyParser.json());

// Prise en charge du formulaire
app.use(bodyParser.urlencoded({extended: false}));


// mongoose.connect('mongodb://localhost:27017/blog',
mongoose.connect(process.env.DATABASE,
	{useNewUrlParser: true, useUnifiedTopology: true})
	.then(()=>console.log("Connexion à MongoDB réussie"))
	.catch(()=> console.log("Echec de connexion à MongoDB"));


// //Création d'un article (utilisé afin de remplir la DB avec 10 articles)

// for (let index = 0; index < 10; index++) {
//   let article = new Article({	    //--> et on indique à l'intérieur les données attendues
//     name: "Article "+index,
//     content: "Content "+index,
//     publishedAt: Date.now()
//   })

//   //--> afin de sauvegarder l'article on fait un save qui va nous retourner une promise:
//   article.save()
//   .then(()=>console.log("Sauvegarde réussie"))
//   .catch(()=>console.log("Sauvegarde echouée"));
// }


// // Création d'une nouvelle DB afin de remplir la DB avec du Lorem Ipsum
// for (let index = 0; index < 8; index++) {
// 	article = new Article({
// 		name: 'Qu\'est ce que le Lorem Ipsum?',
// 		content: 'Le LoremIpsum est simplement du faux texte employé dans la communication....',
// 		publishedAt: Date.now()
// 	})
// 	//article.save();
// }

// //Création de 5 category
// for (let index = 0; index < 5; index++) {
// 	category = new Category({
// 		title: 'titre de la catégorie'+index,
// 		description: 'cette catégorie représente une catégorie',
// 	})
// 	category.save();
// }




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
