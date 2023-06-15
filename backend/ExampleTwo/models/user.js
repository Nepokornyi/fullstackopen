const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        unique: true
    },
    name: String,
    password: {
        type: String,
        required: true,
        minLength: 3,
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString();
        delete returnedDocument._id;
        delete returnedDocument.__v;
        delete returnedDocument.password;
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);