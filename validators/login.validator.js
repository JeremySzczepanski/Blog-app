const { Validator } = require('node-input-validator');

loginValidator = (req, res, next)=>{

    const formIsValid = new Validator (req.body, {
        username: 'required',
        password: 'required',
    });

    formIsValid.check().then((matched)=>{
        if (!matched){
            //error
            console.log(formIsValid.errors);
            req.flash('errorForm', formIsValid.errors);
            return res.redirect('/users/login');
    }
        next();
    })
}

module.exports = loginValidator;