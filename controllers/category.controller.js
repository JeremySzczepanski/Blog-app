const Category = require('../models/category.model');

exports.addCategory = (req, res, next)=>{

	const newCategory = new Category({
		...req.body
	})
	
	newCategory.save((err, category)=>{			//On sauvegarde
		if(err){					            //Si erreur on affiche le message dans la console
			console.log(err.message);
		}
								                //Si pas d'erreur, on redirige vers /add-category
		req.flash('success', 'Great, category has been added !');
		res.redirect('/add-category')
	})

}