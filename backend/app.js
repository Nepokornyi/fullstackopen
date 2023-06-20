const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const phonesRouter = require('./controllers/phones');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');


mongoose.set('strictQuery', false);

logger.info(`connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch(err => {
        logger.error('error connecting to MongoDB', err.message);
    })


app.use(cors());
app.use(express.static('build'))
app.use(express.json());
app.use(middleware.requestLogger)

app.use('/api/persons', phonesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

// -----------------

// app.get('/info', (request, response, next) => {
//     Phone.countDocuments({}).then(phones => {
//         const info = {
//             message: `Phone book has info for ${phones} people`,
//             timestamp: new Date(),
//         }
//         const htmlInfo = `
//             <h1>Hello mom!</h1>
//             <p>${info.message}</p>
//             <p>${info.timestamp}</p>
//         `
//         // send() instead of json() to display html
//         response.send(htmlInfo)
//     })
//         .catch(err => next(err))
// })

// -----------------



