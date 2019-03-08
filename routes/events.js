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
  try {
    const event = await Events.findById(id).populate('owner').populate('attendees');
    console.log(event);
    res.render('events/details', event);
  } catch (err) {
    next(err);
  }
});

router.post('/add-item', requireLogged, async (req, res, next) => {
  const { id, itemName, itemQuantity } = req.body;
  console.log(itemQuantity);
  try {
    const event = await Events.findByIdAndUpdate(id, { $push: { items: { name: itemName, quantity: itemQuantity } } }, { new: true });
    res.redirect(`/events/${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
