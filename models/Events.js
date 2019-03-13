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
    required: true,
    default: 'Point'
  },
  attendees: [{
    type: ObjectId,
    ref: 'User'
  }],
  items: [{
    type: ObjectId,
    ref: 'Items'
  }],
  imageUrl: String,
  comments: [{
    user: {
      type: String
    },
    message: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

eventsSchema.index({ location: '2dsphere' });

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;
