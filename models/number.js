const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
// const url =
//   `mongodb+srv://fullstackmongo:${password}@mongo-klusteri-test.9jzf73f.mongodb.net/numbersApp?retryWrites=true&w=majority`
// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

console.log('connecting to', url);
mongoose.connect(url)
  .then(res => {
    console.log('connected to MongoDB')
  }).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// const password = process.argv[2]
// const name = process.argv[3]
// const phoneNumber = process.argv[4]

const phoneNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2
  },
  phoneNumber: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /\d{2}-\d{4}/.test(v);
      }
    }
  },
})

const Number = mongoose.model('Number', phoneNumberSchema)
phoneNumberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Number', phoneNumberSchema)

// if (!name && !number) { 
//   Number.find({}).then(result => {
//     console.log("phonebook:");
//     result.forEach(pNumber => {
//       console.log(`${pNumber.name} ${pNumber.number}`)
//     })
//     mongoose.connection.close()
//   })
// } else {
//   const phoneNumber = new Number({
//     name: name,
//     number: number,
//   })

//   phoneNumber.save().then(result => {
//     console.log(`added ${name} number ${number} to phonebook`)
//     mongoose.connection.close()
//   })
// }