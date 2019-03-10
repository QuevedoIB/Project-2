'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
    // default: 'https://www.caduceosalud.es/wp-content/uploads/2013/09/silueta.png'
  },
  googleID: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
