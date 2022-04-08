const { Validator } = require('node-input-validator');

userValidator = (req, res, next)=>{

    const formIsValid = new Validator (req.body, {
        firstname: 'required',
        lastname: 'required',
        username: 'required',
        email: 'required|email',
        password: 'required',
        passwordConfirm: 'required|same:password'
    });

    formIsValid.check().then((matched)=>{
        if (!matched){
            //error
            console.log(formIsValid.errors);
            req.flash('errorForm', formIsValid.errors);
            return res.redirect('/users/signup');
    }
        next();
    })
}

module.exports = userValidator;
