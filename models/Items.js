'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const itemsSchema = new Schema({
  name: {
    type: String
  },
  quantity: {
    type: Number,
    min: 0,
    default: 1
  },
  status: {
    type: String
  },
  carriers: [{
    type: ObjectId,
    ref: 'User'
  }],
  event: {
    type: ObjectId,
    ref: 'Event'
  }
});

const Items = mongoose.model('Items', itemsSchema);

module.exports = Items;
