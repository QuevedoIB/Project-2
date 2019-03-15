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
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80'
  },
  comments: [{
    user: {
      type: String
    },
    message: String,
    date: {
      type: Date,
      default: Date.now
    },
    userImage: {
      type: String,
      default: 'https://www.caduceosalud.es/wp-content/uploads/2013/09/silueta.png'
    }
  }]
});

eventsSchema.index({ location: '2dsphere' });

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;
