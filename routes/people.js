'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Events = require('../models/Events');

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

module.exports = router;
