const Article = require('../models/article.model');
const Category = require('../models/category.model');






exports.list = (req, res)=>{
    Article.find()		
    			
    .then((articles)=>{				
    res.render('index', {title: 'Express', 'articles': articles });	
    })						

    .catch((err)=>{					
        res.status(200).json(err);
    })					

}

exports.show = (req, res)=>{
    Article.findOne({_id: req.params.id})

	.then((article)=>{	                      
    res.render('single-article', {article: article})
		console.log(article);
	})

	.catch((err)=>{
    res.redirect('/');
		console.log(err);
	});
}

exports.add = (req, res)=>{
	Category.find()		                    //--> On récupère tout, on aura alors un then et un catch:
	.then((categories)=>{
		res.render('add-article',{categories: categories});
	})
	.catch(()=>{
		res.redirect('/');	                //--> Si erreur on redirige sur la homepage
	});

}

exports.addOne = (req, res)=>{

    let article = new Article ({
        ...req.body,
        publishedAt: Date.now()
    });

        article.save((err, article)=>{
            if(err){
                Category.find()
            .then((categories)=>{			            //--> les categorie récupérées
                res.render('add-article', {categories: categories, error: "Sorry, an error has occured. Thank you try again later"})  	//--> à l'intérieur on va pouvoir rendre la vue
            })
            .catch(()=>{	                            //--> si on arrive pas à avoir les catégories on redirige sur la page d'accueil
                res.redirect('/');
            });	
            
        }else{
            Category.find()		                        //--> si pas d'erreur on va récupérer les catégories
            .then((categories)=>{			            //--> dans le cas où on a les données, on procède à l'affichage (on va ajouter les catégories qu'on a récupéré)
                res.render('add-article', {categories: categories, success: "Thank you, your article has been added"})
            })
            .catch(()=>{
                res.redirect('/');
            });
            
        }
        });  

}