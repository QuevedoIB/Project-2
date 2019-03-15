'use strict';
const express = require('express');
const router = express.Router();
const parser = require('../helpers/file-upload');
const User = require('../models/User');
const { urlGoogle } = require('../helpers/google-util');
const { requireLogged } = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  const url = urlGoogle();

  res.render('index', { url });
});

router.get('/profile', requireLogged, async (req, res, next) => {
  const currentUser = req.session.currentUser;
  try {
    const user = await User.findById(currentUser._id);
    req.session.currentUser = user;
    res.render('profile/profile', user);
  } catch (err) {
    next(err);
  }
});

router.post('/profile-image', parser.single('image'), requireLogged, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.session.currentUser._id, { $set: { imageUrl: req.file.url } });
    const newSession = await User.findById(req.session.currentUser._id);
    req.session.currentUser = newSession;
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
