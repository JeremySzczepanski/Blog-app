const nodemailer = require('nodemailer');

const sendResetMail = (req, res, next)=>{
									//On crée le transporteur
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth:{
			user: 'jeremy.szczepanski@gmail.com',
			pass: process.env.PASSWORD
		}
	});

	let message = "Message: "+req.body.message;
	let mailOptions ={
		from: 'jeremy.szczepanski@gmail.com',
		to: req.body.email,				//On envoie l'email au mail que l'on a en paramètre
		subject: "Reset your Password",
		html: message
	};

								//Pour que ceci fonctionne, on aura besoin 
								//d'un email (req.body.email) et d'un message (req.body.message)


	transporter.sendMail(mailOptions, (err, infos)=>{
		if(err){
			console.log(err);
			req.flash('err',err.message);
			return res.redirect('/users/forgot-password');
		}else{
			console.log(infos);
			req.flash('success','Great, a link to reset your email has been sent to the address : '+req.body.email+'. Please check your mailbox and click on the reset link');
			return res.redirect('/users/forgot-password');
		}
	})
}

//Puis on exporte le middleware

module.exports = sendResetMail