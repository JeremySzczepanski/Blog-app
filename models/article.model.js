const { default: mongoose } = require("mongoose")

const articleSchema = mongoose.Schema({             // à l'intérieur on met la structure de données
    title: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, required: true},              // "string" car on va récupérer les chaines de caratère du nom de l'image
    publishedAt: {type: Date, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'                                 //que l'on retrouve dans user.model (module.exports = mongoose.model('User', userSchema);
    }

});

module.exports = mongoose.model('Article', articleSchema);