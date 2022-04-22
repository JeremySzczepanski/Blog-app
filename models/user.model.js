const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: String,
	createdAt: {type: Date, default: Date.now()}		//--> si rien de renseigné, la date renseignée sera celle du jour.

	// 					//Pas obligatoire
	// articles: Array		//comme un user peut avoir un ou plusieurs articles, on met Array, 
	// 					//ainsi on aura un tableau vide si l'utilisateur n'a pas créé d'articles, ou un tableau s'il en a créé plusieurs

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);