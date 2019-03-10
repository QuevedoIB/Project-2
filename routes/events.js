'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Events = require('../models/Events');
const Items = require('../models/Items');
const ObjectId = require('mongodb').ObjectID;

const { requireLogged, requireFieldsSignUp, requireFieldsLogIn } = require('../middlewares/auth');

router.get('/', requireLogged, async (req, res, next) => {
  const user = req.session.currentUser._id;
  const currentDate = new Date().toISOString();
  try {
    const owned = await Events.find({ owner: user });
    const participating = await Events.find({ attendees: { '$in': [user] } });
    const finished = await Events.find({ date: { $lt: currentDate } });
    const events = { owned, participating, finished };
    res.render('events/list', { events });
  } catch (err) {
    next(err);
  }
});

router.get('/new', requireLogged, (req, res, next) => {
  res.render('profile/new');
});

router.post('/add', async (req, res, next) => {
  const owner = req.session.currentUser._id;
  const { name, description, location, date } = req.body;
  const event = { owner, name, description, location, date };
  if (!owner || !name || !location || !date) {
    // required fields
    res.redirect('/events/new');
    return;
  };
  try {
    const result = await Events.create(event);
    res.redirect(`/events/${result._id}`);
  } catch (err) {
    next(err);
  };
});

router.get('/:id', requireLogged, async (req, res, next) => {
  const { id } = req.params;
  const currentUserId = req.session.currentUser._id;
  try {
    const event = await Events.findById(id).populate('owner').populate('attendees').populate('items');
    let isCreator = false;
    if (event.owner._id.equals(currentUserId)) {
      isCreator = true;
    }
    res.render('events/details', { event, isCreator });
  } catch (err) {
    next(err);
  }
});

router.post('/add-item', requireLogged, async (req, res, next) => {
  const { event, name, quantity } = req.body;
  const itemObject = { name, quantity, event };
  if (!name || !quantity || !event) {
    // required fields
    res.redirect(`/events/${event}`);
    return;
  };
  try {
    const item = await Items.create(itemObject);
    const itemId = item._id;
    const eventUpdate = await Events.findByIdAndUpdate(event, { $push: { items: itemId } }, { new: true });
    res.redirect(`/events/${event}`);
  } catch (err) {
    next(err);
  }
});

router.post('/take-item', requireLogged, async (req, res, next) => {
  const { quantity, name, event } = req.body;
  const user = req.session.currentUser;
  try {
    const itemArray = await Items.find({ $and: [{ name }, { event }] }).lean();
    if (itemArray) {
      const newQuantity = itemArray[0].quantity - parseInt(quantity);
      if (itemArray[0].carriers.length) {
        const checkUsers = itemArray[0].carriers.some(e => e.user == user._id);
        if (checkUsers) {
          const carrier = itemArray[0].carriers.map(carrierData => {
            if (carrierData.user == user._id) {
              let finalQuantity = parseInt(quantity) + carrierData.quantity;
              carrierData.quantity = finalQuantity;
            }
            return carrierData;
          });
          await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'carriers': carrier, 'quantity': newQuantity } }, { new: true });
          const itemQuantityUpdated = await Items.find({ $and: [{ name }, { event }] }).lean();
          if (itemQuantityUpdated[0].quantity < 1) {
            await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'status': '' } }, { new: true });
          }
          return res.redirect(`/events/${event}`);
        } else {
          const newCarrier = {
            user: user._id,
            quantity: quantity
          };
          await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'quantity': newQuantity } }, { new: true });
          await Items.findOneAndUpdate({ name }, { $push: { carriers: newCarrier } }, { new: true });
          const itemQuantityUpdated = await Items.find({ $and: [{ name }, { event }] }).lean();
          if (itemQuantityUpdated[0].quantity < 1) {
            await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'status': '' } }, { new: true });
          }
          return res.redirect(`/events/${event}`);
        }
      }
      const newCarrier = {
        user: user._id,
        quantity: quantity
      };
      await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'quantity': newQuantity } }, { new: true });
      await Items.findOneAndUpdate({ name }, { $push: { carriers: newCarrier } }, { new: true });
      const itemQuantityUpdated = await Items.find({ $and: [{ name }, { event }] }).lean();
      console.log(itemQuantityUpdated);
      if (itemQuantityUpdated[0].quantity < 1) {
        await Items.findOneAndUpdate({ $and: [{ name }, { event }] }, { $set: { 'status': '' } }, { new: true });
      }
      res.redirect(`/events/${event}`);
    };
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// { $set: { 'carriers': changedCarriers } }, { new: true });
