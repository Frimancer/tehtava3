const express = require('express')
const app = express()
var bodyParser = require("body-parser");
var morgan = require('morgan')
app.use(morgan('tiny'))

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())

var cors = require('cors');

// use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'}));

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "phoneNumber": "040-123456",
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "phoneNumber": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "phoneNumber": "12-43-12345",
  },
  {
    "id": 4,
    "name": "Mary Poppendick",
    "phoneNumber": "39-23-6423122",
  },
]

// landing page
app.get('/api/info', (req, res) => {
  res.send('<h1>Welcome to use phonebook</h1>')
})

// fetch all
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// info page
app.get('/api/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  )
})

// get specific person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === parseInt(id,10));

  if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

// delete specific person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  console.log("------request------");
  const id = rand = Math.floor(Math.random() * 9999);
  console.log(request.body);
  const person = request.body
  person.id = id + 1;

  if (!person.name || !person.phoneNumber) {
    return response.status(400).json({ 
      error: 'Name or phone number missing' 
    })
  } else {
    const existingname = persons.find(p => p.name === person.name);

    if (existingname) {
      return response.status(400).json({ 
        error: 'Name must be unique' 
      })
    } else {
      persons = persons.concat(person)
      response.json(person)
    }
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})