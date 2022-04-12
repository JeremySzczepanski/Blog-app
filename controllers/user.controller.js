const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const randomToken = require('random-token');
const Reset = require('../models/reset.model');

module.exports = {
    login: (req, res, next)=>{
        const user = new User({
            username : req.body.username,
            password : req.body.password
        }) 

        req.login(user, (err)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/login');
            }
            //Authentication
            passport.authenticate("local", {failureRedirect: '/users/login', failureFlash: 'Invalid username or password.' })(req, res, (err, user)=>{
                if(err){
                    req.flash('error', err.message)
                    return res.redirect('/users/login');
                }
                //si pas d'erreur on redirige sur la home
                req.flash('success', 'Cool, you are now connected !');
                return res.redirect('/users/dashboard');
            })
        })

    },
    signup: (req, res, next)=>{
        const newUser = User({
            username : req.body.username,
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email

        })

        User.register(newUser, req.body.password, (err, user)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/signup');
            }
            //Authentication
            passport.authenticate("local")(req, res, (err, newUser)=>{
                if(err){
                    req.flash('error', err.message)
                    return res.redirect('/users/signup');
                }
                //si pas d'erreur on redirige sur la home
                req.flash('success', 'Cool, you are now connected !');
                return res.redirect('/users/dashboard');
            })
            console.log(user);
        })

        // /**
        //  * BCrypt PassWord - authentification Manuelle et cryptage sans le module Passport
        //  */

        // bcrypt.hash(req.body.password, 10, (err, hash)=> {	//(MotDePassEnClair, nbrDeFoisQuOnSouhaiteCrypter,...)
        //     if(err){
        //         req.flash('error', err.message);		//si err, on crée un message flash
        //         return res.redirect('/users/signup');
        //     }
        //                                                 //Si pas d'erreur on crée le newUser
        //     const newUser = User({      //Objet metier user (objet créé au niveau de model)
        //     ...req.body,
        //     password: hash  //on remplace le password par le hash que l'on a désormais
        //     });

		// 					//le MDP est bien crypté, on peut l'enregistrer dans la DB
        //     newUser.save((err, user)=>{
        //         if(err){                    //si err, on crée un message flash
        //             req.flash('error', err.message);		
        //             return res.redirect('/users/signup');
        //         }
        //                                     //si pas d'err, message flash et on dirige sur home
        //         req.flash('success', 'Your account has been successfully created. You can log in');
        //             return res.redirect('/users/login');	
        //     })
        //         console.log(newUser);
                        
        // });
                        
    },
    resetPassword: (req, res, next)=>{
        User.findOne({username: req.body.username}, (err, user)=>{
        if(err){						//Si erreur
            req.flash('error', err.message);
            return res.redirect('/users/forgot-password');
        }
        if(!user){						//Si on ne retrouve pas le nom du user
            req.flash('error', 'Username not found !');
            return res.redirect('/users/forgot-password');
        }							    //Si on retrouve l'user alors on crée un token et on envoie un lien par mail

        //Création de token (jeton)
        const token = randomToken(32);
        const reset = new Reset({
            username: req.body.username,
            resetPasswordToken: token,
            resetExpires: Date.now() + 3600000      //Pour une validité d'une heure pour le token
        })

        reset.save((err, reset)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgot-password');
            }
                                                    //Si pas d'erreur, ça veut dire qu'on a bien reçu le token, alors on envoir l'email



        //Email de réinitialisation
            req.body.email = user.email;
            req.body.message =  "<h3>Hello " + user.username + "!</h3><br>Click this link to reset your password : <br>"+req.protocol+"://"+req.get('host')+"/users/reset-password/"+token;

	    next();		    //--> on fourni un next() afin de passer au middleware suivant pour la route qui va utiliser le middleware "sendResetMail":
				        // router.post('/forgot-password', userController.resetPassword, sendResetMail)

        })

        })								  
    },
    resetPasswordForm: (req, res, next)=>{
        const token = req.params.token;             //on peut mettre params.token, car la route en question prend ":token" en paramètre
                                                    //permet donc au niveau de l'action resetPasswordForm de récuperer le token
        Reset.findOne({resetPasswordToken: token, resetExpires: {$gt: Date.now()}}, (err, reset)=>{    //on donne un objet à resetExpires: $gt (greater than)	
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgot-password');
            }
            if(!reset){
                req.flash('error', 'Your token is invalid. Please enter your email ans ask again !');
                return res.redirect('/users/forgot-password');
            }
            req.flash('success', 'Please reset your password !');
            return res.render('reset-password');
        })	                                            
    },
    postResetPassword: (req, res, next)=>{
        const token = req.params.token;		//On va commencer par aller récupérer les paramètres
        const password = req.body.password;	//Puis on récupère le nouveau mot de passe
    
                            //On regarde est ce que le token est valide. (on copie ce qu'on a dans resetPassworForm: Reset.findOne)
    
            Reset.findOne({resetPasswordToken: token, resetExpires: {$gt: Date.now()}}, (err, reset)=>{
                if(err){							//S'il y a une erreur.
                    req.flash('error', err.message);
                    return res.redirect('/users/forgot-password');
                }
                if(!reset){							//Si on ne trouve pas le token.
                    req.flash('error', 'Your token is invalid. Please enter your email ans ask again !');
                    return res.redirect('/users/forgot-password');
                }
                                        //Si on retrouve le token et le token est valide. (on va chercher l'utilisateur et
                                        //modifier son mot de passe.)
                                        //User.findOne et on précise les critères, le username (celui que l'on a dans reset)
                                        //puis on met le callback (err, user)
    
            User.findOne({username: reset.username}, (err, user)=>{
            if(err){
                req.flash('error', err.message);		//Si err, on redirige
                return res.redirect('/users/forgot-password');
            }							//si pas d'erreur, on regarde si on a retrouvé l'utilisateur
            if(!user){
                req.flash('error', 'User not found. Please enter your email and ask again !');
                return res.redirect('/users/forgot-password');
            }
                                        //Si on est ici c'est qu'on a retrouvé l'utilisateur et qu'il n'y a pas d'erreur
                                        //On va alors simplement modifier son mot de passe.
                                        //"password" est ce qu'on a défini dans la const password = req.body.password
                                        //Puis on met un callback avec (err) si on a pas pu changer le mot de passe
    
            user.setPassword(password, (err)=>{
                if(err){
                    req.flash('error', 'You can\'t change your password. Please enter your email and ask again.');
                    return res.redirect('/users/forgot-password');
                }
                                        //Si pas d'erreur on sauvegarde en base de données l'objet que l'on a
                                        // sur le site avec "user.save();" 
                                        
                user.save();
                                        //On va ensuite supprimer le token qu'on a déjà utilisé
                                        //Avec deleteMany() si l'utilisateur a généré plusieurs tokens.
                                        //on va donc supprimer tous les tokens qui sont sauvegardés avec son username
                                        //"message" en callback, car quand tout se passe bien, on reçoit un message avec
                                        // les éléments qu'on a supprimé, nbr d'éléments retrouvés etc...
                Reset.deleteMany({username: user.username}, (err, message)=>{
                    if(err){
                        console.log(err);
                    }
                    console.log('message');
                })
            })
    
            })						
                req.flash('success', 'Your password has been updated. You can login with it !');	
                return res.redirect('/users/login');		
            })
    
    
    },
    saveProfile: (req, res, next)=>{
        if(!req.user){
		req.flash('warning', 'Please login to modify your profile !');
		return res.redirect('/users/login');
	}
							//est ce que l'identifiant de connexion est le même que celui dans le formulaire
							//-->  <input type="hidden" name="userId" value="{{ user._id}}"> (dans le dashboard.twig)
	if(req.user._id != req.body.userId){		//on doit bien avoir un "name="userId" dans le formulaire
		req.flash('error', 'You are not allowed to modify this profile !');
		return res.redirect('/users/dashboard');
	}
							//s'il arrive ici, c'est qu'il est bien connecté et que les informations qu'il veut modifier sont les bonnes informations
							//On va donc aller chercher les informations en base de données

	User.findOne({_id: req.body.userId}, (err, user)=>{		//ou {_id: req.user._id} puisque les 2 sont identiques
		if(err){
			console.log(err);
		}

				//on change le firstname (user.firstname) est ce que le firstname est défini(req.body.firstname)), 
				//si oui (?) on le met à l'intérieur, sinon on garde l'ancienne valeur qu'on avait déja. (user.firstname)

        const oldUsername = user.username;
		user.firstname = req.body.firstname ? req.body.firstname : user.firstname;	
		user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
		user.username = req.body.username ? req.body.username : user.username;
		user.email = req.body.email ? req.body.email : user.email;


		user.save((err, user)=>{

			if(err){									//si la sauvegarde ne se passe pas bien
				req.flash('error', 'An error has occured. Please try again !');
				return res.redirect('/users/dashboard');
			}
            if(oldUsername != user.username){
                req.flash('success', 'Your username has been changed and you have been logged out. Please reconnect with the new one :'+req.body.username);
                return res.redirect('/users/login');
            }
			req.flash('success', 'your profile has been updated !');		//Si la sauvegarde s'est bien passée on affiche un message de succès
			return res.redirect('/users/dashboard');
		})	


	})
    }

}