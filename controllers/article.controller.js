const Article = require('../models/article.model');
const Category = require('../models/category.model');
const fs = require('fs');






exports.listArticle = (req, res)=>{
    Article.find()		
    			
    .then((articles)=>{				
    res.render('index', {title: 'Express', 'articles': articles });	
    })						

    .catch((err)=>{					
        res.status(200).json(err);
    })					

}

exports.showArticle = (req, res)=>{
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

exports.addArticle = (req, res)=>{
	Category.find()		                    //--> On récupère tout, on aura alors un then et un catch:
	.then((categories)=>{
		res.render('add-article',{categories: categories});
	})
	.catch(()=>{
		res.redirect('/');	                //--> Si erreur on redirige sur la homepage
	});

}

exports.addOneArticle = (req, res)=>{

    let article = new Article ({
        ...req.body,
        image: `${req.protocol}://${req.get('host')}/images/articles/${req.file.filename}`,
        publishedAt: Date.now()
    });
    // console.log(article);
    // return;

        // article.save((err, article)=>{
        //     if(err){
        //         Category.find()
        //     .then((categories)=>{			            //--> les categorie récupérées
        //         res.render('add-article', {categories: categories, error: "Sorry, an error has occured. Thank you try again later"})  	//--> à l'intérieur on va pouvoir rendre la vue
        //     })
        //     .catch(()=>{	                            //--> si on arrive pas à avoir les catégories on redirige sur la page d'accueil
        //         res.redirect('/');
        //     });	
            
        // }else{
        //     Category.find()		                        //--> si pas d'erreur on va récupérer les catégories
        //     .then((categories)=>{			            //--> dans le cas où on a les données, on procède à l'affichage (on va ajouter les catégories qu'on a récupéré)
        //         res.render('add-article', {categories: categories, success: "Thank you, your article has been added"})
        //     })
        //     .catch(()=>{
        //         res.redirect('/');
        //     });
            
        // }
        // });  

        article.save((err, article)=>{
            if(err){
                req.flash('error', 'Sorry, an error has occured. Thank you try again later');
                return res.redirect('/add-article');
            }
            req.flash('success', 'Thank you, your article has been added');
            return res.redirect('/add-article');
        });

}

exports.editArticle = (req, res)=>{
    const id = req.params.id   //--> on récupère l'identifiant de l'article, on peut mettre "id" car dans la route on attend un "/:id"
    Article.findOne({_id: id}, (err, article)=>{  //--> on va rechercher un element dans les Articles qui à cet identifiant là, puis le callback "err" puis "article"
        if(err){
            req.flash('error', err.message);    //On regarde si on a une erreur, on redirige sur la page home
            return res.redirect('/');
        }
        Category.find((err, categories)=>{  //Si tout se passe bien sans erreur, on récupère les catégories et on fait un editArticle
            if(err){
                req.flash('error', err.message);
                return res.redirect('/');
            }
            return res.render('edit-article', {categories: categories, article: article});  //--> si pas d'erreur on affiche la page editArticle
        })
    })
}

exports.editOneArticle = (req, res)=>{
    const id = req.params.id;
    Article.findOne({_id: id}, (err, article)=>{                // --> soit on se retrouve avec une erreur, soit un article
        if(err){                                                //--> si erreur on redirige sur la même page et message flash
            req.flash('error', err.message)                     //--> on affiche le message d'erreur
            return res.redirect("/edit-article/"+id);           //--> on redirige sur la même page et on fourni l'id
        }
                                //--> on renseigne les informations qu'on attend
                                //--> si article.title est défini (est ce  que le user a défini un title) alors on met la valeur
                                //dans article.title, sinon on garde la valeur par défaut  (celle qu'on a déjà pour l'article)


            //SUPPRESSION DE L'ANCIENNE IMAGE//
        if(req.file){
            const filename = article.image.split('/articles/')[1];
            fs.unlink(`public/images/articles/${filename}`, ()=>{			//--> on lui donne un callback
            console.log('Deleted : '+filename);
            })			
        }



        article.title = req.body.title ? req.body.title : article.title;
        article.category = req.body.category ? req.body.category : article.category;
        article.content = req.body.content ? req.body.content : article.content;
                                //--> pour l'image pareil
        article.image = req.file ? `${req.protocol}://${req.get('host')}/images/articles/${req.file.filename}` : article.image;
                                //--> est ce qu'on a un fichier ? si oui on sauvegarde l'adresse complète du fichier
                                //--> si ce n'est pas le cas, on garde l'adresse qu'on a par défaut.
                                //--> une fois que c'est fait on sauvegarde l'article en question

        article.save((err, article)=>{
            if(err){
                req.flash('error', err.message)
                return res.redirect("/edit-article/"+id);
            }
            req.flash('success', "The article has been edited !");
            return res.redirect('/edit-article/'+id);
        })
    })
}