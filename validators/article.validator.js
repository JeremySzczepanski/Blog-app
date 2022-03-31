const { Validator } = require('node-input-validator');

articleValidator = (req, res, next)=>{

	if(req.file){				            // on teste si on a un fichier dans le champ image, si oui, on a déjà pris ça en compte
		req.body.image = req.file.filename	//alors on ne va plus faire de restriction sur l'image, on prend req.body.image et on va
	}                                       //mettre qqch dedans juste pour passer le test

    const formIsValid = new Validator (req.body, {
        title: 'required',
        content: 'required|length:10000',     //length:max  , length:max,min
        category: 'required',
        image: 'required'
    });

    formIsValid.check().then((matched)=>{
        if (!matched){
            //error
            req.flash('errorFormArticle', formIsValid.errors);
            return res.redirect('/add-article');
    }
        next();
    })
}

module.exports = articleValidator;
