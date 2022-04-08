const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	createdAt: {type: Date, default: Date.now()}		//--> si rien de renseigné, la date renseignée sera celle du jour.

});

module.exports = mongoose.model('User', userSchema);