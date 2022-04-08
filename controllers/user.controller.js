const User = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports = {
    login: ()=>{

    },
    signup: (req, res, next)=>{

        /**
         * BCrypt PassWord
         */

        bcrypt.hash(req.body.password, 10, (err, hash)=> {	//(MotDePassEnClair, nbrDeFoisQuOnSouhaiteCrypter,...)
            if(err){
                req.flash('error', err.message);		//si err, on crée un message flash
                return res.redirect('/users/signup');
            }
                                                        //Si pas d'erreur on crée le newUser
            const newUser = User({      //Objet metier user (objet créé au niveau de model)
            ...req.body,
            password: hash  //on remplace le password par le hash que l'on a désormais
            });

							//le MDP est bien crypté, on peut l'enregistrer dans la DB
            newUser.save((err, user)=>{
                if(err){                    //si err, on crée un message flash
                    req.flash('error', err.message);		
                    return res.redirect('/users/signup');
                }
                                            //si pas d'err, message flash et on dirige sur home
                req.flash('success', 'Your account has been successfully created. You can log in');
                    return res.redirect('/users/login');	
            })
                console.log(newUser);
                        
        });
                        
    }
}