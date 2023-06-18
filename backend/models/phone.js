require('dotenv').config({ path: '../.env' })

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const url = process.env.MONGO_DB;

console.log('connecting to ', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(err => {
        console.log('error connecting to MongoDB', err.message);
    })

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