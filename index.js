require('dotenv').config()
const express = require('express')
const app = express()
var cors = require('cors');
var bodyParser = require("body-parser");
var morgan = require('morgan')
app.use(morgan('tiny'))
const Number = require('./models/number')
const mongoose = require('mongoose')

morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// const name = process.argv[3]
// const phoneNumber = process.argv[4]

// const phoneNumberSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// phoneNumberSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "phoneNumber": "040-123456",
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "phoneNumber": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "phoneNumber": "12-43-12345",
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendick",
//     "phoneNumber": "39-23-6423122",
//   },
// ]

// landing page
app.get('/api/info', (req, res) => {
  res.send('<h1>Welcome to use phonebook</h1>')
})

// fetch all
app.get('/api/persons', (req, res) => {
  //res.json(persons)
  Number.find({}).then(numbers => {
    res.json(numbers)
  })
  .catch(error => next(error))
})

// info page
app.get('/api/info', (req, res) => {
  // res.send(
  //   `<p>Phonebook has info for ${persons.length} people</p>
  //   <p>${new Date()}</p>`
  // )
  Number.find({}).then(numbers => {
    res.send(
      `<p>Phonebook has info for ${numbers.length} people</p>
      <p>${new Date()}</p>`
    );
  })
  .catch(error => next(error))
})

// get specific person
app.get('/api/persons/:id', (req, res) => {
  // const id = request.params.id
  // const person = persons.find(person => person.id === parseInt(id,10));

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
  Number.findById(req.params.id).then(person => {
    res.json(person)
  })
  .catch(error => next(error))
})

// add person
app.post('/api/persons', (req, res, next) => {
  // const id = rand = Math.floor(Math.random() * 9999);
  const person = req.body
  // person.id = id + 1;

  if (!person.name || !person.phoneNumber) {
    return res.status(400).json({ 
      error: 'Name or phone number missing' 
    })
  } else {
    Number.find({ name: person.name}).then(p=> {
      if (!p || !p?.name) {
        const personNumber = new Number({
          name: person.name,
          phoneNumber: person.phoneNumber,
        })
   
        personNumber.save()
          .then(result => {
            res.json(result)
          })
          .catch(error => { 
            next(error)}
          )
      }
    })
    .catch(error => { 
      next(error)}
    )
  }
})

// update person
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    phoneNumber: body.phoneNumber,
  }

  Number.findByIdAndUpdate(body.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// delete specific person
app.delete('/api/persons/:id', (req, res, next) => {
  Number.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))

  // const id = Number(request.params.id)
  // persons = persons.filter(person => person.id !== id)
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})