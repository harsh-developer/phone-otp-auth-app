const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 15,
    trim: true
  },
  isVerifiedPhone: {
    type: Boolean,
    default: false
  }
}, { timestamp: true })


module.exports = mongoose.model('User', userSchema)