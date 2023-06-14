const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(express.static('build'))
// middleware to handle JSON bodiess
app.use(express.json());
app.use(cors());

morgan.token('post-data', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : '';
}) 

const formatLogging = ':method :url :status :response-time ms - :res[content-length] :post-data'
app.use(morgan(formatLogging));

let phoneBook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/info', (request, response) => {
    const info = {
        message: `Phone book has info for ${phoneBook.length} people`,
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

app.get('/api/persons', (request, response) => {
    response.json(phoneBook);
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const phone =  phoneBook.find(phone => phone.id === id)

    if(phone){
        response.json(phone);
    }
    else{
        response.status(404).end();
    }
})

app.post('/api/persons', (request, response) => {
    const maxId = phoneBook.length > 0 
    ? Math.max(...phoneBook.map(phone => phone.id))
    : 0;

    const newPhone = {...request.body, id: maxId + 1};

    if(!newPhone || !newPhone.name || !newPhone.number){
        response.status(400).json({error: 'name and number has to be provided'});
    }

     if(phoneBook.some(phone => phone.name === newPhone.name)){
        response.status(400).json({error: 'name has to be unique'});
    }
    phoneBook = phoneBook.concat(newPhone);
    response.json(newPhone);
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    phoneBook = phoneBook.filter(phone => phone.id !== id);
    response.status(204).end();
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})