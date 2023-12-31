const mongoose = require ('mongoose')

const phoneSchema = new mongoose.Schema({
    name: {
        type:String,
        minLength: 5,
        required: true,
    },
    phone: {
        type:String,
        required: true,
        validate: {
            validator: function(v){
                return /^\d{2}-\d{6,}$|^\d{3}-\d{5,}$/.test(v);
            },
            message: props => `${props.value} is not valid phone number!`
        }
    },
})

phoneSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Phone', phoneSchema);