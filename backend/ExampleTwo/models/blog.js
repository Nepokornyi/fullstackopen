const mongoose = require ('mongoose')

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    url: String,
    likes: { type: Number, default: 0 },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

blogSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString();
        delete returnedDocument._id;
        delete returnedDocument.__v;
    }
})

module.exports = mongoose.model('Blog', blogSchema)