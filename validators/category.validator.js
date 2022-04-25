const { Validator } = require('node-input-validator');							//require

categoryValidator = (req, res, next)=>{

    const formIsValid = new Validator (req.body, {							    //validator
        title: 'required',
        description: 'required|length:10000'
    });

    formIsValid.check().then((matched)=>{								        //check
        if (!matched){
            //error
            req.flash('errorForm', formIsValid.errors);
            return res.redirect('/add-category');
    }
        next();
    })
}

module.exports = categoryValidator;