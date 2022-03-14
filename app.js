var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Category = require('./models/category.model');
//const Article = require('./models/article.model');  //création d'un article
const bodyParser = require('body-parser');
const Validator = require('node-input-validator');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Prise en charge du JSON
app.use(bodyParser.json());

// Prise en charge du formulaire
app.use(bodyParser.urlencoded({extended: false}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog',
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
