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
    const eventData = await Events.findById(event).populate('items');
    eventData.items.forEach(async item => {
      try {
        if (item.name == name) {
          item.carriers.forEach(async carrier => {
            if (carrier.user == user._id) {
              let finalQuantity = quantity + carrier.quantity;
              // testing

              eventData.items.update({ 'carriers': { $elemMatch: { 'user': user._id } } }, { $set: { 'carriers.$.quantity': finalQuantity } });

              // await carrier.update({ $inc: { 'quantity': parseInt(quantity) } });
              console.log(carrier);
              // logica de restar a la quantity de item aqui
              return res.redirect(`/events/${event}`);
            }
          });
          const newCarrier = {
            'user': user._id,
            'quantity': quantity
          };
          await Items.findOneAndUpdate({ name }, { $push: { carriers: newCarrier } }, { new: true });
        }
      } catch (err) {
        next(err);
      }
    });
    // const itemUpdate = await Items.findByIdAndUpdate(eventData.items._id, { $push: { carriers: newItem } }, { new: true });
    console.log(eventData.items);
    res.redirect(`/events/${event}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// try {
//   const event = await Events.findById(id);
//   event.items.forEach(async function (item) {
//     if (itemName === item.name) {
//       const itemsBefore = item.quantity;
//       const itemsNow = parseInt(itemQuantity) + parseInt(itemsBefore);
//       await Events.findByIdAndUpdate(id, { items: { name: itemName, quantity: itemsNow } }, { new: true });
//       return res.redirect(`/events/${id}`);
//     }
//   });
//   // is creator
//   const eventUpdate = await Events.findByIdAndUpdate(id, { $push: { items: { name: itemName, quantity: itemQuantity } } }, { new: true });
//   res.redirect(`/events/${id}`);
// } catch (err) {
//   next(err);
// }

// if (eventData.items.carriers) {
//   eventData.items.carriers.forEach(async itemData => {
//     if (itemData._id === user._id) {
//       let finalQuantity = itemData.quantity + parseInt(quantity);
//       console.log(itemData);
//       // await event.update({"carriers.carrier."})
//       // await Items.findByIdAndUpdate(event.items._id, { carriers: user.username }, { quantity: finalQuantity });
//       return res.redirect(`/events/${event}`);
//     }
//   });
// }
// const newItem = {
//   _id: user._id,
//   'quantity': quantity
// };
// const itemUpdate = await Items.findByIdAndUpdate(eventData.items._id, { $push: { carriers: newItem } }, { new: true });
// console.log(eventData.items._id);
// res.redirect(`/events/${event}`);
// return;
// } catch (err) {
// next(err);
// };
// })
