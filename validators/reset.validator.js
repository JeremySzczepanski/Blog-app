const { Validator } = require('node-input-validator');

resetValidator = (req, res, next)=>{

    const formIsValid = new Validator (req.body, {
        password: 'required',
        passwordConfirm: 'required|same:password'
    });

    formIsValid.check().then((matched)=>{
        if (!matched){
            //error
            console.log(formIsValid.errors);
            req.flash('errorForm', formIsValid.errors);
            return res.redirect('/users/'+req.path);        //s'il y a une erreur, redirige vers l'adresse où on se situe
    }
        next();
    })
}

module.exports = resetValidator;
