'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventsSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  attendees: [{
    type: ObjectId,
    ref: 'User'
  }],
  toBring: [{
    name: String,
    quantity: Number,
    status: { enum: ['taken', 'available'] }
  }]

});

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;
