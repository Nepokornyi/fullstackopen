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





