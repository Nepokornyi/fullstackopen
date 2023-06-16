const mongoose = require('mongoose');

if(process.argv.length < 3){
    console.log('password is not provided')
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.elfx4ob.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Phone = mongoose.model('Phone', phoneSchema);


if(process.argv.length === 3){
    Phone.find({}).then(result => {
        console.log('phones: ');
        result.forEach(phone => {
            console.log(phone.name, phone.phone)
        })
        mongoose.connection.close();
    })
}

else if(process.argv.length === 5){

    const phone = new Phone({
        name: process.argv[3],
        phone: process.argv[4]
    })

    phone.save().then((result) => {
        console.log(`added ${result.name} number ${result.phone} to phone book`);
        mongoose.connection.close()
    })
}





