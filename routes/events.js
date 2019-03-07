'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Events = require('../models/Events');

const { requireLogged, requireFieldsSignUp, requireFieldsLogIn } = require('../middlewares/auth');

/* SIGNUP */
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
    console.log(result);
    // res.redirect(`/events/${result._id}`);
    res.redirect('/');
  } catch (err) {
    next(err);
  };
});

module.exports = router;
