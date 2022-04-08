let express = require('express');
let router = express.Router();
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator');

/**
 *  Login
 */
router.get('/login', (req, res)=>{
	res.render('login');
})

router.post('/login', userController.login)



/**
 *  SignUp
 */
router.get('/signup', (req, res)=>{
	res.render('signup');
})

router.post('/signup', userValidator, userController.signup)

module.exports = router;
