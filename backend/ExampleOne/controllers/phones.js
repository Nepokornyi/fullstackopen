const phonesRouter = require('express').Router()
const Phone = require('../models/phone')


phonesRouter.get('/', (request, response, next) => {
    Phone.find({}).then(phones => {
        response.json(phones);
    })
        .catch(err => next(err))
})

phonesRouter.get('/:id', (request, response, next) => {
    Phone.findById(request.params.id).then(phone => {
        if(phone){
            response.json(phone);
        }
        else{
            response.status(404).send({ error: 'not found' })
        }
    })
        .catch(err => next(err))
})

phonesRouter.post('/', (request, response, next) => {
    const body = request.body;

    if(body.name === undefined || body.phone === undefined){
        return response.status(400).json({ error: 'content missing' })
    }

    const phone = new Phone({
        name: body.name,
        phone: body.phone,
    })

    phone.save().then(savedPhone => {
        response.json(savedPhone);
    })
        .catch(err => next(err))

})

phonesRouter.put('/:id', (request, response, next) => {
    const { name, phone } = request.body

    Phone.findOneAndUpdate({ name }, { phone }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPhone => {
            response.json(updatedPhone);
        })
        .catch(err => next(err))
})

phonesRouter.delete('/:id', (request, response, next) => {
    Phone.findByIdAndDelete(request.params.id.toString()).then(phone => {
        console.log('deleted ', phone)
        response.status(204).end();
    })
        .catch(err => next(err));
})

module.exports = phonesRouter;