require('dotenv').config()

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Phone = require('./models/phone')

const app = express();

app.use(express.static('build'))
app.use(express.json());
app.use(cors());

morgan.token('post-data', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : '';
});
const formatLogging = ':method :url :status :response-time ms - :res[content-length] :post-data'
app.use(morgan(formatLogging));

// -----------------

app.get('/info', (request, response, next) => {
    Phone.countDocuments({}).then(phones => {
        const info = {
            message: `Phone book has info for ${phones} people`,
            timestamp: new Date(),
        }
        const htmlInfo = `
            <h1>Hello mom!</h1>
            <p>${info.message}</p>
            <p>${info.timestamp}</p>
        `
        // send() instead of json() to display html
        response.send(htmlInfo)
    })
        .catch(err => next(err))
})

app.get('/api/persons', (request, response, next) => {
    Phone.find({}).then(phones => {
        response.json(phones);
    })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
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

app.post('/api/persons', (request, response, next) => {
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

app.put('/api/persons/:id', (request, response, next) => {
    const { name, phone } = request.body

    Phone.findOneAndUpdate({ name }, { phone }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPhone => {
            response.json(updatedPhone);
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phone.findByIdAndDelete(request.params.id.toString()).then(phone => {
        console.log('deleted ', phone)
        response.status(204).end();
    })
        .catch(err => next(err));
})

// -----------------

const errorHandler = (err, req, res, next) => {
    console.log(err.name);

    if(err.name === 'CastError'){
        return res.status(400).json({ error: 'malformed ID' })
    }
    else if (err.name === 'ValidationError'){
        return res.status(400).json({ error: err.message })
    }

    next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})