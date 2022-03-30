var express = require('express');
var router = express.Router();
const addOneValidator = require('../validators/article.validator');
const articleController = require('../controllers/article.controller');
const multerConfig = require('../middlewares/multer.config');




/* GET article from DB */

          // router.get('/', function(req, res,next) {

          //   // ---- ON COPIE LA ROUTE DANS UNE FONCTION "list" que l'on met dans article.controller.js ----- //
          //         // Article.find()					//--> avec Mongoose on peut directement utiliser find() ou findOne() sur un model
          //         // .then((articles)=>{				//--> va nous retourner une promise (si tt se passe correctement on récupére articles)
          //         // 	//res.status(200).json(articles);
          //         //   res.render('index', {title: 'Express', 'articles': articles });	//on lui fourni la vue, mais aussi les articles
          //         // })						

          //         // .catch((err)=>{					//--> dans le cas d'une erreur
          //         // 	res.status(200).json(err);
          //         // })					
          //         // //res.render('index', {title: 'Express' });
          //   //ON IMPORTE LA FONCTION "list" du controller
          // });
router.get('/', articleController.list)



/* GET article id from DB */
          // ---- ON COPIE LA ROUTE DANS UNE FONCTION "show" que l'on met dans article.controller.js ----- //
          // router.get('/article/:id', (req, res)=>{ 		//--> en fonction de l'article sur lequel on clique on va être rediriger 
          // 						                                //vers un id dynamique (on met les ":" devant pour dire que c'est un paramètre qui va varier)
          // 						                                //On met le middleware req res, puis on met à l'intérieur l'élément qui a cet id là
          // 	//console.log(req.params.id);			        //--> pour récupérer directement les données qui viennent avec cet id là (article/":id")
          // 						                                //On va maintenant récupérer l'élément qui a cet identifiant là au sein de notre DB:
          // 	Article.findOne({_id: req.params.id})	    //Ca va nous retourner une promesse donc on met .then et .catch

          // 	.then((article)=>{	                      //--> ça nous retourne un article qu'on utilise pour procèder à l'affichage
          //     res.render('single-article', {article: article})
          // 		console.log(article);
          // 	})

          // 	.catch((err)=>{		                        //--> Si tout ne se passe pas bien , on affiche l'erreur et on redirige vers le home
          //     res.redirect('/');
          // 		console.log(err);
          // 	});

          // })
router.get('/article/:id', articleController.show);


/* Add Article */
router.get('/add-article', articleController.add);

/* AddOne Article */
router.post('/add-article', multerConfig, addOneValidator, articleController.addOne); //





module.exports = router;
