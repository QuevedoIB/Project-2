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
  items: [{
    name: {
      type: String
    },
    quantity: {
      type: Number
    },
    status: {
      enum: ['taken', 'available']
    }
  }]

});

// añadir modelo items

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;
