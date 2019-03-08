'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Events = require('../models/Events');

const { requireLogged, requireFieldsSignUp, requireFieldsLogIn } = require('../middlewares/auth');

router.get('/search-people', requireLogged, (req, res, next) => {
  res.render('people/search');
});

router.post('/search-people', async (req, res, next) => {
  const { username } = req.body;
  try {
    const searchedUser = await User.findOne({ username });
    if (searchedUser) {
      console.log(searchedUser);
      res.render('people/search', { searchedUser });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
