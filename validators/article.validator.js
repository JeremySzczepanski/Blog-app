const { Validator } = require('node-input-validator');

addOneValidator = (req, res, next)=>{
    const formIsValid = new Validator (req.body, {
        title: 'required',
        content: 'required|length:10000',     //length:max  , length:max,min
        category: 'required',
        //image: 'required'
    });

    formIsValid.check().then((matched)=>{
        if (!matched){
        res.render('add-article', {formError: formIsValid.errors});
        return;
    }
        next();
    })
}

module.exports = addOneValidator;
