'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// const itemsSchema = new Schema({
//   name: {
//     type: String
//   },
//   quantity: {
//     type: Number,
//     min: 0,
//     default: 1
//   },
//   status: {
//     type: String
//   },
//   user: {
//     type: Schema.ObjectId,
//     ref: 'User',
//     quantityTaken: {
//       type: Number
//     } // cantidad de items que coge el usuario (probando)
//   }
// });

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
  }]
});

eventsSchema.index({ location: '2dsphere' });

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;

// items: [{
//   name: {
//     type: String
//   },
//   quantity: {
//     type: Number
//   },
//   status: {
//     enum: ['taken', 'available']
//   }
// }]

// items: [{
//   name: {
//     type: String
//   },
//   quantity: {
//     type: Number
//   },
//   status: {
//     enum: ['taken', 'available']
//   }
// }],
// carriers: [{
//   items: {
//     type: String
//   },
//   carrier: {
//     type: String
//   },
//   quantity: {
//     type: Number
//   }
// }]
