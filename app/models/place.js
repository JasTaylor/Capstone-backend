const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  url: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Place', placeSchema)
