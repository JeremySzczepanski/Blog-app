let express = require('express');
let router = express.Router();
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');
const loginValidator = require('../validators/login.validator');
const resetValidator = require('../validators/reset.validator');
const { guard } = require('../middlewares/guard');
const sendResetMail = require('../middlewares/services/email.service');

/**
 *  Login
 */
router.get('/login', (req, res)=>{
	res.render('login');
})

router.post('/login', loginValidator, userController.login)

/**
 * Reset Password
 */
router.get('/forgot-password', (req, res)=>{
	res.render('forgot-password');
})

router.post('/forgot-password', userController.resetPassword, sendResetMail);

/**
 * Reset Password Form
 */
router.get('/reset-password/:token', userController.resetPasswordForm);		//On donne le ":token" et on va ajouter le formulaire pour réinitialiser le MDP

router.post('/reset-password/:token', resetValidator, userController.postResetPassword);

/**
 *  SignUp
 */
router.get('/signup', (req, res)=>{
	res.render('signup');
})

router.post('/signup', userValidator, userController.signup)

/**
 *  Dashboard
 */

router.get('/dashboard', guard, (req, res)=>{		//on met un guard afin d'acceder à la route uniquement si on est authentifié
	res.render('dashboard');
})


/**
 *  Logout
 */

router.get('/logout',(req, res)=>{
	req.logout();
	req.flash('success','You are now disconnected !')
	res.redirect('/')
})

module.exports = router;