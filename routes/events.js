'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Events = require('../models/Events');

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
    const event = await Events.findById(id).populate('owner').populate('attendees');
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
  const { id, itemName, itemQuantity } = req.body;
  try {
    const event = await Events.findById(id);
    event.items.forEach(async function (item) {
      if (itemName === item.name) {
        const itemsBefore = item.quantity;
        const itemsNow = parseInt(itemQuantity) + parseInt(itemsBefore);
        await Events.findByIdAndUpdate(id, { items: { name: itemName, quantity: itemsNow } }, { new: true });
        return res.redirect(`/events/${id}`);
      }
    });

    // is creator

    const eventUpdate = await Events.findByIdAndUpdate(id, { $push: { items: { name: itemName, quantity: itemQuantity } } }, { new: true });
    res.redirect(`/events/${id}`);
  } catch (err) {
    next(err);
  }
});

// router.post('/take-item', requireLogged, async (req, res, next) => {
//   const { itemQuantity, itemName, id } = req.body;
//   const user = req.session.currentUser;
//   try {
//     const event = await Events.findById(id);
//     event.items.forEach(async function (item) {
//       try {
//         if (itemName === item.name) {
//           item.carriers.forEach(carrier => {
//             if (carrier._id === user._id) {
//               carrier.quantity += itemQuantity;
//               return res.redirect(`/events/${id}`);
//             }
//           });
//           const newCarrier = {
//             _id: user._id,
//             quantity: itemQuantity
//           };
//           const eventUpdate = await Events.findByIdAndUpdate(id, { items: { $push: { carriers: { newCarrier } } } }, { new: true });
//           res.redirect(`/events/${id}`);
//         }
//       } catch (err) {
//         next(err);
//       }
//     });
//   } catch (err) {
//     next(err);
//   };
// });

module.exports = router;
