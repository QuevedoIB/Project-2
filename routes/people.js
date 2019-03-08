'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Events = require('../models/Events');
const ObjectId = require('mongodb').ObjectID;

const { requireLogged, requireFieldsSignUp, requireFieldsLogIn } = require('../middlewares/auth');

router.get('/:id/list', requireLogged, async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Events.findById(id);
    const eventContent = {
      event
    };
    res.render('people/search', { eventContent });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/search-people', requireLogged, async (req, res, next) => {
  const { username } = req.query;
  const { id } = req.params;

  try {
    const event = await Events.findById(id);
    const eventContent = {
      event
    };
    if (!username || username === req.session.currentUser.username) {
      res.render('people/search', { eventContent });
      return;
    }
    const searchedUser = await User.findOne({ username });
    if (searchedUser) {
      eventContent.searchedUser = searchedUser;
    }

    res.render('people/search', { eventContent });
  } catch (err) {
    next(err);
  }
});

router.post('/add-people', requireLogged, async (req, res, next) => {
  const { eventId, guestId } = req.body;
  const objectGuestId = ObjectId(guestId);
  try {
    const guest = await User.findById(guestId);
    if (guest) {
      const event = await Events.findById(eventId);
      event.attendees.forEach((attendee) => {
        if (attendee.equals(guestId)) {
          // flash user already attending to that event
          return res.redirect(`/people/${eventId}/search-people`);
        }
      });
      const eventAddedAttendee = await Events.findByIdAndUpdate(eventId, { $push: { attendees: guestId } }, { new: true });
    }
    res.redirect(`/people/${eventId}/search-people`);
  } catch (err) {
    next(err);
  }
});

// router.post('/delete-people', requireLogged, async (req, res, next) => {
//   const { guestId, eventId } = req.body;
//   try {
//     const event = Events.findById(eventId);

//   }
// });

module.exports = router;
